
import { Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

const inter = Poppins({ subsets: ["latin"] , weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export const metadata = {
  title: "Bee Well",
  description: "Devolped By Mind Flow Ai",
};

export default function RootLayout({ children }) {
  
  return (
    <SessionWrapper>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </SessionWrapper>
  );
}
