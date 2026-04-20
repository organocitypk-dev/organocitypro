import { Metadata } from "next";
import { CollectionList } from "./collection-list";
import { getCollectionList } from "./service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections | OrganoCity - Shilajit, Pink Salt Lamps & Herbal Products",
  description:
    "Explore all OrganoCity collections including Shilajit, Himalayan pink salt lamps, edible salt, bath salts, wellness products, and decorative pink salt pieces.",
  keywords: [
    "OrganoCity collections",
    "shilajit collection",
    "himalayan pink salt products",
    "pink salt lamps",
    "salt lamp collection",
    "edible pink salt",
    "bath salts",
    "salt decoration",
    "decorative pink salt",
    "natural wellness products",
    "Pakistan pink salt supplier",
  ],
  alternates: {
    canonical: "https://organocity.com/collections",
  },
  openGraph: {
    title: "Collections | OrganoCity - Shilajit, Pink Salt & Wellness",
    description:
      "Discover OrganoCity's complete range of Shilajit, Himalayan pink salt collections for health, home, and lifestyle.",
    url: "https://organocity.com/collections",
    siteName: "OrganoCity",
    type: "website",
    images: [
      {
        url: "https://organocity.com/og/collections.jpg",
        width: 1200,
        height: 630,
        alt: "OrganoCity Himalayan Pink Salt Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections | OrganoCity - Pink Salt & Shilajit",
    description:
      "Browse all OrganoCity collections: Shilajit, Himalayan pink salt, salt lamps, and wellness products.",
    images: ["https://organocity.com/og/collections.jpg"],
  },
};

export default async function Page() {
  const data = await getCollectionList();

  return (
    <div className="bg-background">
      {/* Intro Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Collections
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Explore our carefully curated collections of authentic Himalayan
            pink salt products. From natural wellness essentials to beautifully
            crafted salt lamps and edible salts, each collection reflects our
            commitment to purity, quality, and sustainable sourcing.
          </p>
        </div>
      </section>

      {/* Collections List */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <CollectionList data={data} />
      </section>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="max-w-4xl space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">
            Authentic Himalayan Pink Salt Collections
          </h2>
          <p>
            OrganoCity sources premium Himalayan pink salt directly from the
            ancient salt mines of Pakistan. Our collections include edible salt
            for cooking, wellness and spa products, decorative salt lamps, and
            lifestyle accessories designed to support a natural and balanced
            way of living.
          </p>
          <p>
            Whether you are looking for bulk supply, retail products, or
            wellness solutions, our collections are crafted to meet
            international quality standards while preserving the natural
            mineral richness of Himalayan salt.
          </p>
        </div>
      </section>
    </div>
  );
}

