
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminImageUpload } from "@/components/admin-image-upload";
import { FaPlus, FaTrash, FaCertificate, FaInfoCircle } from "react-icons/fa";

type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

type CategoryItem = { id: string; name: string; parentId?: string | null };
type CollectionItem = { id: string; title: string };

export type ProductDetail = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

export type ProductCertificate = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

export type ProductFormValues = {
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  inventory: number;
  availableForSale: boolean;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
  featuredImage?: string;
  productType?: string;
  categoryId: string;
  subcategoryId: string;
  vendor?: string;
  tags: string[];
  collectionIds: string[];
  isFeatured: boolean;
  variations: Array<{ name: string; value: string; price: number }>;
  details: ProductDetail[];
  certificates: ProductCertificate[];
};

function slugifyHandle(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function ProductForm({
  mode,
  productId,
  initialValues,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    title: "",
    handle: "",
    description: "",
    descriptionHtml: "",
    price: 0,
    compareAtPrice: null,
    sku: "",
    inventory: 0,
    availableForSale: true,
    status: "ACTIVE",
    seoTitle: "",
    seoDescription: "",
    images: [],
    featuredImage: "",
    productType: "",
    categoryId: "",
    subcategoryId: "",
    vendor: "OrganoCity",
    tags: [],
    collectionIds: [],
    isFeatured: false,
    variations: [],
    details: [],
    certificates: [],
    ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionSearch, setCollectionSearch] = useState("");
  const [savingVariations, setSavingVariations] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingCertificates, setSavingCertificates] = useState(false);
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [certificatesLoading, setCertificatesLoading] = useState(false);

  const canAutoHandle = useMemo(() => values.handle.trim().length === 0, [values.handle]);
  const parentCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const subcategories = useMemo(
    () => categories.filter((c) => c.parentId === values.categoryId),
    [categories, values.categoryId],
  );
  const visibleCollections = useMemo(
    () => collections.filter((c) => c.title.toLowerCase().includes(collectionSearch.toLowerCase())),
    [collections, collectionSearch],
  );

  useEffect(() => {
    if (canAutoHandle && values.title.trim()) {
      setValues((v) => ({ ...v, handle: slugifyHandle(v.title) }));
    }
  }, [values.title, canAutoHandle]);

  useEffect(() => {
    async function loadOptions() {
      const [catRes, colRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/collections"),
      ]);
      const catData = await catRes.json().catch(() => ({}));
      const colData = await colRes.json().catch(() => ({}));
      setCategories(Array.isArray(catData.categories) ? catData.categories : []);
      setCollections(Array.isArray(colData.collections) ? colData.collections : []);
    }
    void loadOptions();
  }, []);

  useEffect(() => {
    if (mode === "edit" && productId) {
      loadVariations();
      loadDetails();
      loadCertificates();
    }
  }, [mode, productId]);

  const loadVariations = async () => {
    if (!productId) return;
    setVariationsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variations`);
      const data = await res.json();
      if (data.variations) {
        setValues((v) => ({
          ...v,
          variations: data.variations.map((variation: any) => ({
            name: variation.name,
            value: variation.value,
            price: variation.price,
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load variations:", error);
    } finally {
      setVariationsLoading(false);
    }
  };

  const loadDetails = async () => {
    if (!productId) return;
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/details`);
      const data = await res.json();
      if (data.details) {
        setValues((v) => ({ ...v, details: data.details }));
      }
    } catch (error) {
      console.error("Failed to load details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const loadCertificates = async () => {
    if (!productId) return;
    setCertificatesLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/certificates`);
      const data = await res.json();
      if (data.certificates) {
        setValues((v) => ({ ...v, certificates: data.certificates }));
      }
    } catch (error) {
      console.error("Failed to load certificates:", error);
    } finally {
      setCertificatesLoading(false);
    }
  };

  const saveVariations = async () => {
    if (!productId) return;
    setSavingVariations(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variations: values.variations }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save variations");
      }

      alert("Variations saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save variations");
    } finally {
      setSavingVariations(false);
    }
  };

  const saveDetails = async () => {
    if (!productId) return;
    setSavingDetails(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details: values.details }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save details");
      }

      alert("Details saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save details");
    } finally {
      setSavingDetails(false);
    }
  };

  const saveCertificates = async () => {
    if (!productId) return;
    setSavingCertificates(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificates: values.certificates }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save certificates");
      }

      alert("Certificates saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save certificates");
    } finally {
      setSavingCertificates(false);
    }
  };

  const addDetail = () => {
    setValues((v) => ({
      ...v,
      details: [...v.details, { id: generateId(), title: "", description: "", image: "" }],
    }));
  };

  const updateDetail = (id: string, field: keyof ProductDetail, value: string) => {
    setValues((v) => ({
      ...v,
      details: v.details.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  };

  const removeDetail = (id: string) => {
    setValues((v) => ({
      ...v,
      details: v.details.filter((d) => d.id !== id),
    }));
  };

  const addCertificate = () => {
    setValues((v) => ({
      ...v,
      certificates: [...v.certificates, { id: generateId(), title: "", description: "", image: "" }],
    }));
  };

  const updateCertificate = (id: string, field: keyof ProductCertificate, value: string) => {
    setValues((v) => ({
      ...v,
      certificates: v.certificates.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  const removeCertificate = (id: string) => {
    setValues((v) => ({
      ...v,
      certificates: v.certificates.filter((c) => c.id !== id),
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!values.categoryId || !values.subcategoryId) {
        setError("Category and subcategory are required");
        return;
      }
      if (!values.images.length) {
        setError("At least one image is required");
        return;
      }

      const payload = {
        ...values,
        compareAtPrice: values.compareAtPrice === null ? undefined : values.compareAtPrice,
      };
      const res = await fetch(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`,
        { method: mode === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E1F1C]">{mode === "create" ? "Add Product" : "Edit Product"}</h1>
          <p className="mt-1 text-sm text-[#5A5E55]">Product mapping includes category, subcategory and collections.</p>
        </div>
        <Link href="/admin/products" className="rounded-lg border border-[#C6A24A]/25 bg-white px-4 py-2 text-sm font-medium text-[#1E1F1C] hover:bg-[#F6F1E7] transition-all">
          Back to Products
        </Link>
      </div>
      
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      
      <form onSubmit={onSubmit} className="grid gap-6 rounded-xl border border-[#C6A24A]/20 bg-white p-6 md:p-8 lg:grid-cols-2">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <input 
            value={values.title} 
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
            placeholder="Product Title" 
            required 
          />
          <input 
            value={values.handle} 
            onChange={(e) => setValues((v) => ({ ...v, handle: e.target.value }))} 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
            placeholder="Handle (auto-generated)" 
            required 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="number" 
              min={0} 
              step="0.01" 
              value={values.price} 
              onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              placeholder="Price" 
              required 
            />
            <input 
              type="number" 
              min={0} 
              step="0.01" 
              value={values.compareAtPrice ?? ""} 
              onChange={(e) => setValues((v) => ({ ...v, compareAtPrice: e.target.value ? Number(e.target.value) : null }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              placeholder="Compare at Price" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="number" 
              min={0} 
              step="1" 
              value={values.inventory} 
              onChange={(e) => setValues((v) => ({ ...v, inventory: Number(e.target.value) }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              placeholder="Inventory Quantity" 
            />
            <input 
              value={values.sku ?? ""} 
              onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              placeholder="SKU" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select 
              value={values.categoryId} 
              onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value, subcategoryId: "" }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              required
            >
              <option value="">Select Category</option>
              {parentCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select 
              value={values.subcategoryId} 
              onChange={(e) => setValues((v) => ({ ...v, subcategoryId: e.target.value }))} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <textarea 
            value={values.description ?? ""} 
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} 
            rows={4} 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all resize-none" 
            placeholder="Product Description" 
          />
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-4">
          <AdminImageUpload 
            label="Featured Image" 
            folder="organocity/products" 
            usedIn="product" 
            value={values.featuredImage} 
            onChange={(url) => setValues((v) => ({ ...v, featuredImage: url }))} 
          />
          <AdminImageUpload 
            label="Product Images" 
            folder="organocity/products" 
            usedIn="product" 
            mode="multiple" 
            values={values.images} 
            onChangeMany={(urls) => setValues((v) => ({ ...v, images: urls }))} 
          />
          
          <div className="rounded-xl border border-[#C6A24A]/20 bg-[#F6F1E7]/60 p-4">
            <p className="text-sm font-semibold text-[#1E1F1C] mb-3">Collections</p>
            <input 
              value={collectionSearch} 
              onChange={(e) => setCollectionSearch(e.target.value)} 
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
              placeholder="Search collections..." 
            />
            <div className="mt-3 max-h-40 space-y-2 overflow-auto">
              {visibleCollections.map((collection) => (
                <label key={collection.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.collectionIds.includes(collection.id)}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        collectionIds: e.target.checked 
                          ? [...v.collectionIds, collection.id] 
                          : v.collectionIds.filter((id) => id !== collection.id),
                      }))
                    }
                    className="rounded border-gray-300 text-[#1F6B4F] focus:ring-[#1F6B4F]"
                  />
                  <span className="text-sm text-[#1E1F1C]">{collection.title}</span>
                </label>
              ))}
            </div>
          </div>
          
          <input 
            value={values.tags.join(", ")} 
            onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all" 
            placeholder="Tags (comma-separated)" 
          />
          
          <label className="flex items-center gap-3 p-4 rounded-xl border border-[#C6A24A]/20 bg-[#F6F1E7]/60 cursor-pointer hover:bg-[#F6F1E7] transition-colors">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-300 text-[#1F6B4F] focus:ring-[#1F6B4F]"
            />
            <div>
              <p className="text-sm font-medium text-[#1E1F1C]">Mark as Featured Product</p>
              <p className="text-xs text-[#5A5E55]">Featured products appear on the homepage</p>
            </div>
          </label>
        </div>

        {/* Product Variations Section */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-[#C6A24A]/20 bg-[#F6F1E7]/60 p-4 md:p-6">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F6B4F]/10 flex items-center justify-center">
                <FaInfoCircle className="w-5 h-5 text-[#1F6B4F]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1E1F1C]">Product Variations</h3>
                <p className="text-xs text-[#5A5E55]">Add different options like size, color, or material</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setValues((v) => ({
                  ...v,
                  variations: [...v.variations, { name: "", value: "", price: values.price }],
                }))
              }
              className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#17513D] transition-all hover:shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="w-4 h-4" />
              Add Variation
            </button>
          </div>

          <div className="space-y-4">
            {values.variations.map((variation, idx) => (
              <div key={idx} className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() =>
                    setValues((v) => ({
                      ...v,
                      variations: v.variations.filter((_, i) => i !== idx),
                    }))
                  }
                  className="absolute top-3 right-3 rounded-full border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
                
                <p className="text-xs font-medium text-[#5A5E55] mb-3">Variation {idx + 1}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Option Name</label>
                    <input
                      value={variation.name}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          variations: v.variations.map((v, i) =>
                            i === idx ? { ...v, name: e.target.value } : v
                          ),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all"
                      placeholder="e.g., Color"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Option Value</label>
                    <input
                      value={variation.value}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          variations: v.variations.map((v, i) =>
                            i === idx ? { ...v, value: e.target.value } : v
                          ),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all"
                      placeholder="e.g., Blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Price Adjustment</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={variation.price}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          variations: v.variations.map((v, i) =>
                            i === idx ? { ...v, price: Number(e.target.value) } : v
                          ),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {values.variations.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#1F6B4F]/10 flex items-center justify-center mx-auto mb-3">
                  <FaInfoCircle className="w-8 h-8 text-[#1F6B4F]" />
                </div>
                <p className="text-sm text-[#5A5E55]">No variations added yet</p>
                <p className="text-xs text-[#5A5E55]">Click "Add Variation" to create product options</p>
              </div>
            )}
          </div>

          {mode === "edit" && values.variations.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={saveVariations}
                disabled={savingVariations}
                className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17513D] disabled:opacity-50 transition-all hover:shadow-md"
              >
                {savingVariations ? "Saving..." : "Save Variations"}
              </button>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-[#C6A24A]/20 bg-[#F6F1E7]/60 p-4 md:p-6">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F6B4F]/10 flex items-center justify-center">
                <FaInfoCircle className="w-5 h-5 text-[#1F6B4F]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1E1F1C]">Additional Details</h3>
                <p className="text-xs text-[#5A5E55]">Add extra information about your product</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addDetail}
              className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#17513D] transition-all hover:shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="w-4 h-4" />
              Add Detail
            </button>
          </div>

          <div className="space-y-4">
            {values.details.map((detail, idx) => (
              <div key={detail.id} className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() => removeDetail(detail.id)}
                  className="absolute top-3 right-3 rounded-full border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
                
                <p className="text-xs font-medium text-[#5A5E55] mb-3">Detail {idx + 1}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Title</label>
                    <input
                      value={detail.title}
                      onChange={(e) => updateDetail(detail.id, "title", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all"
                      placeholder="e.g., Natural Ingredients"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Description</label>
                    <textarea
                      value={detail.description}
                      onChange={(e) => updateDetail(detail.id, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all resize-none"
                      rows={2}
                      placeholder="Describe this detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Image (optional)</label>
                    <AdminImageUpload
                      label="Detail image"
                      folder="organocity/products/details"
                      usedIn="product_detail"
                      value={detail.image}
                      onChange={(url) => updateDetail(detail.id, "image", url)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {values.details.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#1F6B4F]/10 flex items-center justify-center mx-auto mb-3">
                  <FaInfoCircle className="w-8 h-8 text-[#1F6B4F]" />
                </div>
                <p className="text-sm text-[#5A5E55]">No details added yet</p>
                <p className="text-xs text-[#5A5E55]">Click "Add Detail" to create additional product information</p>
              </div>
            )}
          </div>

          {mode === "edit" && values.details.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={saveDetails}
                disabled={savingDetails}
                className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17513D] disabled:opacity-50 transition-all hover:shadow-md"
              >
                {savingDetails ? "Saving..." : "Save Details"}
              </button>
            </div>
          )}
        </div>

        {/* Product Certificates Section */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-[#C6A24A]/20 bg-[#F6F1E7]/60 p-4 md:p-6">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F6B4F]/10 flex items-center justify-center">
                <FaCertificate className="w-5 h-5 text-[#1F6B4F]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1E1F1C]">Certificates</h3>
                <p className="text-xs text-[#5A5E55]">Add product certifications and awards</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addCertificate}
              className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#17513D] transition-all hover:shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="w-4 h-4" />
              Add Certificate
            </button>
          </div>

          <div className="space-y-4">
            {values.certificates.map((cert, idx) => (
              <div key={cert.id} className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() => removeCertificate(cert.id)}
                  className="absolute top-3 right-3 rounded-full border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
                
                <p className="text-xs font-medium text-[#5A5E55] mb-3">Certificate {idx + 1}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Title</label>
                    <input
                      value={cert.title}
                      onChange={(e) => updateCertificate(cert.id, "title", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all"
                      placeholder="e.g., Organic Certified"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Description</label>
                    <textarea
                      value={cert.description}
                      onChange={(e) => updateCertificate(cert.id, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/50 focus:border-[#1F6B4F] transition-all resize-none"
                      rows={2}
                      placeholder="Describe this certificate..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5A5E55] mb-1.5">Certificate Image</label>
                    <AdminImageUpload
                      label="Certificate image"
                      folder="organocity/products/certificates"
                      usedIn="product_certificate"
                      value={cert.image}
                      onChange={(url) => updateCertificate(cert.id, "image", url)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {values.certificates.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#1F6B4F]/10 flex items-center justify-center mx-auto mb-3">
                  <FaCertificate className="w-8 h-8 text-[#1F6B4F]" />
                </div>
                <p className="text-sm text-[#5A5E55]">No certificates added yet</p>
                <p className="text-xs text-[#5A5E55]">Click "Add Certificate" to showcase your product certifications</p>
              </div>
            )}
          </div>

          {mode === "edit" && values.certificates.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={saveCertificates}
                disabled={savingCertificates}
                className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17513D] disabled:opacity-50 transition-all hover:shadow-md"
              >
                {savingCertificates ? "Saving..." : "Save Certificates"}
              </button>
            </div>
          )}
        </div>

        {/* Save Button Section - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6A24A]/20 px-4 md:px-8 py-4 md:py-5 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F6B4F]/10 flex items-center justify-center">
                <FaInfoCircle className="w-5 h-5 text-[#1F6B4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1F1C]">
                  {mode === "create" ? "Create New Product" : "Update Product"}
                </p>
                <p className="text-xs text-[#5A5E55]">
                  {mode === "create" 
                    ? "All required fields must be filled before saving" 
                    : "Your changes will be saved to the existing product"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/products" 
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#1E1F1C] hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={saving} 
                className="rounded-lg bg-[#1F6B4F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17513D] disabled:opacity-50 transition-all hover:shadow-lg flex items-center gap-2 min-w-[140px] justify-center"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Product"
                )}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}