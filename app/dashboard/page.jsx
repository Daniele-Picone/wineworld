// Dashboard.jsx
"use client";
import './page.css'

import { Children, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "./components/layout/dashboardLayout";


export default function Dashboard() {
  const { user} = useUser();
  const router = useRouter();


  if (!user) return null;



  return (
    <DashboardLayout>
    <div className="dashboard" >
     <h1>ciaoo</h1>
    </div>
    </DashboardLayout>    
  );
}
