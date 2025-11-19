import { UserProfile } from "@clerk/nextjs";

export default function ReportsPage() {
  return (
    <main className="bg-neutral flex items-center justify-center p-4">
      <UserProfile />
    </main>
  );
}
