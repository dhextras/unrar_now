import Header from "@/components/Header";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Unrar Now",
  description: "Unrar Any files securely within seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="absolute inset-0 flex flex-col bg-white">
        <Header />
        <main className="flex-grow overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
