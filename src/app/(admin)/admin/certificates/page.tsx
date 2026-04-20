"use client";

import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";

interface Certificate {
  id: string;
  name: string;
  image: string;
  description?: string;
  order: number;
  isActive: boolean;
  isVerifiedBy: boolean;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    order: 0,
    isActive: true,
    isVerifiedBy: false,
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.certificates) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCert(id: string) {
    if (!confirm("Delete this certificate?")) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCertificates(certificates.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  function openModal(cert?: Certificate) {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        name: cert.name,
        image: cert.image,
        description: cert.description || "",
        order: cert.order,
        isActive: cert.isActive,
        isVerifiedBy: cert.isVerifiedBy || false,
      });
    } else {
      setEditingCert(null);
      setFormData({
        name: "",
        image: "",
        description: "",
        order: certificates.length,
        isActive: true,
        isVerifiedBy: false,
      });
    }
    setShowModal(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingCert
        ? `/api/admin/certificates/${editingCert.id}`
        : "/api/admin/certificates";
      const method = editingCert ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchCertificates();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#1E1F1C]">Certificates</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#C6A24A] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#b8923f]"
        >
          Add Certificate
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-[#5A5E55]">Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-[#C6A24A]/20 bg-white p-4">
              <img src={cert.image} alt={cert.name} className="h-20 w-auto object-contain mb-2" />
              <h3 className="font-medium text-[#1E1F1C]">{cert.name}</h3>
              <p className="text-xs text-[#5A5E55]">Order: {cert.order}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openModal(cert)}
                  className="text-xs text-[#C6A24A] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCert(cert.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-[#1E1F1C] mb-4">
              {editingCert ? "Edit Certificate" : "Add Certificate"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1F1C]">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1F1C]">Image</label>
                <AdminImageUpload
                  label=""
                  folder="organocity/certificates"
                  usedIn="certificate"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1F1C]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1F1C]">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVerifiedBy}
                  onChange={(e) => setFormData({ ...formData, isVerifiedBy: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm">Verified By (show in first card)</span>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#1F6B4F] px-4 py-2 text-sm text-white">
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