"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";

function InstagramIcon({ size = 24, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 24, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2h3.5l-.5 3H11.5v7h-3v-7H7v-3h1.5v-2A4 4 0 0 1 12.5 5.5H15v3Z" />
    </svg>
  );
}

const shopLinks = [
  { label: "All products", href: "/products" },
  { label: "Swings", href: "/products/swings" },
  { label: "Accessories", href: "/products/accessories" },
  { label: "Gift cards", href: "/gift-cards" },
];

const companyLinks = [
  { label: "Our story", href: "/our-story" },
  { label: "Journal", href: "/journal" },
  { label: "Careers", href: "/careers" },
];

const supportLinks = [
  { label: "Contact us", href: "/contact" },
  { label: "Shipping & delivery", href: "/shipping" },
  { label: "Care guide", href: "/care-guide" },
  { label: "FAQs", href: "/faq" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F5F1E8]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-[#B8AC9E] transition-colors hover:text-[#E8A87C]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#141110] px-4 pb-8 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] md:gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <span className="font-serif text-3xl text-[#F5F1E8]">dolna.</span>
            <p className="mt-4 text-base leading-relaxed text-[#B8AC9E]">
              যত্নে তৈরি দোলনা, যা ঘরের প্রতিটি মুহূর্তকে করে তোলে একটু বেশি
              শান্ত।
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                aria-label="dolna on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3A342E] text-[#F5F1E8] transition-colors hover:border-[#E8A87C] hover:text-[#E8A87C]"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="dolna on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3A342E] text-[#F5F1E8] transition-colors hover:border-[#E8A87C] hover:text-[#E8A87C]"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="mailto:hello@dolna.com"
                aria-label="Email dolna"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3A342E] text-[#F5F1E8] transition-colors hover:border-[#E8A87C] hover:text-[#E8A87C]"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Company" links={companyLinks} />

          {/* Support + newsletter */}
          <div>
            <FooterColumn title="Support" links={supportLinks} />

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#F5F1E8]">
                Stay in the loop
              </h3>
              <p className="mt-2 text-sm text-[#B8AC9E]">
                New pieces and journal notes, a few times a month.
              </p>

              {submitted ? (
                <p className="mt-4 text-sm text-[#E8A87C]">
                  Thanks — you&apos;re on the list.
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="mt-4 flex overflow-hidden rounded-full border border-[#3A342E] bg-[#1E1A17] pr-1"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm text-[#F5F1E8] placeholder:text-[#7A6F63] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-[#E8A87C] px-5 py-2 text-sm font-semibold text-[#1E1A17] transition-colors hover:bg-[#f0bb98]"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-[#2E2924]" />

        <div className="mt-6 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#7A6F63]">
            © {new Date().getFullYear()} dolna. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs text-[#7A6F63] transition-colors hover:text-[#E8A87C]"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-xs text-[#7A6F63] transition-colors hover:text-[#E8A87C]"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}