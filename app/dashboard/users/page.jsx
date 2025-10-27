'use client';

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import DashboardLayout from "../components/layout/dashboardLayout";
import DataTable from "../components/molecules/DataTable";
import './page.css';

export default function UsersPage() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);






  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Errore durante l'eliminazione");
        return;
      }
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Controllo user PRIMA di loading
  if (!user) {
    return (
      <DashboardLayout>
        <div>Caricamento utente...</div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p>Caricamento lista utenti...</p>
      </DashboardLayout>
    );
  }

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "role", label: "Ruolo" },
    { key: "created_at", label: "Data Registrazione" },
  ];
  const userActions = [
    { label: 'Elimina', text: 'Elimina', onClick: (user) => deleteUser(user.id), className: 'btn-delete' }
  ];
  return (
    <DashboardLayout>
      <div className="user_controller">
        <h1>Lista Utenti</h1>
        <DataTable columns={userColumns} data={users} loading={loading} actions={userActions} />
      </div>
    </DashboardLayout>
  );
}