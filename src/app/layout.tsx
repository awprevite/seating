import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seating",
  description: "Poker seating",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header></header>
        <main>{children}</main>
      </body>
    </html>
  );
}
