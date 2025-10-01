import { AuthenticateWithRedirectCallback } from "~/lib/clerk";

export default function SSORedirect() {
  return <AuthenticateWithRedirectCallback />;
}
