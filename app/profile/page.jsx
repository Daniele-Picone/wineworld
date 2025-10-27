"use client";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import MainLayout from "../components/layouts/MainLayout";

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
    <MainLayout>
      
    </MainLayout>
  );
}
