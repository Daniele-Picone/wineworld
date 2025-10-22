
'use client';
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import DashboardLayout from "../components/layout/dashboardLayout";
import './page.css';
export default function UsersPage() {
 const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch utenti
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

  // Elimina utente
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
      fetchUsers(); // aggiorna lista utenti
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Caricamento...</p>;
    if (!user) {
    return <div>Caricamento...</div>;
  }

  return (
    <DashboardLayout>
      <div className="user_controller">

      <h1>Lista Utenti</h1>
      <table className="user_table" >
        <thead className="column_name" >
          <tr className="column_name_row">
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody className="table_body" >
          {users.map(u => (
            <tr className="user_row"  key={u.id}>
              <td className="user_date" >{u.id}</td>
              <td className="user_date" >{u.name}</td>
              <td className="user_date"  >{u.email}</td>
              <td className="user_date"  >{u.role}</td>
              <td className="user_date"  >
                <button onClick={() => deleteUser(u.id)} >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </DashboardLayout>
  );
}
