'use client'

import './Sidebar.css';
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

export default function Sidebar() {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();          
    router.push("/");  
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className={`hamburger ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside>
        <div className="logo">
          <h1>WineWorld</h1>
        </div>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <Link href="/dashboard" onClick={closeMenu}><h3>Dashboard</h3></Link>
          <Link href="/dashboard/users" onClick={closeMenu}><h3>Users</h3></Link>
          <Link href="/dashboard/articles" onClick={closeMenu}><h3>Scrivi Articolo</h3></Link>
          <Link href="/dashboard/posts/wine" onClick={closeMenu}><h3>Articoli Vino</h3></Link>
          <Link href="/dashboard/posts/wineworld" onClick={closeMenu}><h3>Articoli Wineworld</h3></Link>
          <Link href="/dashboard/posts/blog" onClick={closeMenu}><h3>Articoli Blog</h3></Link>
          <Link href="/dashboard/users" onClick={closeMenu}><h3>Tikets</h3></Link>
          <Link href="/" onClick={closeMenu}><h3>HomePage</h3></Link>
          <div className="dash_logout">
            <button onClick={handleLogout} className='logoutbtn'>Logout</button>
          </div>
        </div>
      </aside>
    </>
  );
}