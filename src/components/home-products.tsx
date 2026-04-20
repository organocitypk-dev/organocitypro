"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreProductCard } from "@/components/store-product-card-wrapper";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  price: number | null;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: any;
  tags: any;
  categoryId: string | null;
  subcategoryId: string | null;
  isFeatured: boolean;
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  image: string | null;
}

interface Props {
  categories: Category[];
  products: Product[];
  collections: Collection[];
}

function CollectionSlider({ collections }: { collections: Collection[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentCollections = collections || [];
  const totalSlides = Math.ceil(currentCollections.length / itemsPerPage);
  const displayCollections = currentCollections.slice(
    currentSlide * itemsPerPage,
    (currentSlide + 1) * itemsPerPage
  );

  if (displayCollections.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!mounted || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [mounted, totalSlides]);

  return (
    <div className="relative">
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-3 transition-opacity duration-1000 ease-in-out"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        {displayCollections.map((collection, i) => (
          <Link
            key={`${collection.id}-${i}-${currentSlide}`}
            href="/products"
            className="group overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={collection.image || "/logo/organocityBackup.png"}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-lg font-semibold text-[#1E1F1C]">{collection.title}</div>
          </Link>
        ))}
      </div>
      {totalSlides > 1 && mounted && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-[#1F6B4F]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeProducts({ categories, products, collections }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const featuredProducts = products.filter(p => p.isFeatured);

  const filteredProducts = selectedCategory
    ? products.filter(p => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat && (p.categoryId === cat.id || p.subcategoryId === cat.id);
      })
    : featuredProducts;

  const otherProducts = selectedCategory
    ? products.filter(p => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat && p.categoryId !== cat.id && p.subcategoryId !== cat.id;
      })
    : [];

  const selectedCat = categories.find(c => c.slug === selectedCategory);

  return (
    <>
      <section className="lg:mx-auto lg:w-full lg:max-w-7xl lg:px-8 md:my-2">
        <div className="flex gap-3 overflow-hidden relative">
          <div className="flex gap-3 animate-scroll scrollbar-hide">
             {[...categories, ...categories].map((category, idx) => (
               <Link
                 key={`${category.id}-${idx}`}
                 href="/products"
                 className="group flex flex-col items-center flex-shrink-0"
               >
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-full border-2 border-[#C6A24A]/30 shadow-sm transition hover:border-[#C6A24A] hover:shadow-md">
                  <Image
                    src={category.image || "/logo/organocityBackup.png"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                 <span className="mt-1 sm:mt-2 text-center text-xs font-semibold text-[#1E1F1C]">{category.name}</span>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {selectedCategory && filteredProducts.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1E1F1C]">{selectedCat?.name} Products</h2>
            <button onClick={() => setSelectedCategory("")} className="text-sm font-semibold text-[#1F6B4F] hover:underline">
              Clear Filter
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const firstImage = Array.isArray(product.images)
                ? product.images.find((x): x is string => typeof x === "string")
                : null;
              const firstTag = Array.isArray(product.tags)
                ? product.tags.find((x): x is string => typeof x === "string")
                : undefined;
              return (
                <StoreProductCard
                  key={product.handle}
                  handle={product.handle}
                  title={product.title}
                  featuredImageUrl={product.featuredImage || firstImage || "/logo/organocityBackup.png"}
                  price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
                  compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
                  tag={firstTag}
                  productId={product.id}
                />
              );
            })}
          </div>
        </section>
      )}

      {(!selectedCategory || otherProducts.length > 0) && (
        <section className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1E1F1C]">
              {selectedCategory ? "Other Products" : "Featured Products"}
            </h2>
            <Link href="/products" className="text-sm font-semibold text-[#1F6B4F] hover:underline">
              Shop Now
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(selectedCategory ? otherProducts : products).map((product) => {
              const firstImage = Array.isArray(product.images)
                ? product.images.find((x): x is string => typeof x === "string")
                : null;
              const firstTag = Array.isArray(product.tags)
                ? product.tags.find((x): x is string => typeof x === "string")
                : undefined;
              return (
                <StoreProductCard
                  key={product.handle}
                  handle={product.handle}
                  title={product.title}
                  featuredImageUrl={product.featuredImage || firstImage || "/logo/organocityBackup.png"}
                  price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
                  compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
                  tag={firstTag}
                  productId={product.id}
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-[#1E1F1C]">Collections</h2>
        <CollectionSlider collections={collections} />
      </section>
    </>
  );
}