
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import SessionWrapper from "@/components/my-components/SessionWrapper";
import { ReactQueryClientProvider } from "@/components/my-components/ReactQueryProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import NewSidebar from "@/components/my-components/newSidebar";
const APP_NAME = "Bee Well";
const APP_DEFAULT_TITLE = "Bee Well";
const APP_TITLE_TEMPLATE = "%s - Bee Well";
const APP_DESCRIPTION = "A productivity app to help you stay organized and focused. Take notes and journal, and track habits all in one place. all with ai that helps you be more productive and mindful.";

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

const inter = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <SidebarProvider>
            <ReactQueryClientProvider>
              <NewSidebar />
              <main className="flex-1 w-full bg-neutral-300 relative">
                <div className="absolute top-4 left-4 z-10">
                  <SidebarTrigger />
                </div>
                {children}
              </main>
              <Toaster />
            </ReactQueryClientProvider>
          </SidebarProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
