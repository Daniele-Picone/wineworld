"use client";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

export default function Profile() {
 const { user, logout } = useUser();
   const router = useRouter();
 
   // Logout
   const handleLogout = () => {
     logout();          
     router.push("/");  
   };
  if (!user) return <p>Non sei loggato</p>;

  return (
    <div>
      <h1>Profilo di {user.name}</h1>
      <p>Email: {user.email}</p>
       <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
