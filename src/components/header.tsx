"use client";

import { useCart } from "@/lib/commerce";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  ChevronDown,
} from "@esmate/shadcn/pkgs/lucide-react";
import { Button } from "@esmate/shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@esmate/shadcn/components/ui/sheet";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { CartDrawer } from "./cart-drawer";
import { searchProducts } from "./search/actions";
import Image from "next/image";

const mainMenuItems = [
  { text: "Home", href: "/" },
  { text: "Benefits", href: "/benefits" },
  { text: "Blogs", href: "/blogs" },
  { text: "About Us", href: "/about-us" },
  { text: "Contact Us", href: "/contact" },
  { text: "Certificates", href: "/certificates" },
  { text: "Bulk Order", href: "/bulk-order" },
  { text: "Co-message", href: "/co-message" },
];

async function getShopCategories() {
  const res = await fetch("/api/categories", { next: { revalidate: 60 } });
  const data = await res.json();
  return data.categories || [];
}

export function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [shopCategories, setShopCategories] = useState<{id: string; name: string; slug: string; image: string | null}[]>([]);

  useEffect(() => {
    getShopCategories().then(setShopCategories);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  // Search functionality
  useEffect(() => {
    async function performSearch() {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const products = await searchProducts(searchQuery);
        setSearchResults(products);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
    const timeout = setTimeout(performSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-[#F6F1E7] border-b border-[#C6A24A]/20">
       <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:h-20 lg:px-8">
          {/* Mobile Menu Button - left side */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-[#1E1F1C] hover:text-[#1F6B4F]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[320px] border-r-0 bg-[#F6F1E7] p-0"
              >
                <SheetTitle className="sr-only">Mobile menu</SheetTitle>
                <div className="flex h-full flex-col">
                  {/* Logo in Mobile Menu */}
                  <div className="p-6">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <div className="relative h-14 w-[130px]">
                        <Image
                          src="/logo/organocityBackup.png"
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-1">
                      <Link
                        href="/"
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          pathname === "/"
                            ? "bg-[#1F6B4F]/10 text-[#1F6B4F]"
                            : "hover:bg-white/60 text-[#1E1F1C]"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>

                      {/* Shop Section in Mobile */}
                      <div className="mt-4">
                        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#5A5E55]">
                          Shop Categories
                        </div>

                        <div className="space-y-1">
                          {shopCategories.map((item) => (
                            <Link
                              key={item.id}
                              href={`/category/${item.slug}`}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive(`/category/${item.slug}`)
                                  ? "bg-[#1F6B4F]/10 text-[#1F6B4F]"
                                  : "hover:bg-white/60 text-[#1E1F1C]"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="relative h-8 w-8 overflow-hidden rounded border border-[#C6A24A]/25">
                                <Image
                                  src={item.image || "/logo/organocityBackup.png"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Other Menu Items */}
                      <div className="mt-6 border-t border-[#C6A24A]/25 pt-4">
                        {mainMenuItems
                          .filter((i) => i.text !== "Home")
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive(item.href)
                                  ? "bg-[#1F6B4F]/10 text-[#1F6B4F]"
                                  : "hover:bg-white/60 text-[#1E1F1C]"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.text}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="border-t border-[#C6A24A]/25 p-6">
                    <div className="flex items-center justify-center gap-4">
                      {/* Mobile Search Toggle inside menu */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-[#1E1F1C] hover:text-[#1F6B4F]"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSearchOpen(true);
                        }}
                      >
                        <Search className="h-5 w-5" />
                      </Button>

                      <button
                        className="relative text-[#1E1F1C] hover:text-[#1F6B4F] transition-colors"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCartOpen(true);
                        }}
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {!!totalQuantity && (
                          <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full p-0 text-xs bg-[#1F6B4F] text-[#F6F1E7]">
                            {totalQuantity}
                          </Badge>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - centered */}
          <Link href="/" className="flex flex-1 justify-center">
            <div className="relative h-16 w-[160px] lg:h-28 lg:w-[170px]">
              <Image
                src="/logo/organocityBackup.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Right Side - Search + Cart */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[#1E1F1C] hover:text-[#1F6B4F]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-[#1E1F1C] hover:text-[#1F6B4F]"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {!!totalQuantity && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#1F6B4F] p-0 text-xs text-[#F6F1E7]">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </Badge>
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors hover:text-[#1F6B4F] ${
                pathname === "/" ? "text-[#1F6B4F]" : "text-[#1E1F1C]"
              }`}
            >
              Home
            </Link>

            {/* Compact Mega Menu */}
            <div className="relative">
              <div className="group">
                <div className="flex cursor-pointer items-center gap-1">
                  <Link
                    href="/products"
                    className={`text-sm font-semibold transition-colors hover:text-[#1F6B4F] ${
                      isActive("/products") || isActive("/category")
                        ? "text-[#1F6B4F]"
                        : "text-[#1E1F1C]"
                    }`}
                  >
                    Products
                  </Link>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-[#5A5E55]" />
                </div>

                {/* Hover buffer */}
                <div className="absolute left-1/2 top-full h-4 w-32 -translate-x-1/2" />

                {/* Compact Mega Menu Dropdown */}
                <div className="absolute left-1/2 top-full z-50 mt-4 w-[560px] -translate-x-1/2 opacity-0 pointer-events-none scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100">
                  <div className="overflow-hidden rounded-xl border border-[#C6A24A]/25 bg-white p-2 shadow-2xl">
                    <div className="grid grid-cols-4 gap-0.5 p-0.5">
                      {shopCategories.slice(0, 8).map((item) => (
                        <Link
                          key={item.id}
                          href={`/category/${item.slug}`}
                          className={`group relative m-1 flex flex-col items-center rounded-lg p-3 transition-all hover:bg-[#1F6B4F]/5 hover:shadow-sm ${
                            isActive(`/category/${item.slug}`) ? "bg-[#1F6B4F]/5" : ""
                          }`}
                        >
                          <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full border border-[#C6A24A]/25">
                            <Image
                              src={item.image || "/logo/organocityBackup.png"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="56px"
                            />
                          </div>

                          <p
                            className={`text-center text-xs font-semibold leading-tight ${
                              isActive(`/category/${item.slug}`)
                                ? "text-[#1F6B4F]"
                                : "text-[#1E1F1C]"
                            }`}
                          >
                            {item.name}
                          </p>

                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-all group-hover:ring-[#1F6B4F]/20" />
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-[#C6A24A]/20 bg-[#F6F1E7]/40 p-3">
                      <Link
                        href="/products"
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5A5E55] transition-colors hover:text-[#1F6B4F]"
                      >
                        View all products
                        <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Desktop Menu Items */}
            {mainMenuItems
              .filter((i) => i.text !== "Home")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors hover:text-[#1F6B4F] ${
                    isActive(item.href) ? "text-[#1F6B4F]" : "text-[#1E1F1C]"
                  }`}
                >
                  {item.text}
                </Link>
              ))}
          </div>

          {/* Desktop Actions - Right side (desktop only) */}
          <div className="hidden lg:flex flex-1 justify-end gap-3 relative">
            {/* Desktop Inline Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="absolute right-0 top-0 z-50 flex items-center bg-white border-2 border-[#C6A24A]/30 rounded-lg overflow-hidden transition-all shadow-sm w-64">
                  <Search className="h-4 w-4 text-[#5A5E55] ml-3 shrink-0" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      setTimeout(() => setSearchOpen(false), 150);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    className="flex-1 px-3 py-2 bg-transparent text-sm outline-none placeholder:text-[#5A5E55]/60 text-[#1E1F1C]"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="px-2 text-[#5A5E55] hover:text-[#1E1F1C] shrink-0"
                    >
                      <Search className="h-4 w-4 rotate-90" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="flex items-center justify-center w-10 h-10 bg-[#F6F1E7] border border-[#C6A24A]/20 rounded-lg hover:border-[#C6A24A]/40 transition-colors"
                >
                  <Search className="h-4 w-4 text-[#5A5E55]" />
                </button>
              )}

              {/* Desktop Search Results Dropdown */}
              {searchOpen && searchQuery && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#C6A24A]/20 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto w-80">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-8 text-sm text-[#5A5E55]">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product.handle}
                        href={`/products/${product.handle}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-[#F6F1E7] border-b border-[#C6A24A]/10 last:border-b-0"
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-[#C6A24A]/20">
                          {product.featuredImage && (
                            <Image
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText || ""}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[#1E1F1C]">
                            {product.title}
                          </p>
                          <p className="text-xs text-[#5A5E55]">
                            {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-8 text-sm text-[#5A5E55]">No results found</div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-[#1E1F1C] hover:text-[#1F6B4F]"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {!!totalQuantity && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#1F6B4F] p-0 text-xs text-[#F6F1E7]">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </Badge>
              )}
            </Button>
          </div>
      </nav>

      {/* Mobile Search Dropdown - appears below header, doesn't cover whole page */}
      {searchOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 z-30 bg-[#F6F1E7] border-b border-[#C6A24A]/20 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center bg-white border-2 border-[#C6A24A]/30 rounded-lg overflow-hidden">
              <Search className="h-4 w-4 text-[#5A5E55] ml-3 shrink-0" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 150);
                }}
                onFocus={() => setSearchOpen(true)}
                className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none placeholder:text-[#5A5E55]/60 text-[#1E1F1C]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="px-2 text-[#5A5E55] hover:text-[#1E1F1C] shrink-0"
                >
                  <Search className="h-4 w-4 rotate-90" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="px-3 text-[#5A5E55] hover:text-[#1E1F1C] border-l border-[#C6A24A]/20"
              >
                Cancel
              </button>
            </div>

            {/* Mobile Search Results */}
            {searchQuery && (
              <div className="mt-2 bg-white border border-[#C6A24A]/20 rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-[#5A5E55]">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-[#F6F1E7] border-b border-[#C6A24A]/10 last:border-b-0"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-[#C6A24A]/20">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-[#1E1F1C]">
                          {product.title}
                        </p>
                        <p className="text-xs text-[#5A5E55]">
                          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-6 text-sm text-[#5A5E55]">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
