"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface EssenceCard {
  title: string;
  description: string;
  image: string;
}

interface EssenceSectionProps {
  initialData?: {
    title?: string | null;
    subtitle?: string | null;
    content?: EssenceCard[];
  };
}

export default function EssenceSection({ initialData }: EssenceSectionProps) {
  const [data, setData] = useState<{
    title: string;
    subtitle: string;
    cards: EssenceCard[];
  }>({
    title: "Experience the Essence",
    subtitle: "Elevate Your Culinary & Wellness Rituals",
    cards: [
      {
        title: "Nourish Your Body",
        description: "Rich in minerals, our salt enhances and provides essential nutrients for healthier you.",
        image: "/graphics/essence-one.png",
      },
      {
        title: "Revitalize Your Spirit",
        description: "Unwind with a detoxifying salt bath, promoting relaxation and skin rejuvenation.",
        image: "/graphics/essence-two.png",
      },
    ],
  });

  useEffect(() => {
    if (initialData && initialData.content && initialData.content.length > 0) {
      setData({
        title: initialData.title || "Experience the Essence",
        subtitle: initialData.subtitle || "Elevate Your Culinary & Wellness Rituals",
        cards: initialData.content,
      });
    }
  }, [initialData]);

  if (data.cards.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 font-sans text-gray-800">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light mb-2">{data.title}</h2>
        <p className="text-gray-500 uppercase tracking-widest text-sm">
          {data.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
        {data.cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="relative w-full h-[400px]">
              <Image
                src={item.image || "/graphics/essence-one.png"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="p-8">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col md:flex-row items-center">
        <div className="bg-[#C99688] text-white p-10 md:p-16 md:w-1/2 md:absolute left-0 z-10">
          <span className="uppercase tracking-tighter text-xs opacity-80 block mb-2">
            Where Purity Meets Perfection.
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            Our Promise to You
          </h2>
          <p className="text-sm md:text-base leading-loose opacity-90">
            At Pink Pantry, we are dedicated to giving you the best Himalayan
            Pink Salt. We follow strict standards and get our products certified
            to ensure they are pure, natural, and safe.
          </p>
        </div>

        <div className="relative w-full md:w-2/3 ml-auto h-[500px]">
          <Image
            src="/graphics/essence-three.png"
            alt="Our Promise"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      </div>
    </section>
  );
}