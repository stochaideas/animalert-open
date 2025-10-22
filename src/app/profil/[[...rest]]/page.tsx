import { UserProfile } from "@clerk/nextjs";

const hasClerkIntegration = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

export default function ReportsPage() {
  if (!hasClerkIntegration) {
    return (
      <main className="bg-neutral flex min-h-screen items-center justify-center p-4 text-center">
        Autentificarea nu este configurată. Te rugăm să setezi variabila de
        mediu NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY pentru a accesa această pagină.
      </main>
    );
  }

  return (
    <main className="bg-neutral flex items-center justify-center p-4">
      <UserProfile />
    </main>
  );
}
