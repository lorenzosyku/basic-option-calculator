
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "../lib/auth/context/AuthContext";
import Header from "./components/Header";


export const metadata: Metadata = {
  title: "Option Trading Starter",
  description: "Understand the power of options trading",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
      
        <AuthProvider>
          <Header/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
