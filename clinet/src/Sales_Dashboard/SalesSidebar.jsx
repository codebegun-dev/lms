import React from "react";
import { Link } from "react-router-dom";

function SalesSidebar() {
  return (
    <div className="p-3 bg-white" style={{ minHeight: "100%" }}>
      <h5 className="fw-bold mb-4 text-primary">Sales Menu</h5>

      <ul className="list-group">

        <Link to="/sales-dashboard" className="list-group-item list-group-item-action">
          Dashboard
        </Link>

        <Link to="/sales-dashboard/add-enquiry" className="list-group-item list-group-item-action">
          Add Enquiry
        </Link>

        <Link to="/sales-dashboard/leads" className="list-group-item list-group-item-action">
          Leads List
        </Link>

        <Link to="/sales-dashboard/bulkupload" className="list-group-item list-group-item-action">
          Bulk Upload
        </Link>

      </ul>
    </div>
  );
}

export default SalesSidebar;
