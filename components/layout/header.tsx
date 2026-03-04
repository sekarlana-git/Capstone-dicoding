"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLogin = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) login(token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-all duration-300 z-[9999] ${
        isScrolled ? "py-2" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Logo.png"
            alt="Logo"
            width={150}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-cyan-500 font-medium">
            Beranda
          </Link>

          <Link href="/tentang-kami" className="text-gray-600 hover:text-cyan-500 font-medium">
            Tentang Kami
          </Link>

          <Link href="/layanan" className="text-gray-600 hover:text-cyan-500 font-medium">
            Layanan
          </Link>

          <Link href="/kontak-kami" className="text-gray-600 hover:text-cyan-500 font-medium">
            Kontak Kami
          </Link>
        </nav>

        {/* DESKTOP BUTTON */}
        {!isLogin ? (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">
                Log in
              </Button>
            </Link>

            <Link href="/register">
              <Button className="bg-gradient-to-r from-cyan-400 to-green-400 text-white">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profil">
              <Image alt="icon" src="/images/icon.svg" width={39} height={39} />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-[#00E240] border border-[#00E240] px-3 py-2 rounded-xl"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 z-[9999]"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-white z-[9998] transform transition-all duration-300 ${
          isMenuOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        } md:hidden pt-20 px-4`}
      >
        <nav className="flex flex-col items-center space-y-6 py-8">

          <Link href="/" onClick={closeMenu} className="text-xl">
            Beranda
          </Link>

          <Link href="/tentang-kami" onClick={closeMenu} className="text-xl">
            Tentang Kami
          </Link>

          <Link href="/layanan" onClick={closeMenu} className="text-xl">
            Layanan
          </Link>

          <Link href="/kontak-kami" onClick={closeMenu} className="text-xl">
            Kontak Kami
          </Link>

          {!isLogin ? (
            <div className="pt-4 flex flex-col space-y-4 w-full max-w-xs">

              <Link href="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full py-6">
                  Log in
                </Button>
              </Link>

              <Link href="/register" onClick={closeMenu}>
                <Button className="w-full py-6 bg-gradient-to-r from-cyan-400 to-green-400 text-white">
                  Register
                </Button>
              </Link>

            </div>
          ) : (
            <div className="pt-4 flex flex-col space-y-4 w-full max-w-xs">

              <Link href="/profil">
                <Button className="w-full">
                  Profil
                </Button>
              </Link>

              <Button onClick={handleLogout}>
                Logout
              </Button>

            </div>
          )}

        </nav>
      </div>
    </header>
  );
}