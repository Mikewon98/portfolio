import ClientLayout from "./components/ClientLayout";
import { siteMetadata } from "../lib/site-metadata";
import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
