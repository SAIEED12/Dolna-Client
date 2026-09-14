"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      "https://images.unsplash.com/photo-1648365762084-f9ce021aada5?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "প্রাকৃতিক উপকরণ",
    heading: "আরামের এক নতুন সংজ্ঞা।",
    subtext: "টেকসই কাঠ আর নরম বুননে তৈরি, দীর্ঘস্থায়ী সৌন্দর্যে ভরা।",
    cta: "সংগ্রহ দেখুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1642013957722-1474e69f3893?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "কারিগরের হাতে গড়া",
    heading: "প্রতিটি দোলনা একটি গল্প বলে।",
    subtext: "স্থানীয় কারিগরদের যত্নে, একটি একটি করে তৈরি হয় প্রতিটি টুকরো।",
    cta: "আমাদের গল্প জানুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1775403908946-8c8237001a65?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "সবুজের মাঝে শান্তি",
    heading: "যেখানে গল্প শুরু হয়।",
    subtext: "পরিবারের সাথে কাটানো মুহূর্তগুলোকে করে তুলুন আরও বিশেষ।",
    cta: "এখনই দেখুন",
  },
  {
    image:
      "https://images.unsplash.com/photo-1750822366602-3cbb2fb27596?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "আপনার ঘর, আপনার ছন্দ",
    heading: "প্রশান্তি আনুন প্রতিটি কোণে।",
    subtext: "আমাদের হাতে তৈরি দোলনা দিয়ে সাজান আপনার প্রিয় জায়গাটি।",
    cta: "কালেকশন ব্রাউজ করুন",
  },
];

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

  return (
    <section className="relative h-[85vh] min-h-140 w-full overflow-hidden bg-[#1A1A1A]">
      {slides.map((slide, i) => (
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
            src={slide.image}
            alt={slide.heading}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover brightness-[0.85]"
          />

          {/* Overall readability scrim */}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/55 to-black/30" />

          {/* Left-side scrim behind text */}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-0">
              <div className="max-w-xl">
                <p className="mb-4 text-xs font-semibold text-[#E8A87C]">
                  {slide.eyebrow}
                </p>

                <h1 className="font-serif text-4xl leading-tight text-[#F5F1E8] md:text-6xl">
                  {slide.heading}
                </h1>

                <p className="mt-5 max-w-md text-base leading-relaxed text-[#F5F1E8]/85 md:text-lg">
                  {slide.subtext}
                </p>

                <button className="mt-8 rounded-full bg-[#C1633C] px-7 py-3 text-xs font-semibold text-[#F5F1E8] transition-colors hover:bg-[#a8532f] cursor-pointer">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev-Next */}
      <button
        onClick={() => {
          prev();
          restartAutoplay();
        }}
        aria-label="preivous slide"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[#F5F1E8] backdrop-blur-sm transition-colors hover:bg-white/20 md:left-8 cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => {
          next();
          restartAutoplay();
        }}
        aria-label="next slide"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[#F5F1E8] backdrop-blur-sm transition-colors hover:bg-white/20 md:right-8 cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              restartAutoplay();
            }}
            aria-label={`next slide ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === active ? "28px" : "8px",
              backgroundColor:
                i === active ? "#C1633C" : "rgba(245,241,232,0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}