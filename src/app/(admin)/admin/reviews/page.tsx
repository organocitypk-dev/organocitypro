"use client";

import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";

interface Review {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  content: string;
  productId?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    authorName: "",
    authorImage: "",
    rating: 5,
    content: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  function openModal(review?: Review) {
    if (review) {
      setEditingReview(review);
      setFormData({
        authorName: review.authorName,
        authorImage: review.authorImage || "",
        rating: review.rating,
        content: review.content,
        isFeatured: review.isFeatured,
        isActive: review.isActive,
      });
    } else {
      setEditingReview(null);
      setFormData({
        authorName: "",
        authorImage: "",
        rating: 5,
        content: "",
        isFeatured: false,
        isActive: true,
      });
    }
    setShowModal(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingReview
        ? `/api/admin/reviews/${editingReview.id}`
        : "/api/admin/reviews";
      const method = editingReview ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#1E1F1C]">Reviews</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#C6A24A] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#b8923f]"
        >
          Add Review
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-[#5A5E55]">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-medium text-[#1E1F1C]">Author</th>
                <th className="pb-3 font-medium text-[#1E1F1C]">Rating</th>
                <th className="pb-3 font-medium text-[#1E1F1C]">Content</th>
                <th className="pb-3 font-medium text-[#1E1F1C]">Featured</th>
                <th className="pb-3 font-medium text-[#1E1F1C]">Active</th>
                <th className="pb-3 font-medium text-[#1E1F1C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100">
                  <td className="py-3">{review.authorName}</td>
                  <td className="py-3">{review.rating}</td>
                  <td className="py-3 max-w-xs truncate">{review.content}</td>
                  <td className="py-3">
                    {review.isFeatured ? "✓" : "—"}
                  </td>
                  <td className="py-3">
                    {review.isActive ? "✓" : "—"}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => openModal(review)}
                      className="mr-2 text-[#C6A24A] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold text-[#1E1F1C] mb-4">
              {editingReview ? "Edit Review" : "Add Review"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Author Name</label>
                  <input
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F6B4F] px-4 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}