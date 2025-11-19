import React, { useEffect, useState } from "react";
import axios from "axios";

function LeadsList() {
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    gender: "",
    passedOutYear: "",
    qualification: "",
    courseId: "",
    status: "",
  });

  const [page, setPage] = useState(0);
  const [pageSize] = useState(30);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  const BASE_URL = "http://localhost:8080/api/saleCourse/student";

  useEffect(() => {
    fetchPage(page);
    fetchAllLeadsForCounts();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!isFilteringActive()) {
      fetchPage(page);
    }
  }, [page]);

  const isFilteringActive = () => {
    return (
      (searchEmail && searchEmail.trim() !== "") ||
      (filterYear && filterYear.trim() !== "") ||
      (filterStatus && filterStatus.trim() !== "")
    );
  };

  const fetchPage = async (pageNumber = 0) => {
    try {
      setLoadingPage(true);
      setApiError("");
      const res = await axios.get(`${BASE_URL}/students?page=${pageNumber}`);
      const body = res.data || {};

      const content =
        body.content ||
        body.students ||
        body.items ||
        body.data ||
        body.studentsList ||
        body.page ||
        body.result ||
        [];

      const leadsArray = Array.isArray(content) && content.length > 0 ? content :
        Array.isArray(body) ? body : content;

      const total =
        typeof body.totalElements === "number"
          ? body.totalElements
          : typeof body.total === "number"
          ? body.total
          : typeof body.totalCount === "number"
          ? body.totalCount
          : Array.isArray(body) ? body.length : leadsArray.length;

      const pages =
        typeof body.totalPages === "number"
          ? body.totalPages
          : typeof body.pages === "number"
          ? body.pages
          : Math.ceil(total / pageSize);

      setPaginatedLeads(leadsArray || []);
      setTotalElements(total || 0);
      setTotalPages(pages || 0);
      setLoading(false);
    } catch (err) {
      console.error("fetchPage error", err);
      setApiError("Failed to load leads (page)!");
      setPaginatedLeads([]);
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchAllLeadsForCounts = async () => {
    try {
      setLoading(true);
      setApiError("");
      const res = await axios.get(BASE_URL);
      const data = res.data || [];
      setAllLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchAllLeadsForCounts error", err);
      setApiError("Failed to load leads!");
      setAllLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses/all");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      studentName: lead.studentName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      gender: lead.gender || "",
      passedOutYear: lead.passedOutYear || "",
      qualification: lead.qualification || "",
      courseId: lead.courseManagement?.courseId || "",
      status: lead.status || "INITIAL",
    });
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      await axios.put(`${BASE_URL}/${selectedLead.studentId}`, formData);
      alert("Lead updated successfully!");
      setSelectedLead(null);
      if (isFilteringActive()) {
        await fetchAllLeadsForCounts();
      } else {
        await fetchPage(page);
      }
      await fetchAllLeadsForCounts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lead");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Lead deleted successfully!");
      if (isFilteringActive()) {
        await fetchAllLeadsForCounts();
      } else {
        await fetchPage(page);
      }
      await fetchAllLeadsForCounts();
    } catch (err) {
      alert("Failed to delete lead");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "New":
        return "bg-primary";
      case "Contacted":
        return "bg-info";
      case "Interested":
        return "bg-success";
      case "Not Interested":
        return "bg-danger";
      case "Enrolled":
        return "bg-dark";
      default:
        return "bg-secondary";
    }
  };

  const totalLeadsCount = allLeads.length || totalElements;
  const countByStatus = (status) =>
    allLeads.filter((l) => (l.status || "").toString() === status).length;

  const initialCount = countByStatus("INITIAL");
  const contactedCount = countByStatus("Contacted");
  const interestedCount = countByStatus("Interested");
  const notInterestedCount = countByStatus("Not Interested");

  const filteredLeads = (isFilteringActive()
    ? allLeads.filter((lead) => {
        const matchesEmail =
          searchEmail.trim() === "" ||
          (lead.email && lead.email.toLowerCase().includes(searchEmail.toLowerCase().trim()));

        const matchesYear =
          filterYear === "" ||
          (lead.passedOutYear && lead.passedOutYear.toString() === filterYear);

        const matchesStatus =
          filterStatus === "" || (lead.status && lead.status === filterStatus);

        return matchesEmail && matchesYear && matchesStatus;
      })
    : paginatedLeads
  ) || [];

  const uniqueYears = [...new Set(allLeads.map((lead) => lead.passedOutYear).filter(Boolean))].sort();

  const clearFilters = () => {
    setSearchEmail("");
    setFilterYear("");
    setFilterStatus("");
    setPage(0);
    fetchPage(0);
  };

  const goToPage = (p) => {
    if (p < 0) p = 0;
    if (totalPages && p >= totalPages) p = totalPages - 1;
    setPage(p);
  };

  const statsCards = [
    { 
      title: "Total Leads", 
      value: totalLeadsCount, 
      icon: "📊",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    { 
      title: "Initial", 
      value: initialCount, 
      icon: "🆕",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    { 
      title: "Contacted", 
      value: contactedCount, 
      icon: "📞",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    { 
      title: "Interested", 
      value: interestedCount, 
      icon: "⭐",
      bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    { 
      title: "Not Interested", 
      value: notInterestedCount, 
      icon: "❌",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ];

  return (
    <div className="container-fluid p-4" style={{ background: "linear-gradient(180deg, #f8f9fc 0%, #eef2f7 100%)", minHeight: "100vh" }}>
      
      {/* Stats Cards Row */}
      <div className="mb-4">
        <div className="row g-3">
          {statsCards.map((card, index) => (
            <div key={index} className="col">
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
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-uppercase mb-2 fw-semibold" style={{ color: "#fff", opacity: 0.9, fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                        {card.title}
                      </h6>
                      <h3 className="fw-bold mb-1" style={{ color: "#fff", fontSize: "2rem" }}>
                        {card.value}
                      </h3>
                      <p className="mb-0 fw-semibold" style={{ color: "#fff", opacity: 0.9, fontSize: "0.75rem" }}>
                        {totalLeadsCount > 0 ? ((card.value / totalLeadsCount) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div style={{ fontSize: "2rem", opacity: 0.8 }}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-dark">🔍 Filters</h5>
            {isFilteringActive() && (
              <button className="btn btn-sm btn-danger" onClick={clearFilters}>
                ✕ Clear Filters
              </button>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Search by Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Passed Out Year</label>
              <select
                className="form-select"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="INITIAL">INITIAL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(loading || loadingPage) && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0 text-muted">Loading leads...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {apiError && (
        <div className="alert alert-danger shadow-sm mb-3" role="alert">
          <strong>⚠️ Error:</strong> {apiError}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredLeads.length === 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
            <h5 className="fw-semibold mb-2 mt-3">No leads found</h5>
            <p className="text-muted mb-0">
              {isFilteringActive() ? "Try adjusting your filters" : "Start by adding new leads"}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && filteredLeads.length > 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-bold text-dark">📋 Leads List</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                <tr>
                  <th className="fw-semibold">ID</th>
                  <th className="fw-semibold">Name</th>
                  <th className="fw-semibold">Phone</th>
                  <th className="fw-semibold">Email</th>
                  <th className="fw-semibold">Gender</th>
                  <th className="fw-semibold">Year</th>
                  <th className="fw-semibold">Qualification</th>
                  <th className="fw-semibold">Course</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr key={lead.studentId} style={{ background: idx % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                    <td className="fw-medium">{lead.studentId}</td>
                    <td className="fw-semibold text-dark">{lead.studentName}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email || <span className="text-muted">-</span>}</td>
                    <td>{lead.gender || <span className="text-muted">-</span>}</td>
                    <td>{lead.passedOutYear || <span className="text-muted">-</span>}</td>
                    <td>{lead.qualification || <span className="text-muted">-</span>}</td>
                    <td>{lead.courseManagement?.courseName || <span className="text-muted">N/A</span>}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.status)} rounded-pill px-3 py-2`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(lead)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteLead(lead.studentId)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isFilteringActive() && totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing page <strong className="text-dark">{page + 1}</strong> of <strong className="text-dark">{totalPages}</strong>
            {" · "}Total records: <strong className="text-dark">{totalElements}</strong>
          </div>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(page - 1)}>Previous</button>
              </li>

              {Array.from({ length: totalPages }).map((_, idx) => {
                if (
                  idx === 0 ||
                  idx === totalPages - 1 ||
                  (idx >= page - 2 && idx <= page + 2)
                ) {
                  return (
                    <li key={idx} className={`page-item ${idx === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(idx)}>{idx + 1}</button>
                    </li>
                  );
                }
                const shouldShowLeftEllipsis = idx === 1 && page > 3;
                const shouldShowRightEllipsis = idx === totalPages - 2 && page < totalPages - 4;
                if (shouldShowLeftEllipsis || shouldShowRightEllipsis) {
                  return (
                    <li key={`dots-${idx}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              })}

              <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(page + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Edit Modal */}
      {selectedLead && (
        <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                <div>
                  <h5 className="modal-title fw-bold mb-0">✏️ Edit Lead Information</h5>
                  <small className="opacity-75">Update lead details and status</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedLead(null)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input type="text" name="studentName" className="form-control" value={formData.studentName} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Passed Out Year</label>
                    <input type="text" name="passedOutYear" className="form-control" value={formData.passedOutYear} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Qualification</label>
                    <input type="text" name="qualification" className="form-control" value={formData.qualification} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Course</label>
                    <select name="courseId" className="form-select" value={formData.courseId} onChange={handleChange}>
                      <option value="">-- Select Course --</option>
                      {courses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                      <option value="">Select Status</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="INITIAL">INITIAL</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedLead(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>💾 Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeadsList;