import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const hasClerkIntegration = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

export default function SSORedirect() {
  if (!hasClerkIntegration) {
    return null;
  }

  return <AuthenticateWithRedirectCallback />;
}
