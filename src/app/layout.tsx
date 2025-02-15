import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Providers } from "~/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "PSM Xam",
  description: "A node-based, visual programming language for audio",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={`font-sans ${inter.variable}`}>{children}</body>
      </Providers>
    </html>
  );
}
