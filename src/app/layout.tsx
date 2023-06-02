import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Congreso Nacional de Marketing Politico Colombia",
  description: "Congreso Nacional de Marketing Politico Colombia",
  "facebook-domain-verification": "jt2ot27pe1huad2jmb79us4h59gucj",
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
