import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatIntegrations } from "@/components/chat-integrations";
import { SiteLoader } from "@/components/SiteLoader";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <SiteLoader />
        <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ChatIntegrations />
    </div>
  );
}

