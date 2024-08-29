"use client";

import { signOut } from "@/server/auth/actions";
import { Button } from "./ui/button";

export default function SignOutItem() {
  return (
    <Button
      variant="link"
      onClick={async () => {
        await signOut();
      }}
    >
      Sign Out
    </Button>
  );
}
