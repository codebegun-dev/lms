import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * LeadsList.jsx
 * - Uses backend pagination via: GET /api/saleCourse/student/students?page=#
 * - Also fetches full list (GET /api/saleCourse/student) to compute overall counts for the cards.
 * - If any filter/search is active, shows client-side filtered results (no pagination).
 * - Edit / Update / Delete logic retained as-is.
 */

function LeadsList() {
  const [paginatedLeads, setPaginatedLeads] = useState([]); // data from current page
  const [allLeads, setAllLeads] = useState([]); // used for counts and client-side filtering
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);

  // Filters / search
  const [searchEmail, setSearchEmail] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Edit modal
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize] = useState(30); // same default used on backend
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  const BASE_URL = "http://localhost:8080/api/saleCourse/student";

  // on mount: fetch first page, all leads (for counts/filters), and courses
  useEffect(() => {
    fetchPage(page);
    fetchAllLeadsForCounts();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch page when page changes (only when no filters active)
  useEffect(() => {
    if (!isFilteringActive()) {
      fetchPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Helper: are any filters/search active?
  const isFilteringActive = () => {
    return (
      (searchEmail && searchEmail.trim() !== "") ||
      (filterYear && filterYear.trim() !== "") ||
      (filterStatus && filterStatus.trim() !== "")
    );
  };

  // Fetch paginated page from backend. Robust parsing of response map.
  const fetchPage = async (pageNumber = 0) => {
    try {
      setLoadingPage(true);
      setApiError("");
      const res = await axios.get(`${BASE_URL}/students?page=${pageNumber}`);

      // backend may return a Map with keys like: content, students, items, data, totalElements, totalPages
      const body = res.data || {};

      // try several possible shapes
      const content =
        body.content ||
        body.students ||
        body.items ||
        body.data ||
        body.studentsList ||
        body.page ||
        body.result ||
        [];

      // If API returned the full array directly (some versions), handle that
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

  // Fetch all leads (non-paginated) to compute counts and to allow client-side filtering.
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

  // GET courses for dropdowns (unchanged)
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses/all");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  // Handle input change in modal
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

  // PUT update (unchanged)
  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      await axios.put(`${BASE_URL}/${selectedLead.studentId}`, formData);
      alert("Lead updated successfully!");
      setSelectedLead(null);
      // refresh both page and all-leads
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

  // DELETE lead (unchanged)
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      alert("Lead deleted successfully!");
      // refresh both
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

  // Status badge classes (unchanged)
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

  // Compute counts (from allLeads). If allLeads empty, fallback to totals from paginated response
  const totalLeadsCount = allLeads.length || totalElements;
  const countByStatus = (status) =>
    allLeads.filter((l) => (l.status || "").toString() === status).length;

  const initialCount = countByStatus("INITIAL");
  const contactedCount = countByStatus("Contacted");
  const interestedCount = countByStatus("Interested");
  const notInterestedCount = countByStatus("Not Interested");

  // Filtering logic: When filters/search present, filter allLeads and display those. Otherwise display paginatedLeads.
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

  // Unique years from allLeads for filter dropdown
  const uniqueYears = [...new Set(allLeads.map((lead) => lead.passedOutYear).filter(Boolean))].sort();

  // Clear filters
  const clearFilters = () => {
    setSearchEmail("");
    setFilterYear("");
    setFilterStatus("");
    // when cleared, re-load first page
    setPage(0);
    fetchPage(0);
  };

  // Pagination controls (robust)
  const goToPage = (p) => {
    if (p < 0) p = 0;
    if (totalPages && p >= totalPages) p = totalPages - 1;
    setPage(p);
  };

  // Render
  return (
    <div className="container-fluid mt-4">
      {/* Header + Cards */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Leads Management</h3>
          <p className="text-muted mb-0 small">Manage and track all your student leads</p>
        </div>

        <div className="d-flex gap-3 align-items-center">
          {/* Cards */}
          <div className="card shadow-sm text-center p-3">
            <div className="small text-muted">Total Leads</div>
            <div className="h5 fw-bold mb-0">{totalLeadsCount}</div>
          </div>

          <div className="card shadow-sm text-center p-3">
            <div className="small text-muted">INITIAL</div>
            <div className="h5 fw-bold mb-0">{initialCount}</div>
          </div>

          <div className="card shadow-sm text-center p-3">
            <div className="small text-muted">Contacted</div>
            <div className="h5 fw-bold mb-0">{contactedCount}</div>
          </div>

          <div className="card shadow-sm text-center p-3">
            <div className="small text-muted">Interested</div>
            <div className="h5 fw-bold mb-0">{interestedCount}</div>
          </div>

          <div className="card shadow-sm text-center p-3">
            <div className="small text-muted">Not Interested</div>
            <div className="h5 fw-bold mb-0">{notInterestedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Filters</h6>
            {isFilteringActive() && (
              <button className="btn btn-sm btn-outline-danger" onClick={clearFilters}>
                Clear Filters
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

      {/* Loading / Error states */}
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

      {apiError && (
        <div className="alert alert-danger shadow-sm mb-3" role="alert">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* No results */}
      {!loading && filteredLeads.length === 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-body text-center py-5">
            <h5 className="fw-semibold mb-2">No leads found</h5>
            <p className="text-muted mb-0">
              {isFilteringActive() ? "Try adjusting your filters" : "Start by adding new leads"}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && filteredLeads.length > 0 && (
        <div className="card shadow-sm border-0 mb-3">
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
                    <td className="fw-medium">{lead.studentId}</td>
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
                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(lead)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteLead(lead.studentId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination controls - only show when not filtering */}
      {!isFilteringActive() && totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
            {" · "}Total records: <strong>{totalElements}</strong>
          </div>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(page - 1)}>Previous</button>
              </li>

              {/* show limited page numbers (for big totals) */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                // show first, last, current +/- 2
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
                // show ellipsis placeholder once where needed
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

      {/* Edit modal */}
      {selectedLead && (
        <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <div>
                  <h5 className="modal-title fw-bold mb-0">Edit Lead Information</h5>
                  <small className="opacity-75">Update lead details and status</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedLead(null)}></button>
              </div>

              <div className="modal-body">
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
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeadsList;
