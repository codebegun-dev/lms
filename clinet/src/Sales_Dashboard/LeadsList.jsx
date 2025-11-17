import React, { useEffect, useState } from "react";
import axios from "axios";

function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);

  // Filters
  const [searchEmail, setSearchEmail] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // For editing
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

  const BASE_URL = "http://localhost:8080/api/saleCourse/student";

  // GET all leads
  useEffect(() => {
    fetchLeads();
    fetchCourses();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL);
      setLeads(res.data);
    } catch (err) {
      setApiError("Failed to load leads!");
    } finally {
      setLoading(false);
    }
  };

  // GET all courses for dropdown
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses/all");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  // Handle input change in modal form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal and populate fields
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

  // PUT update
  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/${selectedLead.studentId}`, formData);
      alert("Lead updated successfully!");
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lead");
    }
  };

  // DELETE lead
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Lead deleted successfully!");
      fetchLeads();
    } catch (err) {
      alert("Failed to delete lead");
    }
  };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter((lead) => {
    const matchesEmail = searchEmail.trim() === "" || 
      (lead.email && lead.email.toLowerCase().includes(searchEmail.toLowerCase().trim()));
    
    const matchesYear = filterYear === "" || 
      (lead.passedOutYear && lead.passedOutYear.toString() === filterYear);
    
    const matchesStatus = filterStatus === "" || 
      (lead.status && lead.status === filterStatus);
    
    return matchesEmail && matchesYear && matchesStatus;
  });

  // Get unique years for filter dropdown
  const uniqueYears = [...new Set(leads.map(lead => lead.passedOutYear).filter(Boolean))].sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchEmail("");
    setFilterYear("");
    setFilterStatus("");
  };

  // Status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "New": return "bg-primary";
      case "Contacted": return "bg-info";
      case "Interested": return "bg-success";
      case "Not Interested": return "bg-danger";
      case "Enrolled": return "bg-dark";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Leads Management</h3>
          <p className="text-muted mb-0 small">Manage and track all your student leads</p>
        </div>
        <span className="badge bg-primary rounded-pill px-3 py-2">
          Total: {filteredLeads.length}
        </span>
      </div>

      {/* Filters Section */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Filters</h6>
            {(searchEmail || filterYear || filterStatus) && (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="row g-3">
            {/* Email Search */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">
                Search by Email
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            {/* Year Filter */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">
                Passed Out Year
              </label>
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

            {/* Status Filter */}
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">
                Status
              </label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Enrolled">Enrolled</option>
                <option value="INITIAL">INITIAL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0 text-muted">Loading leads...</p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {!loading && filteredLeads.length === 0 && (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <h5 className="fw-semibold mb-2">No leads found</h5>
            <p className="text-muted mb-0">
              {searchEmail || filterYear || filterStatus ? "Try adjusting your filters" : "Start by adding new leads"}
            </p>
          </div>
        </div>
      )}

      {!loading && filteredLeads.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light">
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
                {filteredLeads.map((lead) => (
                  <tr key={lead.studentId}>
                    <td className="fw-medium">#{lead.studentId}</td>
                    <td className="fw-semibold">{lead.studentName}</td>
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
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(lead)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteLead(lead.studentId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedLead && (
        <div
          className="modal show fade"
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg">

              <div className="modal-header bg-primary text-white">
                <div>
                  <h5 className="modal-title fw-bold mb-0">Edit Lead Information</h5>
                  <small className="opacity-75">Update lead details and status</small>
                </div>
                <button 
                  type="button"
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedLead(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      name="studentName"
                      className="form-control"
                      value={formData.studentName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Passed Out Year</label>
                    <input
                      type="text"
                      name="passedOutYear"
                      className="form-control"
                      value={formData.passedOutYear}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      className="form-control"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Course</label>
                    <select
                      name="courseId"
                      className="form-select"
                      value={formData.courseId}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="INITIAL">INITIAL</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedLead(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeadsList;