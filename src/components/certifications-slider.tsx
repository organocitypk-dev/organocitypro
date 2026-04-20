"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  name: string;
  image: string;
  isVerifiedBy: boolean;
}

interface CertificationsSliderProps {
  initialData?: Certificate[];
}

export function CertificationsSlider({ initialData }: CertificationsSliderProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [verifiedByCerts, setVerifiedByCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const verified = initialData.filter(c => c.isVerifiedBy);
      const others = initialData.filter(c => !c.isVerifiedBy);
      setVerifiedByCerts(verified);
      setCertificates(others);
    }
  }, [initialData]);

  const staticCerts = [
    { name: "ISO 9001", image: "/certs/iso-9001.webp" },
    { name: "Global", image: "/certs/global.webp" },
    { name: "Halal Certified", image: "/certs/halal.webp" },
    { name: "Kosher Certified", image: "/certs/kosher.webp" },
    { name: "Compilance", image: "/certs/compilance.webp" },
    { name: "FDA Registered", image: "/certs/fda.webp" },
    { name: "Organic", image: "/certs/organic.webp" },
  ];

  const displayVerified = verifiedByCerts.length > 0 ? verifiedByCerts : [];
  const displayCerts = certificates.length > 0 ? certificates : staticCerts;

  return (
    <section className="bg-[#F6F1E7] py-16">
      <div className="mx-auto mb-10 max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1E1F1C] sm:text-4xl">
          Our Trusted Quality Certifications
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-[#5A5E55]">
          Certified for purity, safety, and authenticity. Our Himalayan Pink Salt
          meets global food and quality standards.
        </p>
      </div>

      {displayVerified.length > 0 && (
        <div className="mx-auto mb-10 max-w-4xl px-6">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-[#1E1F1C] mb-6">Verified By</h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {displayVerified.map((cert, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      sizes="64px"
                      className="object-contain p-2"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#5A5E55]">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#F6F1E7] to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#F6F1E7] to-transparent" />

        <motion.div
          className="flex w-max gap-14"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {[...displayCerts, ...displayCerts].map((cert, index) => (
            <div
              key={index}
              className="flex min-w-[140px] flex-col items-center gap-3 opacity-70 transition hover:opacity-100"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white shadow-sm">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                />
              </div>

              <span className="text-sm font-medium text-[#5A5E55]">
                {cert.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}