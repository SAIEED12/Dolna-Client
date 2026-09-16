"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowDownRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1692619223445-63d5d2c1ec18?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "ধীরে তৈরি, গভীরভাবে বসবাস",
    heading: "ঘরকে চলতে দিন আপনার ছন্দে।",
    subtext:
      "হাতে তৈরি দোলনা, যা থামা, খেলা আর প্রিয়জনের জন্য জায়গা করে দেয়।",
    cta: "আপনার দোলনা খুঁজুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1765135685377-b6175d4c2788?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "প্রাকৃতিক উপকরণ",
    heading: "আরামের এক নতুন সংজ্ঞা।",
    subtext: "টেকসই কাঠ আর নরম বুননে তৈরি, দীর্ঘস্থায়ী সৌন্দর্যে ভরা।",
    cta: "সংগ্রহ দেখুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552253678-e8b5514c43cd?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "কারিগরের হাতে গড়া",
    heading: "প্রতিটি দোলনা একটি গল্প বলে।",
    subtext: "স্থানীয় কারিগরদের যত্নে, একটি একটি করে তৈরি হয় প্রতিটি টুকরো।",
    cta: "আমাদের গল্প জানুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552851506-ff5594ca5e66?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "সবুজের মাঝে শান্তি",
    heading: "যেখানে গল্প শুরু হয়।",
    subtext: "পরিবারের সাথে কাটানো মুহূর্তগুলোকে করে তুলুন আরও বিশেষ।",
    cta: "এখনই দেখুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1767627651189-0a40aee60686?auto=format&fit=crop&w=1800&q=90",
    eyebrow: "আপনার ঘর, আপনার ছন্দ",
    heading: "প্রশান্তি আনুন প্রতিটি কোণে।",
    subtext: "আমাদের হাতে তৈরি দোলনা দিয়ে সাজান আপনার প্রিয় জায়গাটি।",
    cta: "কালেকশন ব্রাউজ করুন",
  },
];

const pad = (n) => String(n).padStart(2, "0");

export default function Hero() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, []);

  const restartAutoplay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 5000);
  };

  const slide = slides[active];

  return (
    <section className="w-full bg-[#F5F1E8] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-3xl">
        <div className="flex flex-col md:h-[640px] md:flex-row">
          {/* Left content panel */}
          <div className="order-2 flex w-full flex-col justify-between bg-[#C1633C] px-6 py-10 sm:px-10 md:order-1 md:w-[38%] md:px-14 md:py-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#F5F1E8]">
                {slide.eyebrow}
              </p>

              <h1 className="font-serif text-4xl leading-tight text-[#F5F1E8] md:text-6xl">
                {slide.heading}
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-[#F5F1E8]/85 md:text-lg">
                {slide.subtext}
              </p>
            </div>

            <div className="mt-10 flex items-end justify-between gap-4 md:mt-0">
              <button className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F5F1E8]">
                <span className="border-b border-[#F5F1E8]/70 pb-1 transition-colors group-hover:border-[#F5F1E8]">
                  {slide.cta}
                </span>
                <ArrowDownRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </button>

              <span className="whitespace-nowrap text-xs font-medium text-[#F5F1E8]/70">
                {pad(active + 1)} / {pad(slides.length)}
              </span>
            </div>
          </div>

          {/* Right image panel */}
          <div className="relative order-1 h-[45vh] min-h-72 w-full md:order-2 md:h-auto md:w-[62%]">
            {slides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: i === active ? 1 : 0,
                  zIndex: i === active ? 1 : 0,
                }}
                aria-hidden={i !== active}
              >
                <Image
                  src={s.image}
                  alt={s.heading}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 62vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}

            {/* Bottom scrim for control legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/30 to-transparent" />

            {/* Pagination dots */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i);
                    restartAutoplay();
                  }}
                  aria-label={`go to slide ${i + 1}`}
                  className="h-2 cursor-pointer rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "28px" : "8px",
                    backgroundColor:
                      i === active ? "#F5F1E8" : "rgba(245,241,232,0.5)",
                  }}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="absolute bottom-6 right-6 z-10 flex gap-3">
              <button
                onClick={() => {
                  prev();
                  restartAutoplay();
                }}
                aria-label="previous slide"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-[#F5F1E8] text-[#1A1A1A] transition-colors hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => {
                  next();
                  restartAutoplay();
                }}
                aria-label="next slide"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-[#F5F1E8] text-[#1A1A1A] transition-colors hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}