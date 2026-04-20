"use client";

import Link from "next/link";
import { FiEdit, FiStar, FiAward, FiFileText } from "react-icons/fi";

const sections = [
  {
    name: "Experience the Essence",
    description: "Manage the Essence section content with 2 cards",
    href: "/admin/homepage",
    icon: FiFileText,
  },
  {
    name: "Reviews",
    description: "Manage customer reviews for homepage",
    href: "/admin/reviews",
    icon: FiStar,
  },
  {
    name: "Certificates",
    description: "Manage quality certifications",
    href: "/admin/certificates",
    icon: FiAward,
  },
];

export default function SectionManagementPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-[#1E1F1C] mb-2">
        Homepage Section Management
      </h1>
      <p className="text-sm text-[#5A5E55] mb-6">
        Control the content displayed on the homepage.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-start gap-4 rounded-xl border border-[#C6A24A]/20 bg-white p-6 transition hover:shadow-md"
          >
            <div className="rounded-lg bg-[#F6F1E7] p-3 text-[#1F6B4F]">
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1E1F1C]">{section.name}</h2>
              <p className="mt-1 text-sm text-[#5A5E55]">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}