'use client'
import { useState } from "react";
import { Link, Button, Modal, Input, TextField, Label, Surface } from "@heroui/react";
import { Mail, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const cartCount = 0;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#E4DDCF]/60 bg-[#F5F1E8]/70 backdrop-blur-md shadow-sm shadow-black/5">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-6 w-6 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/" className="text-lg font-bold tracking-[0.15em] text-[#1A1A1A] no-underline">
            <span className="font-serif text-2xl tracking-tight text-[#1A1A1A]">
              dolna
              <span className="text-[#C1633C]">.</span>
            </span>
          </Link>
        </div>

        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <Link href="/" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-[#C1633C]">
              HOME
            </Link>
          </li>
          <li>
            <Link href="#" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-[#C1633C]">
              ALL PRODUCTS
            </Link>
          </li>
          <li>
            <Link href="#" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-[#C1633C]">
              CATEGORIES
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-3 md:flex">

          {/* Login link*/}
          <Link
            href="/login"
            className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-[#C1633C]"
          >
            LOGIN
          </Link>

          {/* Sign Up link*/}
          <Link
            href="/signup"
            className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#F5F1E8] no-underline hover:bg-[#C1633C]"
          >
            SIGN UP
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 rounded-full border border-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:bg-[#1A1A1A] hover:text-[#F5F1E8]"
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
            CART
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1A1A] text-[11px] font-bold text-[#F5F1E8]">
              {cartCount}
            </span>
          </Link>
        </div>

        <Link
          href="#"
          className="flex items-center gap-1 rounded-full border border-[#1A1A1A] px-3 py-2 text-[#1A1A1A] no-underline hover:bg-[#1A1A1A] hover:text-[#F5F1E8] md:hidden"
        >
          <ShoppingBag size={18} strokeWidth={1.75} />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1A1A] text-[11px] font-bold text-[#F5F1E8]">
            {cartCount}
          </span>
        </Link>
      </header>

      {isMenuOpen && (
        <div className="border-t border-[#E4DDCF] md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link href="/" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                HOME
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                ALL PRODUCTS
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                CATEGORIES
              </Link>
            </li>

            <li className="mt-2 border-t border-[#E4DDCF] pt-3">
              <Link href="/login" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                LOGIN
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="block rounded-full bg-[#1A1A1A] px-4 py-2 text-center text-sm font-semibold tracking-[0.1em] text-[#F5F1E8] no-underline"
              >
                SIGN UP
              </Link>
            </li>
          </ul>
        </div>
      )}

    </nav>
  );
}