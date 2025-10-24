
'use client'

import './Sidebar.css';
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";




export default function Sidebar() {
  const { user, logout } = useUser();
  const handleLogout = () => {
      logout();          
      router.push("/");  
    };
  return (
    
      <aside>
        <div className="logo">
           <h1> WineWorld </h1>
        </div>
        <div className="sidebar">
            <Link href="/dashboard" ><h3>Dashboard</h3> </Link>
            <Link href="/dashboard/users" ><h3>Users</h3></Link>
            <Link href="/dashboard/articles" ><h3>Scrivi Articolo</h3></Link>
            <Link href="/dashboard/users" ><h3>Scrivi Blog</h3></Link>
            <Link href="/dashboard/users" ><h3>History</h3></Link>
            <Link href="/dashboard/users" ><h3>Analistics</h3></Link>
            <Link href="/dashboard/users" ><h3>Tikets</h3></Link>
        <div className="dash_logout">
          <button onClick={handleLogout} className='logoutbtn'>Logout</button>
        </div>
        </div>
          
      </aside>
    
  );
}

