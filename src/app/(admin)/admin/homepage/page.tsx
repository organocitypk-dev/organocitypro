"use client";

import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin-image-upload";

interface EssenceCard {
  title: string;
  description: string;
  image: string;
}

export default function HomepageSectionPage() {
  const [essenceCards, setEssenceCards] = useState<EssenceCard[]>([
    { title: "", description: "", image: "" },
    { title: "", description: "", image: "" },
  ]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchSection() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage-sections?key=essence");
      const data = await res.json();
      if (data.sections && data.sections.length > 0) {
        const section = data.sections[0];
        setTitle(section.title || "");
        setSubtitle(section.subtitle || "");
        if (Array.isArray(section.content) && section.content.length > 0) {
          setEssenceCards(section.content);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSection();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/homepage-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "essence",
          title,
          subtitle,
          content: essenceCards,
          isActive: true,
          order: 1,
        }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-[#5A5E55]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#1E1F1C] mb-2">
        Homepage Section Management
      </h1>
      <p className="text-sm text-[#5A5E55] mb-6">
        Manage the "Experience the Essence" section content.
      </p>

      {saved && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Saved successfully!
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="rounded-xl border border-[#C6A24A]/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-[#1E1F1C] mb-4">Section Header</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1F1C]">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A] focus:border-transparent"
                placeholder="Experience the Essence"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1F1C]">Subtitle</label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A] focus:border-transparent"
                placeholder="Elevate Your Culinary & Wellness Rituals"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#C6A24A]/20 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1E1F1C]">Cards</h2>
            <button
              type="button"
              onClick={() => setEssenceCards([...essenceCards, { title: "", description: "", image: "" }])}
              className="text-sm text-[#1F6B4F] hover:underline"
            >
              + Add Card
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {essenceCards.map((card, index) => (
              <div key={index} className="space-y-4 relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#1E1F1C]">Card {index + 1}</h3>
                  {essenceCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setEssenceCards(essenceCards.filter((_, i) => i !== index))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Title</label>
                  <input
                    value={card.title}
                    onChange={(e) => {
                      const newCards = [...essenceCards];
                      newCards[index].title = e.target.value;
                      setEssenceCards(newCards);
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A] focus:border-transparent"
                    placeholder="Nourish Your Body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Description</label>
                  <textarea
                    value={card.description}
                    onChange={(e) => {
                      const newCards = [...essenceCards];
                      newCards[index].description = e.target.value;
                      setEssenceCards(newCards);
                    }}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A] focus:border-transparent"
                    placeholder="Description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1F1C]">Image</label>
                  <AdminImageUpload
                    label=""
                    folder="organocity/essence"
                    usedIn="essence"
                    value={card.image}
                    onChange={(url) => {
                      const newCards = [...essenceCards];
                      newCards[index].image = url;
                      setEssenceCards(newCards);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1F6B4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17513D] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}