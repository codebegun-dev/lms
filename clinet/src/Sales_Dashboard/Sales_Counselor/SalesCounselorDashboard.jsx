import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import CounselorNavbar from "./CounselorNavbar";
import CounselorSidebar from "./CounselorSidebar";

function SalesCounselorDashboard() {
  const location = useLocation();
  const showCards = location.pathname === "/sales-counselor";
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    statusCounts: {
      NEW: 0,
      CONTACTED: 0,
      INTERESTED: 0,
      NOT_INTERESTED: 0,
      ENROLLED: 0
    },
    leads: []
  });
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:8080/api/saleCourse/leads"; 

  // Function to get logged-in user from localStorage
  const getLoggedInUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return null;
  };

  // Function to get logged-in user ID
  const getLoggedInUserId = () => {
    const user = getLoggedInUser();
    return user ? user.userId : null;
  };

  useEffect(() => {
    fetchLeadCounts();
  }, []);

  const fetchLeadCounts = async () => {
    try {
      setLoading(true);
      const loggedInUserId = getLoggedInUserId();
      
      // Call API with loggedInUserId parameter if available
      const url = loggedInUserId 
        ? `${BASE_URL}?loggedInUserId=${loggedInUserId}`
        : BASE_URL;
      
      const res = await axios.get(url);
      const data = res.data || {};
      
      // Extract data from API response
      const dashboardData = {
        totalLeads: data.totalLeads || 0,
        statusCounts: {
          NEW: data.statusCounts?.NEW || 0,
          CONTACTED: data.statusCounts?.CONTACTED || 0,
          INTERESTED: data.statusCounts?.INTERESTED || 0,
          NOT_INTERESTED: data.statusCounts?.NOT_INTERESTED || 0,
          ENROLLED: data.statusCounts?.ENROLLED || 0
        },
        leads: data.leads || []
      };
      
      setDashboardData(dashboardData);
    } catch (err) {
      console.error("Failed to fetch leads", err);
      setDashboardData({
        totalLeads: 0,
        statusCounts: {
          NEW: 0,
          CONTACTED: 0,
          INTERESTED: 0,
          NOT_INTERESTED: 0,
          ENROLLED: 0
        },
        leads: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Use the status counts from the API response
  const { totalLeads, statusCounts } = dashboardData;

  const statsCards = [
    { 
      title: "Total Leads", 
      value: totalLeads, // Use totalLeads from API (200), not leads.length (14)
      icon: "📊",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#fff"
    },
    { 
      title: "New", 
      value: statusCounts.NEW, // Use NEW count from API (199)
      icon: "🆕",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "#fff"
    },
    { 
      title: "Contacted", 
      value: statusCounts.CONTACTED, // Use CONTACTED count from API (0 if not present)
      icon: "📞",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textColor: "#fff"
    },
    { 
      title: "Interested", 
      value: statusCounts.INTERESTED, // Use INTERESTED count from API (0 if not present)
      icon: "⭐",
      bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      textColor: "#fff"
    },
    { 
      title: "Not Interested", 
      value: statusCounts.NOT_INTERESTED, // Use NOT_INTERESTED count from API (0 if not present)
      icon: "❌",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      textColor: "#fff"
    },
    {
      title: "Enrolled",
      value: statusCounts.ENROLLED, // Use ENROLLED count from API (1)
      icon: "🎓",
      bgGradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      textColor: "#fff"
    }
  ];

  return (
    <>
      <CounselorNavbar />
      <div className="d-flex" style={{ height: "calc(100vh - 70px)" }}>
        <div
          style={{
            width: "250px",
            background: "#ffffff",
            borderRight: "1px solid #e0e6ed",
            overflowY: "auto",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          }}
        >
          <CounselorSidebar />
        </div>

        <div
          className="flex-grow-1 p-4"
          style={{
            background: "linear-gradient(180deg, #f8f9fc 0%, #eef2f7 100%)",
            overflowY: "auto",
          }}
        >
          {showCards ? (
            <div className="container-fluid">
              <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">
                  Counselor Dashboard Overview
                </h2>
                <p className="text-muted mb-0">
                  Track your lead engagement performance
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
              ) : (
                <div className="row g-3">
                  {statsCards.map((card, index) => (
                    <div key={index} className="col-xl-2 col-lg-4 col-md-6">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: card.bgGradient,
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 24px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.1)";
                        }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6
                                className="text-uppercase mb-2 fw-semibold"
                                style={{
                                  color: card.textColor,
                                  opacity: 0.9,
                                  fontSize: "0.75rem",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {card.title}
                              </h6>
                              <h3
                                className="fw-bold mb-1"
                                style={{
                                  color: card.textColor,
                                  fontSize: "2rem",
                                }}
                              >
                                {card.value}
                              </h3>
                              <p
                                className="mb-0 fw-semibold"
                                style={{
                                  color: card.textColor,
                                  opacity: 0.9,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {totalLeads > 0
                                  ? ((card.value / totalLeads) * 100).toFixed(1)
                                  : 0}% of total
                              </p>
                            </div>
                            <div style={{ fontSize: "2rem", opacity: 0.8 }}>
                              {card.icon}
                            </div>
                          </div>
                          <div className="mt-2">
                            <small style={{ color: card.textColor, opacity: 0.8 }}>
                              {card.title === "Total Leads" 
                                ? "All leads in system" 
                                : `${card.title} leads`}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
}

export default SalesCounselorDashboard;