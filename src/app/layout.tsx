import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keboola Connection",
  description: "Modern data platform UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
