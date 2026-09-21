"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, LogOut } from "lucide-react";
import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";

function isActive(pathname, href, exact) {
  if (exact) return pathname === href;
  return pathname === href || pathname?.startsWith(`${href}/`);
}

export default function Sidebar({
  onNavigate,
  navSections = [],
  badge = "",
  basePath = "/dashboard",
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "A";

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-[#E5E5E5] px-5">
        <Link href={basePath} onClick={onNavigate} className="no-underline">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full bg-white object-contain" />
        </Link>
        {badge && (
          <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {badge}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dashboard">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.15em] text-[#8A8A8A] uppercase">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href, item.exact);
                const Icon = item.icon;
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                        active
                          ? "bg-[#1A1A1A] text-white"
                          : "text-[#1A1A1A] hover:bg-[#F5F5F5]"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        className={active ? "text-brand-rose" : "text-[#8A8A8A]"}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#E5E5E5] p-3">
        <Link
          href="/products"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#1A1A1A] no-underline transition-colors hover:bg-[#F5F5F5]"
        >
          <Store size={18} strokeWidth={1.75} className="text-[#8A8A8A]" />
          View Products
        </Link>
        <div className="mt-1 flex items-center gap-3 rounded-xl bg-[#F5F5F5] px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1A1A1A]">
              {user?.name ?? "Account"}
            </p>
            <p className="truncate text-xs text-[#8A8A8A]">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign out"
            aria-label="Sign out"
            className="cursor-pointer rounded-full p-2 text-[#8A8A8A] transition-colors hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
