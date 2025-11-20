import React, { useEffect, useState } from "react";
import axios from "axios";

function LeadsList() {
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);
  const [counselors, setCounselors] = useState([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterAssignedTo, setFilterAssignedTo] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterQualification, setFilterQualification] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    gender: "",
    passedOutYear: "",
    qualification: "",
    courseId: "",
    status: "",
    college: "",
    city: "",
    source: "",
    campaign: "",
    assignedTo: ""
  });

  const [page, setPage] = useState(0);
  const [pageSize] = useState(30);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  const BASE_URL = "http://localhost:8080/api/saleCourse/student";
  const COUNSELOR_URL = "http://localhost:8080/api/counselors";

  useEffect(() => {
    fetchPage(page);
    fetchAllLeadsForCounts();
    fetchCourses();
    fetchCounselors();
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
      (filterStatus && filterStatus.trim() !== "") ||
      (filterName && filterName.trim() !== "") ||
      (filterPhone && filterPhone.trim() !== "") ||
      (filterAssignedTo && filterAssignedTo.trim() !== "") ||
      (filterGender && filterGender.trim() !== "") ||
      (filterQualification && filterQualification.trim() !== "") ||
      (filterCity && filterCity.trim() !== "") ||
      (filterCourse && filterCourse.trim() !== "")
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

      // Add assignedTo field with default "Un-Assigned" for all leads and convert INITIAL to NEW
      const leadsWithAssigned = leadsArray.map(lead => ({
        ...lead,
        assignedTo: lead.assignedTo || "Un-Assigned",
        status: lead.status === "INITIAL" ? "NEW" : lead.status
      }));

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

      setPaginatedLeads(leadsWithAssigned || []);
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
      
      // Add assignedTo field with default "Un-Assigned" for all leads and convert INITIAL to NEW
      const leadsWithAssigned = Array.isArray(data) 
        ? data.map(lead => ({
            ...lead,
            assignedTo: lead.assignedTo || "Un-Assigned",
            status: lead.status === "INITIAL" ? "NEW" : lead.status
          }))
        : [];
      
      setAllLeads(leadsWithAssigned);
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

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(COUNSELOR_URL);
      setCounselors(res.data || []);
    } catch (err) {
      console.error("Failed to load counselors");
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
      courseId: lead.courseManagement?.courseId || lead.courseId || "",
      status: lead.status === "INITIAL" ? "NEW" : lead.status || "NEW",
      college: lead.college || "",
      city: lead.city || "",
      source: lead.source || "",
      campaign: lead.campaign || "",
      assignedTo: lead.assignedTo || "Un-Assigned"
    });
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      // Convert NEW back to INITIAL for API if needed
      const updateData = {
        ...formData,
        status: formData.status === "NEW" ? "INITIAL" : formData.status
      };
      
      await axios.put(`${BASE_URL}/${selectedLead.studentId}`, updateData);
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

  // Lead Selection Functions
  const toggleLeadSelection = (leadId) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    const currentLeads = isFilteringActive() ? filteredLeads : paginatedLeads;
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set());
    } else {
      const allIds = new Set(currentLeads.map(lead => lead.studentId));
      setSelectedLeads(allIds);
    }
  };

  const isLeadSelected = (leadId) => {
    return selectedLeads.has(leadId);
  };

  // Assignment Functions
  const handleAssignLeads = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead to assign.");
      return;
    }

    if (!selectedCounselor) {
      alert("Please select a counselor.");
      return;
    }

    // Check if selected counselor is active
    const counselor = counselors.find(c => c.name === selectedCounselor);
    if (counselor && counselor.status === "Inactive") {
      alert("Cannot assign leads to an inactive counselor. Please select an active counselor.");
      return;
    }

    if (!window.confirm(`Assign ${selectedLeads.size} lead(s) to ${selectedCounselor}?`)) {
      return;
    }

    try {
      const assignmentPromises = Array.from(selectedLeads).map(leadId =>
        axios.put(`${BASE_URL}/${leadId}/assign`, { assignedTo: selectedCounselor })
      );

      await Promise.all(assignmentPromises);
      
      alert(`Successfully assigned ${selectedLeads.size} lead(s) to ${selectedCounselor}!`);
      
      // Refresh data
      setSelectedLeads(new Set());
      setShowAssignModal(false);
      setSelectedCounselor("");
      
      if (isFilteringActive()) {
        await fetchAllLeadsForCounts();
      } else {
        await fetchPage(page);
      }
    } catch (err) {
      alert("Failed to assign leads: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "NEW":
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

  const getAssignedBadgeClass = (assignedTo) => {
    return assignedTo === "Un-Assigned" ? "bg-warning text-dark" : "bg-success";
  };

  const getCounselorStatusBadge = (counselor) => {
    return counselor.status === "Active" 
      ? "badge bg-success" 
      : "badge bg-danger";
  };

  const totalLeadsCount = allLeads.length || totalElements;
  const countByStatus = (status) =>
    allLeads.filter((l) => (l.status || "").toString() === status).length;

  const newCount = countByStatus("NEW");
  const contactedCount = countByStatus("Contacted");
  const interestedCount = countByStatus("Interested");
  const notInterestedCount = countByStatus("Not Interested");
  const enrolledCount = countByStatus("Enrolled");

  // Helper function to get course name from lead
  const getLeadCourseName = (lead) => {
    if (lead.courseManagement?.courseName) {
      return lead.courseManagement.courseName;
    }
    // If courseManagement doesn't exist, try to find course name from courses list
    if (lead.courseId && courses.length > 0) {
      const course = courses.find(c => c.courseId === lead.courseId);
      return course ? course.courseName : "N/A";
    }
    return "N/A";
  };

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

        const matchesName =
          filterName.trim() === "" ||
          (lead.studentName && lead.studentName.toLowerCase().includes(filterName.toLowerCase().trim()));

        const matchesPhone =
          filterPhone.trim() === "" ||
          (lead.phone && lead.phone.includes(filterPhone.trim()));

        const matchesAssignedTo =
          filterAssignedTo === "" || 
          (filterAssignedTo === "Assigned" && lead.assignedTo !== "Un-Assigned") ||
          (filterAssignedTo === "Un-Assigned" && lead.assignedTo === "Un-Assigned") ||
          (lead.assignedTo && lead.assignedTo === filterAssignedTo);

        const matchesGender =
          filterGender === "" || (lead.gender && lead.gender === filterGender);

        const matchesQualification =
          filterQualification.trim() === "" ||
          (lead.qualification && lead.qualification.toLowerCase().includes(filterQualification.toLowerCase().trim()));

        const matchesCity =
          filterCity.trim() === "" ||
          (lead.city && lead.city.toLowerCase().includes(filterCity.toLowerCase().trim()));

        const matchesCourse =
          filterCourse === "" ||
          getLeadCourseName(lead) === filterCourse;

        return matchesEmail && matchesYear && matchesStatus && matchesName && 
               matchesPhone && matchesAssignedTo && matchesGender && 
               matchesQualification && matchesCity && matchesCourse;
      })
    : paginatedLeads
  ) || [];

  const uniqueYears = [...new Set(allLeads.map((lead) => lead.passedOutYear).filter(Boolean))].sort();
  const uniqueGenders = [...new Set(allLeads.map((lead) => lead.gender).filter(Boolean))];
  const uniqueQualifications = [...new Set(allLeads.map((lead) => lead.qualification).filter(Boolean))].sort();
  const uniqueCities = [...new Set(allLeads.map((lead) => lead.city).filter(Boolean))].sort();
  
  // Get unique course names for filter dropdown
  const uniqueCourses = [...new Set(allLeads.map(lead => getLeadCourseName(lead)).filter(name => name !== "N/A"))].sort();
  
  const uniqueAssignedTo = [...new Set(allLeads.map((lead) => lead.assignedTo).filter(Boolean))].sort();

  const clearFilters = () => {
    setSearchEmail("");
    setFilterYear("");
    setFilterStatus("");
    setFilterName("");
    setFilterPhone("");
    setFilterAssignedTo("");
    setFilterGender("");
    setFilterQualification("");
    setFilterCity("");
    setFilterCourse("");
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
      title: "New", 
      value: newCount, 
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
    },
    { 
      title: "Enrolled", 
      value: enrolledCount, 
      icon: "🎓",
      bgGradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
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
                  <div className="d-flex justify-content-between align-items-center">
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
            <h5 className="fw-bold mb-0 text-dark">🔍 Advanced Filters</h5>
            {isFilteringActive() && (
              <button className="btn btn-sm btn-danger" onClick={clearFilters}>
                ✕ Clear All Filters
              </button>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Search by Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Search by Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter phone..."
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Search by Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Assigned To</label>
              <select
                className="form-select"
                value={filterAssignedTo}
                onChange={(e) => setFilterAssignedTo(e.target.value)}
              >
                <option value="">All Assignments</option>
                <option value="Un-Assigned">Un-Assigned</option>
                <option value="Assigned">Assigned</option>
                {uniqueAssignedTo.filter(assigned => assigned !== "Un-Assigned").map((assigned) => (
                  <option key={assigned} value={assigned}>{assigned}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Gender</label>
              <select
                className="form-select"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">All Genders</option>
                {uniqueGenders.map((gender) => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Qualification</label>
              <select
                className="form-select"
                value={filterQualification}
                onChange={(e) => setFilterQualification(e.target.value)}
              >
                <option value="">All Qualifications</option>
                {uniqueQualifications.map((qualification) => (
                  <option key={qualification} value={qualification}>{qualification}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">City</label>
              <select
                className="form-select"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Course</label>
              <select
                className="form-select"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
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

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Enrolled">Enrolled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Leads Card - POSITIONED BETWEEN FILTERS AND TABLE */}
      {selectedLeads.size > 0 && (
        <div className="card shadow-sm mb-3 border-warning">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold text-warning">
                  🎯 {selectedLeads.size} lead(s) selected
                </span>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-success"
                  onClick={() => setShowAssignModal(true)}
                >
                  👥 Assign to Counselor
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedLeads(new Set())}
                >
                  ❌ Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Table - ONLY SHOWING SPECIFIED COLUMNS */}
      {!loading && filteredLeads.length > 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">📋 Leads List ({filteredLeads.length} records)</h5>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                  id="selectAll"
                />
                <label className="form-check-label small fw-semibold" htmlFor="selectAll">
                  Select All
                </label>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                <tr>
                  <th className="fw-semibold" style={{ width: '40px' }}>#</th>
                  <th className="fw-semibold">ID</th>
                  <th className="fw-semibold">Name</th>
                  <th className="fw-semibold">Phone</th>
                  <th className="fw-semibold">Email</th>
                  <th className="fw-semibold">Course</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold">Assigned To</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr key={lead.studentId} style={{ background: idx % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isLeadSelected(lead.studentId)}
                        onChange={() => toggleLeadSelection(lead.studentId)}
                      />
                    </td>
                    <td className="fw-medium">{lead.studentId}</td>
                    <td className="fw-semibold text-dark">{lead.studentName}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email || <span className="text-muted">-</span>}</td>
                    <td>{getLeadCourseName(lead)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.status)} rounded-pill px-3 py-2`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getAssignedBadgeClass(lead.assignedTo)} rounded-pill px-3 py-2`}>
                        {lead.assignedTo}
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

      {/* Assign to Counselor Modal */}
      {showAssignModal && (
        <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "#fff" }}>
                <h5 className="modal-title fw-bold mb-0">👥 Assign Leads to Counselor</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCounselor("");
                }}></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-4">
                  <p className="fw-semibold">
                    Assigning <span className="text-primary">{selectedLeads.size}</span> selected lead(s) to:
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Counselor</label>
                  <select
                    className="form-select"
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                  >
                    <option value="">-- Choose a Counselor --</option>
                    {counselors
                      .filter(counselor => counselor.status === "Active")
                      .map((counselor) => (
                        <option key={counselor.id} value={counselor.name}>
                          {counselor.name} ({counselor.email}) - 📞 {counselor.phone}
                        </option>
                      ))}
                  </select>
                  <div className="form-text">
                    Only active counselors are shown in the list.
                  </div>
                </div>

                {counselors.filter(c => c.status === "Active").length === 0 && (
                  <div className="alert alert-warning">
                    <strong>⚠️ No Active Counselors</strong><br />
                    Please add active counselors before assigning leads.
                  </div>
                )}

                <div className="mt-4">
                  <h6 className="fw-semibold mb-3">Available Counselors:</h6>
                  <div className="row g-2">
                    {counselors.map((counselor) => (
                      <div key={counselor.id} className="col-12">
                        <div className={`card border ${counselor.status === "Active" ? "border-success" : "border-danger"}`}>
                          <div className="card-body py-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="fw-semibold">{counselor.name}</span>
                                <span className={`ms-2 ${getCounselorStatusBadge(counselor)}`}>
                                  {counselor.status}
                                </span>
                              </div>
                              <small className="text-muted">{counselor.email}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedCounselor("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleAssignLeads}
                  disabled={!selectedCounselor || counselors.filter(c => c.status === "Active").length === 0}
                >
                  ✅ Assign Leads
                </button>
              </div>
            </div>
          </div>
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
                    <label className="form-label fw-semibold">College</label>
                    <input type="text" name="college" className="form-control" value={formData.college} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City</label>
                    <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Source</label>
                    <select name="source" className="form-select" value={formData.source} onChange={handleChange}>
                      <option value="">Select Source</option>
                      <option value="Instagram">Instagram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Refer">Refer</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Campaign</label>
                    <select name="campaign" className="form-select" value={formData.campaign} onChange={handleChange}>
                      <option value="">Select Campaign</option>
                      <option value="Campaign 1">Campaign 1</option>
                      <option value="Campaign 2">Campaign 2</option>
                      <option value="Campaign 3">Campaign 3</option>
                    </select>
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
                      <option value="NEW">NEW</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Enrolled">Enrolled</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Assigned To</label>
                    <select 
                      name="assignedTo" 
                      className="form-select" 
                      value={formData.assignedTo} 
                      onChange={handleChange}
                    >
                      <option value="Un-Assigned">Un-Assigned</option>
                      {counselors
                        .filter(counselor => counselor.status === "Active")
                        .map((counselor) => (
                          <option key={counselor.id} value={counselor.name}>
                            {counselor.name}
                          </option>
                        ))}
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