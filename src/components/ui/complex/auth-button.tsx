import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../simple/button";

const hasClerkIntegration = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

export default function AuthButton() {
  if (!hasClerkIntegration) {
    return null;
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="neutral">Autentificare</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonTrigger: "cursor-pointer hover:opacity-80 transition",
            },
          }}
        />
      </SignedIn>
    </>
  );
}
