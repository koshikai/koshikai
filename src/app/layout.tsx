import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-m-plus-rounded",
});

export const metadata: Metadata = {
  title: "koshikai.dev | Building apps that make life better",
  description: "Portfolio of koshikai - Personal Developer & Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${mPlusRounded1c.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
