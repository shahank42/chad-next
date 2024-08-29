"use server";

import { createUserViaGithubQuery, getUserByGithubIdQuery } from "@/server/db/queries/user";
import { GitHubUser } from "./route";

export async function getUserByGithubId(githubId: string) {
  return await getUserByGithubIdQuery(githubId);
}

export async function registerGithubUser(githubUser: GitHubUser) {
  const newUser = await createUserViaGithubQuery(githubUser.id, githubUser.email)
  return newUser[0]?.id
}