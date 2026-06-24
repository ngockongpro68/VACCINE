import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaccine Check",
  description:
    "Country-based vaccine schedule checker with antigen mapping, catch-up timing, and vaccine-switching support.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
