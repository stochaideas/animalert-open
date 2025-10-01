import { SignedIn, SignedOut, SignInButton, UserButton } from "~/lib/clerk";
import { Button } from "../simple/button";

export default function AuthButton() {
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
