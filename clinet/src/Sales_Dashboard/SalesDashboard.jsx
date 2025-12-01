import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import SalesNavbar from "./SalesNavbar";
import SalesSidebar from "./SalesSidebar";

function SalesDashboard() {
  const location = useLocation();
  const showCards = location.pathname === "/sales-dashboard";
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    NEW: 0,
    CONTACTED: 0,
    INTERESTED: 0,
    NOT_INTERESTED: 0,
    ENROLLED: 0
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const BASE_URL = "http://localhost:8080/api/saleCourse/leads";

  // Function to get logged-in user from localStorage (similar to LeadsList)
  const getLoggedInUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user ? user.userId : null;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return null;
  };

  useEffect(() => {
    fetchLeadData();
  }, []);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const loggedInUserId = getLoggedInUserId();
      
      // Make API call - add userId parameter if needed
      const res = await axios.get(BASE_URL, {
        params: loggedInUserId ? { loggedInUserId } : {}
      });
      
      const data = res.data || {};
      
      // Extract data from backend response structure (same as LeadsList)
      const leadsArray = data.leads || [];
      const backendStatusCounts = data.statusCounts || {};
      const backendTotalLeads = data.totalLeads || 0;
      
      setLeads(leadsArray);
      setStatusCounts({
        NEW: backendStatusCounts.NEW || 0,
        CONTACTED: backendStatusCounts.CONTACTED || 0,
        INTERESTED: backendStatusCounts.INTERESTED || 0,
        NOT_INTERESTED: backendStatusCounts.NOT_INTERESTED || 0,
        ENROLLED: backendStatusCounts.ENROLLED || 0
      });
      setTotalLeads(backendTotalLeads);
      
    } catch (err) {
      console.error("Failed to fetch leads", err);
      setLeads([]);
      setStatusCounts({
        NEW: 0,
        CONTACTED: 0,
        INTERESTED: 0,
        NOT_INTERESTED: 0,
        ENROLLED: 0
      });
      setTotalLeads(0);
    } finally {
      setLoading(false);
    }
  };

  // Calculate additional metrics like in LeadsList
  const getAdditionalMetrics = () => {
    const assignedLeads = leads.filter(lead => 
      lead.assignedTo && lead.assignedTo.trim() !== "" && lead.assignedTo !== "Un-Assigned"
    ).length;
    
    const unassignedLeads = totalLeads > 0 ? totalLeads - assignedLeads : 0;
    
    const leadsWithEmail = leads.filter(lead => lead.email && lead.email.trim() !== "").length;
    const leadsWithPhone = leads.filter(lead => lead.phone && lead.phone.trim() !== "").length;
    
    const conversionRate = totalLeads > 0 ? ((statusCounts.ENROLLED / totalLeads) * 100).toFixed(1) : 0;
    
    const contactRate = totalLeads > 0 ? (((statusCounts.CONTACTED + statusCounts.INTERESTED + statusCounts.ENROLLED) / totalLeads) * 100).toFixed(1) : 0;
    const assignedPercentage = totalLeads > 0 ? ((assignedLeads / totalLeads) * 100).toFixed(1) : 0;

    return {
      assignedLeads,
      unassignedLeads,
      leadsWithEmail,
      leadsWithPhone,
      conversionRate,
      assignedPercentage,
      contactRate
    };
  };

  const metrics = getAdditionalMetrics();

  // Main Stats Cards - Same as LeadsList
  const statsCards = [
    { 
      title: "Total Leads", 
      value: totalLeads, 
      icon: "📊",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "All leads in system"
    },
    { 
      title: "New Leads", 
      value: statusCounts.NEW, 
      icon: "🆕",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Leads to be contacted"
    },
    { 
      title: "Contacted", 
      value: statusCounts.CONTACTED, 
      icon: "📞",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Initial contact made"
    },
    { 
      title: "Interested", 
      value: statusCounts.INTERESTED, 
      icon: "⭐",
      bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Shown interest"
    },
    { 
      title: "Not Interested", 
      value: statusCounts.NOT_INTERESTED, 
      icon: "❌",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      description: "Declined offers"
    },
    { 
      title: "Enrolled", 
      value: statusCounts.ENROLLED, 
      icon: "🎓",
      bgGradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      description: "Successfully enrolled"
    }
  ];

  // Card component to avoid repetition
  const StatCard = ({ card }) => (
    <div 
      className="card border-0 shadow-sm h-100"
      style={{
        background: card.bgGradient,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer"
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
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 
              className="text-uppercase mb-2 fw-semibold" 
              style={{ 
                color: "#fff", 
                opacity: 0.9, 
                fontSize: "0.75rem", 
                letterSpacing: "0.5px" 
              }}
            >
              {card.title}
            </h6>
            <h3 
              className="fw-bold mb-1" 
              style={{ color: "#fff", fontSize: "2rem" }}
            >
              {card.value}
            </h3>
            <p 
              className="mb-0 fw-semibold" 
              style={{ color: "#fff", opacity: 0.9, fontSize: "0.75rem" }}
            >
              {totalLeads > 0 ? ((card.value / totalLeads) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
          <div style={{ fontSize: "2rem", opacity: 0.8 }}>
            {card.icon}
          </div>
        </div>
        <div className="mt-2">
          <small style={{ color: "#fff", opacity: 0.8 }}>
            {card.description}
          </small>
        </div>
      </div>
    </div>
  );

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

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
              ) : (
                <>
                  {/* Main Stats Cards Row - Same as LeadsList */}
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3 text-dark">📊 Lead Status Overview</h5>
                    <div className="row g-3">
                      {statsCards.map((card, index) => (
                        <div key={index} className="col-xl-2 col-lg-4 col-md-6">
                          <StatCard card={card} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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

export default SalesDashboard;