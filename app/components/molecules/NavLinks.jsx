"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import "./NavLinks.css";

export default function NavLinks() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <ul className={`nav_links ${menuOpen ? "active" : ""}`}>
        <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link href="/wine" onClick={() => setMenuOpen(false)}>Vini</Link></li>
        <li><Link href="/wineworld" onClick={() => setMenuOpen(false)}>Il Mondo del Vino</Link></li>
        <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>

        {user ? (
          <>
            {user.role === "admin" ? (
              <li><Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            ) : (
              <li><Link href="/profile" onClick={() => setMenuOpen(false)}>Profilo</Link></li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link href="/register" onClick={() => setMenuOpen(false)}>Registrati</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
