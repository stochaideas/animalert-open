import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSORedirect() {
  return <AuthenticateWithRedirectCallback />;
}
