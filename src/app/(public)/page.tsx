import { Card, CardContent } from "@esmate/shadcn/components/ui/card";
import { Heart, Flame, Utensils } from "@esmate/shadcn/pkgs/lucide-react";
import Link from "next/link";
import { CertificationsSlider } from "@/components/certifications-slider";
import BlogSection from "@/components/blog-section";
import CertificatesMatters from "@/components/CertificatesMatters";
import EssenceSection from "@/components/EssenceSection";
import Testimonials from "@/components/Testimonials";
import Hero from "@/components/Hero";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeProducts } from "@/components/home-products";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Organocity",
  "url": "https://organocity.com",
  "logo": "https://organocity.com/images/logo.png",
  "sameAs": [
    "https://www.facebook.com/organocity",
    "https://www.instagram.com/organocity",
    "https://twitter.com/organocity"
  ]
};

export const metadata: Metadata = {
  title: "Organocity | Pure Shilajit, Himalayan Pink Salt & Herbal Products",
  description:
    "Shop authentic Shilajit, Himalayan pink salt, herbal wellness products, salt lamps & decorative pieces. Organocity offers premium natural products from Pakistan.",
  keywords: [
    "shilajit",
    "shilajit resin",
    "pure shilajit",
    "himalayan pink salt",
    "pink salt",
    "edible pink salt",
    "rock salt",
    "herbal products",
    "natural wellness",
    "salt lamps",
    "pink salt lamp",
    "salt decoration",
    "decorative pink salt",
    "pink salt pieces",
    "crystal salt lamp",
    "himalayan salt lamp",
    "organic salt",
    "bath salt",
    "wellness products",
  ],
  openGraph: {
    title: "Organocity | Pure Shilajit, Pink Salt & Herbal Wellness",
    description:
      "Discover authentic Shilajit, Himalayan pink salt products, salt lamps, and natural wellness essentials.",
    url: "https://organocity.com",
    siteName: "Organocity",
    type: "website",
    images: ["/images/himalayan-hero.png"],
  },
  alternates: {
    canonical: "https://organocity.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const [categories, featuredProducts, featuredCollections, featuredBlogs, essenceSection, certificates, featuredReviews] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true, image: true },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true, categoryId: true, subcategoryId: true, isFeatured: true },
    }),
    prisma.collection.findMany({
      where: { isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, handle: true, title: true, image: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "published", isFeatured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true, content: true },
    }),
    prisma.homepageSection.findUnique({
      where: { sectionKey: "essence" },
    }),
    prisma.certificate.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, image: true, isVerifiedBy: true },
    }),
    prisma.review.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, authorName: true, rating: true, content: true },
    }),
  ]);

return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <div className="flex flex-col gap-4 bg-[#F6F1E7]">
        <Hero />
        <h1 className="sr-only">Organocity - Premium Himalayan Pink Salt, Shilajit & Herbal Wellness Products</h1>
       <HomeProducts categories={categories} products={featuredProducts} collections={featuredCollections} />

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#1E1F1C] sm:text-4xl">
            The Miracle of Pink Salt
          </h2>
          <p className="mt-4 text-lg text-[#5A5E55]">
            Unlocking the ancient health benefits of Himalayan crystals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lamp Benefits */}
          <Card className="bg-white border-[#C6A24A]/30 hover:border-[#1F6B4F]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#F6F1E7] flex items-center justify-center text-[#1F6B4F]">
                <Flame className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1F1C]">Salt Lamps</h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Purifies air by releasing negative ions</li>
                <li>Reduces allergy symptoms and asthma</li>
                <li>Improves sleep quality and mood</li>
                <li>Neutralizes electromagnetic radiation (EMF)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Edible Benefits */}
          <Card className="bg-white border-[#C6A24A]/30 hover:border-[#1F6B4F]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#F6F1E7] flex items-center justify-center text-[#1F6B4F]">
                <Utensils className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1F1C]">
                Edible Salt (Fine/Grinder)
              </h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Contains 84 essential trace minerals</li>
                <li>Regulates water content in the body</li>
                <li>Promotes healthy pH balance</li>
                <li>Lower sodium content than table salt</li>
              </ul>
            </CardContent>
          </Card>

          {/* Spa Benefits */}
          <Card className="bg-white border-[#C6A24A]/30 hover:border-[#1F6B4F]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#F6F1E7] flex items-center justify-center text-[#1F6B4F]">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1F1C]">Bath & Spa</h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Detoxifies the body through osmosis</li>
                <li>Relieves muscle cramps and soreness</li>
                <li>Exfoliates dead skin cells</li>
                <li>Improving skin hydration and texture</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Essence */}
      <EssenceSection initialData={essenceSection ? {
        title: essenceSection.title,
        subtitle: essenceSection.subtitle,
        content: essenceSection.content as any,
      } : undefined} />

      {/* Certificates */}
      <CertificatesMatters />

      {/* Reviews */}
      {featuredReviews && featuredReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#1E1F1C] sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border border-[#C6A24A]/20">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < review.rating ? "text-[#C6A24A]" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
                <p className="text-[#5A5E55] mb-4">"{review.content}"</p>
                <p className="font-semibold text-[#1E1F1C]">{review.authorName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog */}
      <BlogSection articles={featuredBlogs.map(b => ({
        id: b.id,
        title: b.title,
        handle: b.slug,
        publishedAt: b.publishedAt?.toISOString() ?? "",
        content: b.content ?? "",
        image: b.featuredImage ? { url: b.featuredImage } : null,
        blogHandle: "news"
      }))} />

      {/* Certifications Slider */}
      <CertificationsSlider initialData={certificates.length > 0 ? certificates : undefined} />
    </div>
    </>
  );
}

