"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/layout/shared/logo";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const scrollY = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10) * -1);
      }
    }
  }, [menuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMenuOpen(false);
      }
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <header className="relative z-[100] flex h-19 w-full items-center border-b border-border bg-background backdrop-blur-sm">
      <div className="mx-auto flex h-19 w-[1350px] items-center px-4.5 py-1.5">
        <div className="flex h-16 w-full items-center py-2.5">
          {/* Logo */}
          <Link
            href="/"
            className="mr-7 cursor-pointer transition-all hover:opacity-80"
          >
            <Logo className="h-[42px] w-[120px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden h-8 items-center gap-6 lg:flex">
            <span className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Section 1
            </span>

            <span className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Section 2
            </span>

            <span className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Section 3
            </span>

            <span className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Section 4
            </span>

            <span className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Section 5
            </span>
          </nav>

          {/* Desktop Actions */}
          <div className="ml-auto hidden h-8 items-center gap-2 lg:flex">
            <button className="h-8 w-[80.5938px] cursor-pointer rounded-md border border-border bg-background/80 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Login
            </button>

            <button className="h-8 w-[180px] cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {menuOpen ? (
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5H17M3 10H17M3 15H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <aside
        className={`fixed inset-x-0 top-19 z-[99] flex h-[calc(100vh-4.75rem)] flex-col justify-between overflow-hidden bg-background px-6 py-8 transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        {/* Navigation */}
        <nav className="flex flex-col gap-6 pl-3">
          <span className="cursor-pointer text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Section 1
          </span>

          <span className="cursor-pointer text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Section 2
          </span>

          <span className="cursor-pointer text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Section 3
          </span>

          <span className="cursor-pointer text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Section 4
          </span>

          <span className="cursor-pointer text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Section 5
          </span>
        </nav>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="h-8 w-full cursor-pointer rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Login
          </button>

          <button className="h-8 w-full cursor-pointer rounded-md bg-primary/90 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary">
            Sign Up
          </button>
        </div>
      </aside>
    </header>
  );
}
