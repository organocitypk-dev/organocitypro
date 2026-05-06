"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  rating: number;
  content: string;
  productId?: string;
  productHandle?: string;
  isFeatured: boolean;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images: string[];
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  pending: number;
  approved: number;
  rejected: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({ pending: 0, approved: 0, rejected: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    authorImage: "",
    rating: 5,
    content: "",
    productHandle: "",
    isFeatured: false,
    status: "pending" as Review["status"],
    isVerifiedPurchase: false,
    adminNote: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, statusFilter]);

  async function fetchReviews() {
    setLoading(true);
    try {
      let url = `/api/admin/reviews?page=${pagination.page}&limit=${pagination.limit}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setPagination(data.pagination);
        setStatistics(data.statistics || { pending: 0, approved: 0, rejected: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function approveReview(id: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (res.ok) {
        toast.success("Review approved");
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve review");
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Failed to approve review");
    }
  }

  async function rejectReview(id: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        toast.success("Review rejected");
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to reject review");
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject review");
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: featured }),
      });
      if (res.ok) {
        toast.success(`Review ${featured ? "featured" : "unfeatured"}`);
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${featured ? "feature" : "unfeature"} review`);
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      toast.error("Failed to update review");
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete review");
    }
  }

  function openModal(review?: Review) {
    if (review) {
      setEditingReview(review);
      setFormData({
        authorName: review.authorName,
        authorEmail: review.authorEmail || "",
        authorImage: review.authorImage || "",
        rating: review.rating,
        content: review.content,
        productHandle: review.productHandle || "",
        isFeatured: review.isFeatured,
        status: review.status,
        isVerifiedPurchase: review.isVerifiedPurchase,
        adminNote: review.adminNote || "",
      });
    } else {
      setEditingReview(null);
      setFormData({
        authorName: "",
        authorEmail: "",
        authorImage: "",
        rating: 5,
        content: "",
        productHandle: "",
        isFeatured: false,
        status: "pending",
        isVerifiedPurchase: false,
        adminNote: "",
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
        toast.success(editingReview ? "Review updated" : "Review created");
        setShowModal(false);
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save review");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  function getStatusBadge(status: Review["status"]) {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E1F1C]">Reviews Management</h1>
        <p className="text-sm text-[#5A5E55] mt-1">Manage customer reviews and ratings</p>
      </div>

      {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#C6A24A]/20">
            <div className="text-sm text-[#5A5E55]">Total Reviews</div>
            <div className="text-2xl font-bold text-[#1E1F1C]">{pagination.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-sm text-yellow-700">Pending</div>
            <div className="text-2xl font-bold text-yellow-800">{statistics.pending}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-sm text-green-700">Approved</div>
            <div className="text-2xl font-bold text-green-800">{statistics.approved}</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-sm text-red-700">Rejected</div>
            <div className="text-2xl font-bold text-red-800">{statistics.rejected}</div>
          </div>
          <div className="bg-[#F6F1E7] rounded-xl p-4 border border-[#C6A24A]/30">
            <div className="text-sm text-[#C6A24A]">Featured</div>
            <div className="text-2xl font-bold text-[#C6A24A]">{reviews.filter(r => r.isFeatured).length}</div>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-[#C6A24A]/20 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A5E55]" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#C6A24A]/30 focus:ring-2 focus:ring-[#C6A24A] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#5A5E55]" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-3 py-2 text-sm rounded-lg border border-[#C6A24A]/30 focus:ring-2 focus:ring-[#C6A24A]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-[#C6A24A] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] w-full sm:w-auto justify-center"
          >
            <span>+</span> Add Manual Review
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="text-center py-8 text-sm text-[#5A5E55]">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#C6A24A]/20 text-center">
          <p className="text-[#5A5E55]">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#C6A24A]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#F6F1E7] border-b border-[#C6A24A]/20">
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Author</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Rating</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Content</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Product</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Status</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Featured</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Date</th>
                    <th className="px-4 py-3 font-medium text-[#1E1F1C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-100 hover:bg-[#F6F1E7]/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1E1F1C]">{review.authorName}</div>
                        {review.authorEmail && (
                          <div className="text-xs text-[#5A5E55]">{review.authorEmail}</div>
                        )}
                        {review.isVerifiedPurchase && (
                          <span className="text-[10px] text-[#1F6B4F] flex items-center gap-1 mt-1">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-sm text-[#5A5E55] truncate" title={review.content}>
                          {review.content.substring(0, 60)}...
                        </div>
                        {review.images.length > 0 && (
                          <span className="text-[10px] text-[#C6A24A]">
                            📎 {review.images.length} image(s)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {review.productHandle ? (
                          <a
                            href={`/products/${review.productHandle}`}
                            className="text-[#1F6B4F] hover:underline text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {review.productHandle}
                          </a>
                        ) : (
                          <span className="text-xs text-[#5A5E55]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(review.status)}</td>
                      <td className="px-4 py-3">
                        {review.isFeatured ? (
                          <span className="text-[#C6A24A]">
                            <Award className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="text-xs text-[#5A5E55]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5A5E55]">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {review.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveReview(review.id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => rejectReview(review.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => toggleFeatured(review.id, !review.isFeatured)}
                            className={`p-1 ${review.isFeatured ? "text-[#C6A24A]" : "text-[#5A5E55]"} hover:bg-[#C6A24A]/10 rounded transition-colors`}
                            title={review.isFeatured ? "Unfeature" : "Feature on homepage"}
                          >
                            <Award className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal(review)}
                            className="p-1 text-[#C6A24A] hover:bg-[#C6A24A]/10 rounded"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-[#5A5E55]">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-[#C6A24A]/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F6F1E7]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-[#1E1F1C] px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-[#C6A24A]/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F6F1E7]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold text-[#1E1F1C] mb-4">
              {editingReview ? "Edit Review" : "Add Manual Review"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Author Name *</label>
                  <input
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Author Email</label>
                  <input
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Rating (1-5) *</label>
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
                  <label className="block text-sm font-medium text-[#1E1F1C]">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                    required
                  />
                </div>
<div>
                   <label className="block text-sm font-medium text-[#1E1F1C]">Product Handle</label>
                   <input
                     value={formData.productHandle}
                     onChange={(e) => setFormData({ ...formData, productHandle: e.target.value })}
                     placeholder="e.g., shilajit-resin"
                     className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                   />
                   <p className="text-xs text-[#5A5E55] mt-1">Enter product handle to link review to a product</p>
                 </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Featured (show on homepage)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isVerifiedPurchase}
                      onChange={(e) => setFormData({ ...formData, isVerifiedPurchase: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Verified Purchase</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Review["status"] })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Admin Note</label>
                  <textarea
                    value={formData.adminNote}
                    onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
                    rows={2}
                    placeholder="Internal note for admin reference..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F6B4F] px-4 py-2 text-sm text-white hover:bg-[#17513D]"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1E1F1C]">Review Details</h2>
              <button
                onClick={() => setViewingReview(null)}
                className="text-[#5A5E55] hover:text-[#1E1F1C]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#F6F1E7] flex items-center justify-center">
                  {viewingReview.authorImage ? (
                    <img src={viewingReview.authorImage} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-[#5A5E55]">
                      {viewingReview.authorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-[#1E1F1C]">{viewingReview.authorName}</div>
                  <div className="text-sm text-[#5A5E55]">{viewingReview.authorEmail || "No email"}</div>
                  <div className="text-xs text-[#5A5E55]">{formatDate(viewingReview.createdAt)}</div>
                </div>
              </div>
              <div>
                <StarRating rating={viewingReview.rating} />
              </div>
              <div>
                <p className="text-sm text-[#5A5E55] whitespace-pre-wrap">{viewingReview.content}</p>
              </div>
              {viewingReview.images.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-[#1E1F1C] mb-2">Attached Images</div>
                  <div className="flex gap-2 flex-wrap">
                    {viewingReview.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        className="h-20 w-20 rounded-lg object-cover border border-[#C6A24A]/20"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-[#5A5E55]">Status: </span>
                  {getStatusBadge(viewingReview.status)}
                </div>
                <div>
                  <span className="text-[#5A5E55]">Featured: </span>
                  {viewingReview.isFeatured ? "Yes" : "No"}
                </div>
                <div>
                  <span className="text-[#5A5E55]">Verified: </span>
                  {viewingReview.isVerifiedPurchase ? "Yes" : "No"}
                </div>
              </div>
              {viewingReview.adminNote && (
                <div className="bg-[#F6F1E7] p-3 rounded-lg">
                  <div className="text-sm font-medium text-[#1E1F1C] mb-1">Admin Note</div>
                  <p className="text-sm text-[#5A5E55]">{viewingReview.adminNote}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setViewingReview(null);
                  openModal(viewingReview);
                }}
                className="rounded-lg border border-[#C6A24A]/30 px-4 py-2 text-sm hover:bg-[#F6F1E7]"
              >
                Edit Review
              </button>
              <button
                onClick={() => setViewingReview(null)}
                className="rounded-lg bg-[#1F6B4F] px-4 py-2 text-sm text-white hover:bg-[#17513D]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}