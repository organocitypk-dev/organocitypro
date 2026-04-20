"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar } from "@esmate/shadcn/pkgs/lucide-react"

interface BlogImage {
  url: string
  altText?: string | null
}

interface Article {
  id: string
  title: string
  handle: string
  publishedAt: string
  content: string
  image?: BlogImage | null
  blogHandle: string
}

interface BlogSectionProps {
  articles?: Article[]
}

export default function BlogSection({ articles: initialArticles }: BlogSectionProps) {
  const [articles] = useState<Article[]>(initialArticles || [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (articles.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % articles.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [articles.length])

  if (!articles.length) return null

  const currentArticle = articles[activeIndex]
  const text = currentArticle.content?.replace(/<[^>]+>/g, "").trim() ?? ""

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Helpful reads and insights around Himalayan Pink Salt.
          </p>
        </div>

        {/* Single Blog Slider */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-background shadow-sm">
            <div className="relative aspect-[16/9]">
              {currentArticle.image?.url ? (
                <Image
                  src={currentArticle.image.url}
                  alt={currentArticle.image.altText || currentArticle.title}
                  fill
                  className="object-cover"
                  key={currentArticle.id}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <time className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {currentArticle.publishedAt ? new Date(currentArticle.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) : ""}
              </time>

              <h3 className="mt-3 text-xl sm:text-2xl font-semibold leading-snug">
                <Link
                  href={`/blogs/${currentArticle.blogHandle}/${currentArticle.handle}`}
                  className="hover:text-primary"
                >
                  {currentArticle.title}
                </Link>
              </h3>

              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {text}
              </p>

              <Link
                href={`/blogs/${currentArticle.blogHandle}/${currentArticle.handle}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Dots Indicator */}
          {articles.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-6 bg-[#1F6B4F]"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to article ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}