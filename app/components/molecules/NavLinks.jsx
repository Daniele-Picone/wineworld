"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import "./NavLinks.css";

export default function NavLinks() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMenuOpen(false);
  };
useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);
  return (
    <nav className="navbar" ref={navRef} >
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

       
        <>
  {user && (
    <>
      {user.role === "admin" ? (
        <li>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
        </li>
      ) : (
        <li>
          <Link href="/profile" onClick={() => setMenuOpen(false)}>
            Profilo
          </Link>
        </li>
      )}
      <li>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </li>
    </>
  )}
</>
      </ul>
    </nav>
  );
}
