import type { Metadata } from "next";
import { Poppins, Bitter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const bitter = Bitter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bitter",
});

export const metadata: Metadata = {
  title: "Custom Surveys Prototype",
  description: "Question editor prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${bitter.variable}`}>{children}</body>
    </html>
  );
}
