import { Metadata } from "next";
import { ProductList } from "./product-list";
import { getCategoriesForFilters, getProductList, getProductsAdvanced, getAllProductsForFilter } from "./service";
import { ProductsFiltered } from "@/components/products-filtered";

export const revalidate = 60;

/* ---------------- SEO METADATA ---------------- */

export const metadata: Metadata = {
  title: "Shop Products | OrganoCity - Shilajit, Pink Salt, Salt Lamps & Herbal",
  description:
    "Browse OrganoCity's full collection of authentic Shilajit resin, Himalayan pink salt, salt lamps, decorative pieces, edible salt, and natural herbal wellness products from Pakistan.",

  keywords: [
    "shilajit",
    "shilajit resin",
    "pure shilajit",
    "himalayan pink salt",
    "pink salt",
    "pink salt products",
    "pink salt lamp",
    "salt lamp",
    "salt lamps",
    "edible pink salt",
    "rock salt",
    "herbal products",
    "natural wellness",
    "salt decoration",
    "decorative pink salt",
    "pink salt pieces",
  ],

  openGraph: {
    title: "Shop Products | OrganoCity - Shilajit, Pink Salt & Wellness",
    description:
      "Browse all OrganoCity products: Shilajit, Himalayan pink salt, salt lamps, decorative pieces, and natural wellness essentials.",
    url: "https://organocity.com/products",
    siteName: "OrganoCity",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "OrganoCity Products | Shilajit, Pink Salt & Salt Lamps",
    description:
      "Discover OrganoCity's full collection: Shilajit, Himalayan pink salt, salt lamps, and natural health products.",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://organocity.com/products",
  },
};

/* ---------------- PAGE ---------------- */

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; subcategory?: string; tag?: string; min?: string; max?: string };
}) {
  const initialCategorySlug = (searchParams?.category ?? "").trim();

  const [categories, allProducts] = await Promise.all([
    getCategoriesForFilters(),
    getAllProductsForFilter(),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <ProductsFiltered 
          categories={categories.map(c => ({ ...c, image: null }))}
          initialProducts={allProducts}
          initialCategorySlug={initialCategorySlug}
        />

        {/* SEO Content Section */}
        <section className="mt-16 border-t border-[#C6A24A]/20 pt-12">
          <h2 className="text-2xl font-bold text-[#1E1F1C]">
            Himalayan Pink Salt, Shilajit & Natural Wellness Products
          </h2>

          <p className="mt-4 max-w-4xl text-[#5A5E55]">
            OrganoCity specializes in authentic Himalayan pink salt products,
            responsibly sourced and minimally processed to retain their natural
            mineral composition. Our range includes edible pink salt for cooking,
            bath and wellness salt, decorative and functional pink salt lamps, and
            premium-grade Shilajit known for its traditional use in vitality and
            strength.
          </p>

          <p className="mt-4 max-w-4xl text-[#5A5E55]">
            Each product is selected with quality, purity, and sustainability in
            mind. We work closely with trusted suppliers to ensure our customers
            receive genuine Himalayan products suitable for daily use, wellness
            routines, and natural living.
          </p>
        </section>
      </div>
    </main>
  );
}

