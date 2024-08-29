import { UserId } from "@/types";
import { db } from "..";
import { eq } from "drizzle-orm";
import { userTable } from "../schema";

export const getUserQuery = async (userId: UserId) =>
  await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });

export const getUserByEmailQuery = async (email: string) =>
  await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

export const getUserByGithubIdQuery = async (githubId: string) =>
  await db.query.userTable.findFirst({
    where: eq(userTable.githubId, githubId),
  });

export const createUserViaGithubQuery = async (githubId: string, email: string) =>
  await db
    .insert(userTable)
    .values({
      email,
      accountType: "github",
      githubId,
    })
    .onConflictDoNothing()
    .returning()