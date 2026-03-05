import { requireAuth } from "@/lib/auth/requireAuth";
import {
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
import { NextResponse } from "next/server";

type TestDriveMode = "read_only" | "can_download";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const POST = async (request: Request) => {
  try {
    if (process.env.ENABLE_DRIVE_TEST_API !== "true") {
      return notFound("Route not found.");
    }

    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return invalidJson();
    }

    const mode = payload.mode as string;
    const assetId = payload.assetId as string;
    const email = payload.email as string;

    const errors: string[] = [];
    if (mode !== "read_only" && mode !== "can_download") {
      errors.push("mode must be either read_only or can_download.");
    }
    if (!isNonEmptyString(email)) {
      errors.push("email is required.");
    }
    if (!isNonEmptyString(assetId)) {
      errors.push("Id is required.");
    }

    if (errors.length > 0) {
      return validationFailed(errors);
    }

    if (mode === "read_only") {
      const permission = await grantDriveReadAccess({
        assetId: assetId.trim(),
        email: (email as string).trim(),
      });

      return NextResponse.json(
        {
          ok: true,
          mode: "read_only" as TestDriveMode,
          targetId: assetId.trim(),
          email: (email as string).trim(),
          permissionId: permission.id,
        },
        { status: 200 },
      );
    }

    const delivery = await generateDriveDownloadLink({
      assetId: assetId.trim(),
      email: (email as string).trim(),
      ensureReadAccess: true,
    });

    return NextResponse.json(
      {
        ok: true,
        mode: "can_download" as TestDriveMode,
        email: (email as string).trim(),
        delivery,
      },
      { status: 200 },
    );
  } catch (error) {
    return serverError(error, "Failed to run Drive test API.");
  }
};
