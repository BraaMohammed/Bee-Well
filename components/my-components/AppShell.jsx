"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewSidebar from "@/components/my-components/newSidebar";

const AUTH_PATHS = ["/signin", "/signup"];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname ?? "");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <NewSidebar />
      <main className="flex-1 w-full bg-neutral-300 relative">
        <div className="absolute top-4 left-4 z-10">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
