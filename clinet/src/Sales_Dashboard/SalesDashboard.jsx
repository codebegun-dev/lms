import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import SalesNavbar from "./SalesNavbar";
import SalesSidebar from "./SalesSidebar";

function SalesDashboard() {
  const location = useLocation();
  const showCards = location.pathname === "/sales-dashboard";
  const [leads, setLeads] = useState([]);
  const BASE_URL = "http://localhost:8080/api/saleCourse/student";

  useEffect(() => {
    fetchLeadCounts();
  }, []);

  const fetchLeadCounts = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads");
    }
  };

  // Count logic - using LeadsList approach for "New" count
  const total = leads.length;
  const newCount = leads.filter(l => l.status === "NEW" || l.status === "INITIAL").length;
  const contacted = leads.filter(l => l.status === "Contacted").length;
  const interested = leads.filter(l => l.status === "Interested").length;
  const notInterested = leads.filter(l => l.status === "Not Interested").length;
  const enrolled = leads.filter(l => l.status === "Enrolled").length;

  const statsCards = [
    { 
      title: "Total Leads", 
      value: total, 
      icon: "📊",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#fff"
    },
    { 
      title: "New", 
      value: newCount, 
      icon: "🆕",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "#fff"
    },
    { 
      title: "Contacted", 
      value: contacted, 
      icon: "📞",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textColor: "#fff"
    },
    { 
      title: "Interested", 
      value: interested, 
      icon: "⭐",
      bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      textColor: "#fff"
    },
    { 
      title: "Not Interested", 
      value: notInterested, 
      icon: "❌",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      textColor: "#fff"
    },
    { 
      title: "Enrolled", 
      value: enrolled, 
      icon: "🎓",
      bgGradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      textColor: "#fff"
    }
  ];

  return (
    <>
      <SalesNavbar />
      <div className="d-flex" style={{ height: "calc(100vh - 70px)" }}>
        
        <div 
          style={{
            width: "250px",
            background: "#ffffff",
            borderRight: "1px solid #e0e6ed",
            overflowY: "auto",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)"
          }}
        >
          <SalesSidebar />
        </div>

        <div 
          className="flex-grow-1 p-4" 
          style={{ 
            background: "linear-gradient(180deg, #f8f9fc 0%, #eef2f7 100%)",
            overflowY: "auto"
          }}
        >
          
          {showCards ? (
            <div className="container-fluid">
              <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Dashboard Overview</h2>
                <p className="text-muted mb-0">Track your sales leads performance</p>
              </div>

              <div className="row g-3">
                {statsCards.map((card, index) => (
                  <div 
                    key={index} 
                    className="col"
                  >
                    <div 
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: card.bgGradient,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 
                              className="text-uppercase mb-2 fw-semibold" 
                              style={{ 
                                color: card.textColor,
                                opacity: 0.9,
                                fontSize: "0.75rem",
                                letterSpacing: "0.5px"
                              }}
                            >
                              {card.title}
                            </h6>
                            <h3 
                              className="fw-bold mb-1" 
                              style={{ 
                                color: card.textColor,
                                fontSize: "2rem"
                              }}
                            >
                              {card.value}
                            </h3>
                            <p 
                              className="mb-0 fw-semibold"
                              style={{
                                color: card.textColor,
                                opacity: 0.9,
                                fontSize: "0.75rem"
                              }}
                            >
                              {total > 0 ? ((card.value / total) * 100).toFixed(1) : 0}%
                            </p>
                          </div>
                          <div 
                            style={{
                              fontSize: "2rem",
                              opacity: 0.8
                            }}
                          >
                            {card.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
}

export default SalesDashboard;