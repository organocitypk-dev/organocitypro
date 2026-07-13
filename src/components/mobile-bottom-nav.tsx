"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923171707418";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openChat = () =>
    window.dispatchEvent(new CustomEvent("open-mobile-chat"));

  const homeActive = isActive("/");
  const productsActive = isActive("/products");

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="border-t border-white/10 bg-[#1E1F1C] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(0,0,0,0.16)]">
        <div className="mx-auto flex min-h-14 max-w-lg items-stretch justify-around px-1">
          {/* AI Chat */}
          <button
            onClick={openChat}
            aria-label="Open AI chat"
            className="flex min-w-0 flex-1 items-center justify-center rounded-lg transition-colors active:bg-white/10"
          >
            <BsChatDots className="h-5 w-5 text-[#C6A24A]" />
          </button>

          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            className={`flex min-w-0 flex-1 items-center justify-center rounded-lg transition-colors active:bg-white/10 ${
              homeActive ? "text-[#C6A24A]" : "text-gray-400"
            }`}
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* Products */}
          <Link
            href="/products"
            aria-label="Products"
            className={`flex min-w-0 flex-1 items-center justify-center rounded-lg transition-colors active:bg-white/10 ${
              productsActive ? "text-[#C6A24A]" : "text-gray-400"
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </Link>

          {/* Phone */}
          <a
            href={`tel:+${PHONE_NUMBER}`}
            aria-label="Call us"
            className="flex min-w-0 flex-1 items-center justify-center rounded-lg text-gray-400 transition-colors active:bg-white/10"
          >
            <Phone className="h-5 w-5" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${PHONE_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex min-w-0 flex-1 items-center justify-center rounded-lg text-gray-400 transition-colors active:bg-white/10"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
