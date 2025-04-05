import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Footer from "./_components/footer";

export const metadata: Metadata = {
  title: "Animalert",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  style: "normal",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <body>
        <main className="bg-neutral flex min-h-screen flex-col items-stretch justify-between">
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Footer />
        </main>
      </body>
    </html>
  );
}
