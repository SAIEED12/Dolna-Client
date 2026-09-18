"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";


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

function WhatsAppIcon({ size = 24, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.613.613l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.82-6.293-2.192l-.44-.357-2.891.967.967-2.891-.357-.44A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
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

  const pathname = usePathname();
  if(pathname.includes("dashboard")) {
    return null;
  }
  
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
                href="https://wa.me/XXXXXXXXXXX"
                aria-label="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3A342E] text-[#F5F1E8] transition-colors hover:border-[#E8A87C] hover:text-[#E8A87C]"
              >
                <WhatsAppIcon size={16} />
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
                Get in touch
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 text-sm text-[#B8AC9E]">
                  <Mail size={15} />
                  <a
                    href="mailto:hello@dolna.com"
                    className="transition-colors hover:text-[#E8A87C]"
                  >
                    hello@dolna.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#B8AC9E]">
                  <Phone size={15} />
                  <a
                    href="tel:+8801XXXXXXXXX"
                    className="transition-colors hover:text-[#E8A87C]"
                  >
                    +880 1XXX-XXXXXX
                  </a>
                </li>
              </ul>
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