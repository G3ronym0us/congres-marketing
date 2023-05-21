import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Congreso Nacional de Marketing Politico Colombia",
  description: "Congreso Nacional de Marketing Politico Colombia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ height: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
