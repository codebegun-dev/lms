import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <AdminNavbar />
      </div>

      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-2">
          <AdminSidebar />
        </div>

        {/* ✅ Outlet shows nested components */}
        <div className="col-10 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



