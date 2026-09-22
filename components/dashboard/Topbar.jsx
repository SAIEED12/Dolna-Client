"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { getPageTitle } from "@/lib/dashboard-nav";

export default function Topbar({ onMenuClick, basePath = "/dashboard" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "A";
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

  const handleSignOut = async () => {
    setMenuOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[#E5E5E5] bg-white/85 px-4 backdrop-blur-md md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="cursor-pointer rounded-full p-2 text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5] lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb + title */}
      <div className="min-w-0 flex-1">
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1 text-xs text-[#8A8A8A] sm:flex"
        >
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="font-medium text-[#1A1A1A]">{title}</span>
        </nav>
        <h1 className="truncate font-serif text-xl text-[#1A1A1A] md:hidden">
          {title}
        </h1>
      </div>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifications"
        className="relative cursor-pointer rounded-full border border-[#E5E5E5] p-2.5 text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5]"
      >
        <Bell size={17} strokeWidth={1.75} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand ring-2 ring-white" />
      </button>

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={menuOpen}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-[#E5E5E5] py-1 pr-1 pl-1 transition-colors hover:bg-[#F5F5F5]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-white">
            {initial}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-xl shadow-black/10">
            <div className="border-b border-[#E5E5E5] px-4 py-3">
              <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                {user?.name ?? "Account"}
              </p>
              <p className="truncate text-xs text-[#8A8A8A]">
                {user?.email ?? ""}
              </p>
            </div>
            <div className="p-1.5">
              <Link
                href={`${basePath}/settings`}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm text-[#1A1A1A] no-underline hover:bg-[#F5F5F5]"
              >
                Profile settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium text-brand hover:bg-brand-soft"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
