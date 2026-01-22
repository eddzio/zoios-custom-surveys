import type { Metadata } from "next";
import { Poppins, Bitter } from "next/font/google";
import { Toaster } from "sonner";
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
      <body className={`${poppins.className} ${bitter.variable}`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              padding: '16px 20px',
              fontSize: '16px',
            },
          }}
          icons={{
            success: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 20, height: 20 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ),
          }}
        />
      </body>
    </html>
  );
}
