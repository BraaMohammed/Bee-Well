
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import SessionWrapper from "@/components/my-components/SessionWrapper";
const APP_NAME = "Bee Well";
const APP_DEFAULT_TITLE = "Bee Well";
const APP_TITLE_TEMPLATE = "%s - Bee Well";
const APP_DESCRIPTION = "created by mind flow ai ";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
};

const inter = Poppins({ subsets: ["latin"] , weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

/*export const metadata = {
  title: "Bee Well",
  description: "Devolped By Mind Flow Ai",
};*/

export default function RootLayout({ children }) {
  
  return (
    <SessionWrapper>
    <html lang="en">
      
      <body className={inter.className}>{children}
        <Toaster/>
      </body>
    </html>
    </SessionWrapper>
  );
}
