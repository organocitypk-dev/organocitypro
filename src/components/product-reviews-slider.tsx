"use client";

import { useEffect, useRef, useState } from "react";
import { Star, User, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  content: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ProductReviewsSliderProps {
  productHandle: string;
}

export function ProductReviewsSlider({ productHandle }: ProductReviewsSliderProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews();
  }, [productHandle]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productHandle=${productHandle}&sortBy=newest&limit=20`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "fill-[#C6A24A] text-[#C6A24A]" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-[#5A5E55]">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-[#C6A24A]/20 text-center">
        <Star className="h-12 w-12 text-[#C6A24A] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1E1F1C] mb-1">No Reviews Yet</h3>
        <p className="text-sm text-[#5A5E55]">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1E1F1C]">Customer Reviews</h2>
          <p className="text-xs text-[#5A5E55]">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        {reviews.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="rounded-full border border-[#C6A24A]/30 p-2 hover:bg-[#1F6B4F] hover:text-white hover:border-[#1F6B4F] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-full border border-[#C6A24A]/30 p-2 hover:bg-[#1F6B4F] hover:text-white hover:border-[#1F6B4F] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-shrink-0 w-72 md:w-80 rounded-xl border border-[#C6A24A]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#F6F1E7] flex items-center justify-center overflow-hidden">
                  {review.authorImage ? (
                    <img
                      src={review.authorImage}
                      alt={review.authorName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-[#5A5E55]" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1E1F1C]">{review.authorName}</div>
                  <div className="text-[10px] text-[#5A5E55]">{formatDate(review.createdAt)}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            <p className="text-sm text-[#5A5E55] line-clamp-4 mb-3">{review.content}</p>

            <div className="flex items-center gap-2">
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-[10px] text-[#1F6B4F]">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = 304; // card width + gap
                  scrollRef.current.scrollTo({
                    left: idx * cardWidth,
                    behavior: "smooth",
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.round(
                  scrollRef.current?.scrollLeft ?? 0 / 304
                ) === idx
                  ? "bg-[#1F6B4F] w-6"
                  : "bg-[#C6A24A]/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}