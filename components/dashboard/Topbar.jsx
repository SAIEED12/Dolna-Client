"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {  ChevronRight, Menu } from "lucide-react";
import { getPageTitle } from "@/lib/dashboard-nav";

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const title = getPageTitle(pathname);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function onEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);


  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-md md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="cursor-pointer rounded-full p-2 text-ink transition-colors hover:bg-mist lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb + title */}
      <div className="min-w-0 flex-1">
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1 text-xs text-fog sm:flex"
        >
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="font-medium text-ink">{title}</span>
        </nav>
        <h1 className="truncate font-serif text-xl text-ink md:hidden">
          {title}
        </h1>
      </div>
    </header>
  );
}
