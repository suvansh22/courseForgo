import { requireAuth } from "@/lib/auth/requireAuth";
import { getCourseById } from "@/lib/data/courseStore";
import { createPurchase, listPurchases } from "@/lib/data/purchaseStore";
import { getUserById } from "@/lib/data/userStore";
import {
  conflict,
  hasSession,
  invalidJson,
  notFound,
  serverError,
  unauthorized,
  validationFailed,
} from "@/lib/http/apiErrors";
import {
  generateDriveDownloadLink,
  grantDriveReadAccess,
} from "@/lib/integrations/googleDrive";
import { validateCreatePurchase } from "@/lib/validation/purchase";
import type { PurchaseResponse, PurchasesResponse } from "@/types/purchase";
import { NextResponse } from "next/server";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const GET = async () => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const purchases = await listPurchases();
    return NextResponse.json<PurchasesResponse>({ purchases });
  } catch (error) {
    return serverError(error, "Failed to load purchases.");
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return invalidJson();
    }

    const { errors, purchase } = validateCreatePurchase(payload);
    if (errors) {
      return validationFailed(errors);
    }

    const [user, course] = await Promise.all([
      getUserById(purchase!.userId),
      getCourseById(purchase!.courseId),
    ]);
    if (!user) {
      return notFound("User not found.");
    }
    if (!course) {
      return notFound("Course not found.");
    }

    const created = await createPurchase(purchase!);
    if (!created) {
      return conflict("Purchase with this id already exists.");
    }

    if (!isNonEmptyString(user.email)) {
      return notFound("User email not found.");
    }

    const assetId = payload.assetId as string;

    if (created.accessType === "read_only") {
      if (!isNonEmptyString(assetId)) {
        return validationFailed([
          "folderId is required for read_only purchase when targetType is folder.",
        ]);
      }

      const permission = await grantDriveReadAccess({
        assetId: assetId.trim(),
        email: user.email,
      });

      return NextResponse.json<PurchaseResponse>(
        {
          purchase: created,
          delivery: {
            mode: "read_only",
            targetId: assetId.trim(),
            permissionId: permission.id,
          },
        },
        { status: 201 },
      );
    }

    const delivery = await generateDriveDownloadLink({
      assetId: assetId.trim(),
      email: user.email,
      ensureReadAccess: true,
    });

    return NextResponse.json<PurchaseResponse>(
      {
        purchase: created,
        delivery: {
          mode: "can_download",
          downloadLink: delivery.downloadLink,
          webViewLink: delivery.webViewLink,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return serverError(error, "Failed to create purchase.");
  }
};
