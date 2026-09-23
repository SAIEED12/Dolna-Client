'use client'
import { useState } from "react";
import { Link } from "@heroui/react";
import { useSession, authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { getDashboardPathByRole } from "@/lib/dashboard-nav";
import Image from "next/image";
import { CartDrawer } from "./cart/Drawer";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {data: session} = useSession();
  const user = session?.user;
  const dashboardHref = getDashboardPathByRole(user?.role);

  const pathname = usePathname();
  if(pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsMenuOpen(false);
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
    <nav className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white/85 backdrop-blur-md shadow-sm shadow-black/5">
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
            <Image src="/logo.png" alt="BelaView Logo" width={70} height={70} className="rounded-full bg-white object-contain"></Image>
          </Link>
        </div>

        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <Link href="/" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/products" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand">
              ALL PRODUCTS
            </Link>
          </li>
          <li>
            <Link href="/categories" className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand">
              CATEGORIES
            </Link>
          </li>
          {user && (
            <li>
              <Link href={dashboardHref} className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand">
                DASHBOARD
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden items-center gap-3 md:flex">

          {/* Login link*/}
          {user ? (
            <Link
              href={dashboardHref}
              className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand"
            >
              WELCOME, {user.name}!
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] no-underline hover:text-brand"
            >
              LOGIN
            </Link>
          )

        }
          {/* Sign Up / Sign Out */}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="cursor-pointer rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-white no-underline hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "SIGNING OUT..." : "SIGN OUT"}
            </button>
          ) : (
            <Link
              href="/signup"
              className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-white no-underline hover:bg-brand"
            >
              SIGN UP
            </Link>
          )}

        {/* Cart Drawer */}
        <CartDrawer />
        
        </div>

        <div className="md:hidden">
          <CartDrawer compact />
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-[#E5E5E5] md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link href="/" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/products" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                ALL PRODUCTS
              </Link>
            </li>
            <li>
              <Link href="/categories" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                CATEGORIES
              </Link>
            </li>
            {user && (
              <li>
                <Link href={dashboardHref} className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                  DASHBOARD
                </Link>
              </li>
            )}

            <li className="mt-2 border-t border-[#E5E5E5] pt-3">
              {user ? (
                <Link href={dashboardHref}
                 className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A]">
                  WELCOME, {user.name}!
                </Link>
              ) : (
                <Link href="/login" className="block py-2 text-sm tracking-[0.1em] text-[#1A1A1A] no-underline">
                  LOGIN
                </Link>
              )}
            </li>
            <li>
              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="block w-full cursor-pointer rounded-full bg-[#1A1A1A] px-4 py-2 text-center text-sm font-semibold tracking-[0.1em] text-white hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSigningOut ? "SIGNING OUT..." : "SIGN OUT"}
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="block rounded-full bg-[#1A1A1A] px-4 py-2 text-center text-sm font-semibold tracking-[0.1em] text-white no-underline hover:bg-brand"
                >
                  SIGN UP
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}

    </nav>
  );
}