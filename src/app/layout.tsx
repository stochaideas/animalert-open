import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Footer from "../components/ui/complex/footer";
import Navbar from "../components/ui/complex/navbar";
import { Toaster } from "~/components/ui/simple/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "~/env";
import { roRO } from "@clerk/localizations";

export const metadata: Metadata = {
  title: "Animalert",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  style: "normal",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      localization={roRO}
      appearance={{
        variables: {
          colorPrimary: "#395a03",
          borderRadius: "0.375",
          fontFamily: "Poppins",
        },
        elements: {
          card: "",
          formButtonPrimary:
            "bg-secondary text-white font-semibold rounded-md py-2 px-4",
          footerActionLink: "text-secondary hover:underline cursor-pointer",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className={`${poppins.className}`}>
        <body>
          <main className="bg-neutral flex min-h-screen flex-col items-stretch justify-between lg:h-screen">
            <Navbar />
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Footer />
          </main>
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
