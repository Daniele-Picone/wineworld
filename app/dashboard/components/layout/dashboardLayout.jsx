import Sidebar from "../organism/Sidebar";
import Footer  from "../organism/Footer";
import './dashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
