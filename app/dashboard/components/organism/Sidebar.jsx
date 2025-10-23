
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
    <div className="sidebar">
      <div className="dash_start">
         <h2 >DashBoard </h2>
         <div className="dash_profile">
            <div className="dash_profile_img">
                <img src="/loginimg.jpg" alt="" />
            </div>
            <div className="dash_profile_user">
              <h4>Utente</h4> 
              <p>{user?.name || 'Caricamento...'}</p>
            </div>
         </div>
      </div>
    
    <div className="dash_links">
        <div className="admin_links">
            <h3 className='links_title' >Links Amministrativi</h3>
          <ul className='dashboard_links_list' >
         <li>
          <Link href="/dashboard">Home</Link>
        </li>
        <li>
         <Link href="/dashboard/users">Users</Link>

        </li>
        <li>
          <Link href="/dashboard/articles">Aggiungi Post</Link>

        </li>
      </ul>
        </div>
      <div className="webLink">
              <h3  className='links_title' >Links navigazione Sito</h3>
             <ul className='dashboard_links_list' >
         <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/wine"  >Vini</Link>
        </li>
        <li>
          <Link href="/wineworld">Il Mondo del Vino</Link>
        </li>
        <li >
          <Link href="/blog">Blog</Link>
        </li>
      </ul>
      </div>
    </div>

    
        <button
        onClick={handleLogout}
        className='logoutbtn'>
        Logout
      </button>
    </div>
  );
}

