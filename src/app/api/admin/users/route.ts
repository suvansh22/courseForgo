import { requireAuth } from "@/lib/auth/requireAuth";
import { createUser, listUsers } from "@/lib/data/userStore";
import {
  conflict,
  hasSession,
  invalidJson,
  serverError,
  unauthorized,
  validationFailed,
} from "@/lib/http/apiErrors";
import type { UserResponse, UsersResponse } from "@/types/user";
import { validateCreateUser } from "@/lib/validation/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await requireAuth();
    if (!hasSession(session)) return unauthorized();

    const users = await listUsers();
    return NextResponse.json<UsersResponse>({ users });
  } catch (error) {
    return serverError(error, "Failed to load users.");
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

    const { errors, user } = validateCreateUser(payload);
    if (errors) {
      return validationFailed(errors);
    }

    const created = await createUser(user!);
    if (!created) {
      return conflict("User with this id already exists.");
    }

    return NextResponse.json<UserResponse>({ user: created }, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create user.");
  }
};
