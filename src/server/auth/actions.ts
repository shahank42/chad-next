"use server";

import { redirect } from "next/navigation";
import { lucia, validateRequest } from "@/server/auth";
import { cookies } from "next/headers";
import { AFTER_SIGN_OUT_URL } from "@/config";
import { cache } from "react";
import { User } from "lucia";
import { UserId } from "@/types";
import { AuthenticationError } from "@/lib/errors";

/**
 * Signs out the user.
 * 
 * @returns {Promise<void>} A promise that resolves when the sign out process is complete.
 */
export async function signOut(): Promise<void> {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect(AFTER_SIGN_OUT_URL);
}

/**
 * Retrieves the current user from the session.
 *
 * @returns {Promise<User | undefined>} The current user or undefined if not found.
 */
export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return undefined;
  return session.user;
});

/**
 * Asserts that the user is authenticated.
 *
 * @throws {AuthenticationError} If the user is not authenticated.
 * @returns {Promise<User>} The authenticated user.
 */
export const assertAuthenticated = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) throw new AuthenticationError();
  return user;
};

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}