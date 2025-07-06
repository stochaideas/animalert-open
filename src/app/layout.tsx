import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Footer from "../components/ui/complex/footer";
import Navbar from "../components/ui/complex/navbar";
import { Toaster } from "~/components/ui/simple/sonner";

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
    <html lang="en" className={`${poppins.className}`}>
      <body>
        <main className="bg-neutral flex min-h-screen flex-col items-stretch justify-between lg:h-screen">
          <Navbar />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Footer />
        </main>
        <Toaster position="bottom-center"/>
      </body>
    </html>
  );
}
