import React from "react";
import { Outlet } from "react-router-dom";
import SalesNavbar from "./SalesNavbar";
import SalesSidebar from "./SalesSidebar";

function SalesDashboard() {
  return (
    <>
      {/* NAVBAR (Top full width) */}
      <SalesNavbar />

      {/* MAIN LAYOUT */}
      <div
        className="d-flex"
        style={{
          height: "calc(100vh - 70px)", // Full height under navbar
          marginTop: "0",
        }}
      >
        {/* SIDEBAR - Full height */}
        <div
          style={{
            width: "250px",
            height: "100%",
            overflowY: "auto",
            background: "#fff",
            borderRight: "1px solid #dee2e6",
          }}
        >
          <SalesSidebar />
        </div>

        {/* PAGE CONTENT */}
        <div
          className="flex-grow-1 p-4"
          style={{
            background: "#f8f9fa",
            overflowY: "auto",
          }}
        >
          {/* Nested routes will render here */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default SalesDashboard;
