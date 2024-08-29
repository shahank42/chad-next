import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { AFTER_SIGN_IN_URL } from "@/config";
import { github } from "@/server/auth";
import { getUserByGithubId, registerGithubUser } from "./actions";
import { setSession } from "@/server/auth/actions";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await getUserByGithubId(githubUser.id);

    if (existingUser) {
      await setSession(existingUser.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: AFTER_SIGN_IN_URL,
        },
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );
      const githubUserEmails = await githubUserEmailResponse.json();

      githubUser.email = getPrimaryEmail(githubUserEmails);
    }

    const userId = await registerGithubUser(githubUser);
    if (!userId) {
      // TODO: Throw an error telling it was the server's fault
      return new Response(null, {
        status: 500,
      });
    }

    await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: AFTER_SIGN_IN_URL,
      },
    });
  } catch (e) {
    console.error(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

const getPrimaryEmail = (emails: Email[]): string => emails.find((email) => email.primary)!.email;

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}