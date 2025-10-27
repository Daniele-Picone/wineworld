import Sidebar from "../organism/Sidebar";


import './dashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    <div className="container">
      <Sidebar />
      <div className="dashboard-content">
        <main className="mainContent">{children}</main>
      </div>
    </div>
  );
}
