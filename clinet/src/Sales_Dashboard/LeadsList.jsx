import React, { useEffect, useState } from "react";
import axios from "axios";

function LeadsList() {
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [sources, setSources] = useState([]); // Added for sources API
  const [campaigns, setCampaigns] = useState([]); // Added for campaigns API
  const [allUsers, setAllUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

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
  const [filterSource, setFilterSource] = useState(""); // Added filter for source
  const [filterCampaign, setFilterCampaign] = useState(""); // Added filter for campaign

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [assigning, setAssigning] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLead, setViewingLead] = useState(null);
  
  const [formData, setFormData] = useState({
    leadName: "",
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
    assignedTo: "",
    notes: "",
    reminderTime: ""
  });

  const [page, setPage] = useState(0);
  const [pageSize] = useState(14);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [backendStatusCounts, setBackendStatusCounts] = useState({});

  const BASE_URL = "http://localhost:8080/api/saleCourse/leads";
  const COUNSELOR_URL = "http://localhost:8080/api/user/assignable-users";
  const USERS_URL = "http://localhost:8080/api/user/all";
  const SOURCES_URL = "http://localhost:8080/api/sources"; // Sources API endpoint
  const CAMPAIGNS_URL = "http://localhost:8080/api/campaigns"; // Campaigns API endpoint

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return '';
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting display date:', error, dateString);
      return 'Invalid date';
    }
  };

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

  const getLoggedInUserId = () => {
    const user = getLoggedInUser();
    return user ? user.userId : null;
  };

  const getCurrentUserName = () => {
    const user = getLoggedInUser();
    if (user) {
      return user.firstName || user.name || user.username || 'Current User';
    }
    return 'Current User';
  };

  const getLoggedInUserRole = () => {
    const user = getLoggedInUser();
    return user ? (user.role || user.roleName || '') : '';
  };

  const canAssignLeads = () => {
    return userRole === "MASTER_ADMIN" || userRole === "SALES_MANAGER";
  };

  const canEditLeads = () => {
    return userRole === "MASTER_ADMIN" || userRole === "SALES_MANAGER" || userRole === "SA_SALES";
  };

  useEffect(() => {
    setUserRole(getLoggedInUserRole());
    fetchPage(page);
    fetchAllLeadsForCounts();
    fetchCourses();
    fetchCounselors();
    fetchAllUsers();
    fetchSources(); // Fetch sources
    fetchCampaigns(); // Fetch campaigns
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
      (filterCourse && filterCourse.trim() !== "") ||
      (filterSource && filterSource.trim() !== "") || // Added source filter
      (filterCampaign && filterCampaign.trim() !== "") // Added campaign filter
    );
  };

  const fetchPage = async (pageNumber = 0) => {
    try {
      setLoadingPage(true);
      setApiError("");
      const loggedInUserId = getLoggedInUserId();
      if (!loggedInUserId) {
        setApiError("User not logged in. Please login again.");
        return;
      }
      const res = await axios.get(`${BASE_URL}?loggedInUserId=${loggedInUserId}&page=${pageNumber}`);
      const body = res.data || {};
      const content = body.leads || [];
      const total = body.totalLeads || 0;
      const pages = body.totalPages || 0;
      const currentPg = body.currentPage || 0;
      const statusCounts = body.statusCounts || {};
      const leadsArray = Array.isArray(content) ? content : [];
      setPaginatedLeads(leadsArray);
      setTotalElements(total);
      setTotalPages(pages);
      setCurrentPage(currentPg);
      setBackendStatusCounts(statusCounts);
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
      const loggedInUserId = getLoggedInUserId();
      if (!loggedInUserId) {
        setApiError("User not logged in. Please login again.");
        return;
      }
      const res = await axios.get(`${BASE_URL}?loggedInUserId=${loggedInUserId}`);
      const data = res.data || {};
      const leadsData = data.leads || [];
      const statusCounts = data.statusCounts || {};
      setAllLeads(Array.isArray(leadsData) ? leadsData : []);
      setBackendStatusCounts(statusCounts);
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
      console.log("Counselors API Response:", res.data);
      const transformedCounselors = (res.data || []).map(user => {
        let name = 'Unknown User';
        if (user.name) name = user.name;
        else if (user.username) name = user.username;
        else if (user.firstName || user.lastName) {
          name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        return {
          id: user.userId || user.id,
          name: name,
          email: user.email || 'No email',
          phone: user.phone || user.mobile || 'No phone',
          status: user.active !== false ? "Active" : "Inactive"
        };
      });
      console.log("Transformed Counselors:", transformedCounselors);
      setCounselors(transformedCounselors);
    } catch (err) {
      console.error("Failed to load counselors", err);
      setCounselors([]);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(USERS_URL);
      console.log("All Users API Response:", res.data);
      const transformedUsers = (res.data || []).map(user => ({
        id: user.userId || user.id,
        name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        email: user.email || 'No email',
        role: user.role || user.roleName || 'Unknown Role'
      }));
      console.log("Transformed Users:", transformedUsers);
      setAllUsers(transformedUsers);
    } catch (err) {
      console.error("Failed to load all users", err);
      setAllUsers([]);
    }
  };

  // Fetch sources from API
  const fetchSources = async () => {
    try {
      const res = await axios.get(SOURCES_URL);
      console.log("Sources API Response:", res.data);
      const transformedSources = (res.data || []).map(source => ({
        id: source.sourceId || source.id,
        name: source.sourceName || source.name || 'Unknown Source'
      }));
      console.log("Transformed Sources:", transformedSources);
      setSources(transformedSources);
    } catch (err) {
      console.error("Failed to load sources", err);
      setSources([]);
    }
  };

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(CAMPAIGNS_URL);
      console.log("Campaigns API Response:", res.data);
      const transformedCampaigns = (res.data || []).map(campaign => ({
        id: campaign.campaignId || campaign.id,
        name: campaign.campaignName || campaign.name || 'Unknown Campaign'
      }));
      console.log("Transformed Campaigns:", transformedCampaigns);
      setCampaigns(transformedCampaigns);
    } catch (err) {
      console.error("Failed to load campaigns", err);
      setCampaigns([]);
    }
  };

  const getUserNameById = (userId) => {
    if (!userId) return "";
    const user = allUsers.find(u => u.id.toString() === userId.toString());
    return user ? user.name : `User ${userId}`;
  };

  const getCounselorNameById = (counselorId) => {
    if (!counselorId) return "";
    const counselor = counselors.find(c => c.id.toString() === counselorId.toString());
    return counselor ? counselor.name : counselorId;
  };

  const getAssignedCounselorName = (lead) => {
    if (!lead.assignedTo || lead.assignedTo.trim() === "") {
      return "";
    }
    const counselorByName = counselors.find(c => c.name === lead.assignedTo);
    if (counselorByName) {
      return counselorByName.name;
    }
    const counselorById = counselors.find(c => c.id.toString() === lead.assignedTo.toString());
    if (counselorById) {
      return counselorById.name;
    }
    const convertedName = getCounselorNameById(lead.assignedTo);
    if (convertedName && convertedName !== lead.assignedTo) {
      return convertedName;
    }
    return lead.assignedTo;
  };

  const getAssignedByName = (lead) => {
    if (lead.assignedBy) {
      return getUserNameById(lead.assignedBy);
    }
    return getCurrentUserName();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleView = (lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      leadName: lead.leadName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      gender: lead.gender || "",
      passedOutYear: lead.passedOutYear || "",
      qualification: lead.qualification || "",
      courseId: lead.courseId || "",
      status: lead.status || "NEW",
      college: lead.college || "",
      city: lead.city || "",
      source: lead.source || "",
      campaign: lead.campaign || "",
      assignedTo: getAssignedCounselorName(lead) || "",
      notes: lead.notes || "",
      reminderTime: lead.reminderTime ? formatDateForInput(lead.reminderTime) : ""
    });
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      const loggedInUserId = getLoggedInUserId();
      if (!loggedInUserId) {
        alert("User not logged in. Please login again.");
        return;
      }

      let updateData = {
        ...formData,
        loggedInUserId: loggedInUserId
      };

      if (canAssignLeads() && formData.assignedTo && formData.assignedTo.trim() !== "") {
        const counselor = counselors.find(c => c.name === formData.assignedTo);
        if (counselor) {
          updateData.assignedTo = counselor.id;
        }
      } else {
        delete updateData.assignedTo;
      }

      const { assignedTo, ...dataToSend } = updateData;
      
      await axios.put(`${BASE_URL}/${selectedLead.leadId}`, dataToSend);
      
      alert("Lead updated successfully!");
      setSelectedLead(null);
      
      const updatedLead = {
        ...selectedLead,
        ...formData,
        assignedTo: canAssignLeads() ? formData.assignedTo : selectedLead.assignedTo,
      };
      
      setPaginatedLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.leadId === selectedLead.leadId 
            ? { ...lead, ...updatedLead }
            : lead
        )
      );
      
      setAllLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.leadId === selectedLead.leadId 
            ? { ...lead, ...updatedLead }
            : lead
        )
      );
      
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

  const toggleLeadSelection = (leadId) => {
    if (!canAssignLeads()) return;
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (!canAssignLeads()) return;
    const currentLeads = isFilteringActive() ? filteredLeads : paginatedLeads;
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set());
    } else {
      const allIds = new Set(currentLeads.map(lead => lead.leadId));
      setSelectedLeads(allIds);
    }
  };

  const isLeadSelected = (leadId) => {
    return selectedLeads.has(leadId);
  };

  const handleAssignLeads = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead to assign.");
      return;
    }

    if (!selectedCounselor) {
      alert("Please select a counselor.");
      return;
    }

    const counselor = counselors.find(c => c.name === selectedCounselor);
    if (counselor && counselor.status === "Inactive") {
      alert("Cannot assign leads to an inactive counselor. Please select an active counselor.");
      return;
    }

    if (!window.confirm(`Assign ${selectedLeads.size} lead(s) to ${selectedCounselor}?`)) {
      return;
    }

    try {
      setAssigning(true);
      const selectedLeadIds = Array.from(selectedLeads);
      const selectedCounselorObj = counselors.find(c => c.name === selectedCounselor);
      if (!selectedCounselorObj) {
        throw new Error("Selected counselor not found");
      }

      const loggedInUserId = getLoggedInUserId();
      if (!loggedInUserId) {
        throw new Error("User not logged in. Please login again.");
      }

      const previousPaginatedLeads = [...paginatedLeads];
      const previousAllLeads = [...allLeads];
      
      const currentUserName = getCurrentUserName();
      setPaginatedLeads(prevLeads => 
        prevLeads.map(lead => 
          selectedLeadIds.includes(lead.leadId) 
            ? { 
                ...lead, 
                assignedTo: selectedCounselor,
                assignedBy: currentUserName
              } 
            : lead
        )
      );
      
      setAllLeads(prevLeads => 
        prevLeads.map(lead => 
          selectedLeadIds.includes(lead.leadId) 
            ? { 
                ...lead, 
                assignedTo: selectedCounselor,
                assignedBy: currentUserName
              } 
            : lead
        )
      );

      console.log(`Assigning ${selectedLeadIds.length} leads to ${selectedCounselor} (ID: ${selectedCounselorObj.id}) by user ${loggedInUserId}`);
      
      const bulkAssignRequest = {
        leadIds: selectedLeadIds,
        assignedUserId: selectedCounselorObj.id
      };

      const response = await axios.post(`${BASE_URL}/assign/bulk?loggedInUserId=${loggedInUserId}`, bulkAssignRequest);
      
      console.log("Bulk assign response:", response.data);
      
      alert(`Successfully assigned ${selectedLeads.size} lead(s) to ${selectedCounselor}!`);
      
      setSelectedLeads(new Set());
      setShowAssignModal(false);
      setSelectedCounselor("");
      
      setTimeout(async () => {
        try {
          await Promise.all([
            fetchAllLeadsForCounts(),
            fetchPage(page)
          ]);
        } catch (refreshError) {
          console.error('Error refreshing data:', refreshError);
        }
      }, 500);
      
    } catch (err) {
      console.error("Bulk assignment error:", err);
      setPaginatedLeads(previousPaginatedLeads);
      setAllLeads(previousAllLeads);
      alert("Failed to assign leads: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "NEW":
        return "bg-primary";
      case "CONTACTED":
        return "bg-info";
      case "INTERESTED":
        return "bg-success";
      case "NOT_INTERESTED":
        return "bg-danger";
      case "ENROLLED":
        return "bg-dark";
      default:
        return "bg-secondary";
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "NEW":
        return "NEW";
      case "CONTACTED":
        return "CONTACTED";
      case "INTERESTED":
        return "INTERESTED";
      case "NOT_INTERESTED":
        return "NOT INTERESTED";
      case "ENROLLED":
        return "ENROLLED";
      default:
        return status;
    }
  };

  const getAssignedBadgeClass = (assignedTo) => {
    if (!assignedTo || assignedTo.trim() === "" || assignedTo === "Un-Assigned") {
      return "bg-warning text-dark";
    }
    return "bg-success";
  };

  const getAssignedDisplayText = (lead) => {
    const assignedName = getAssignedCounselorName(lead);
    if (!assignedName || assignedName.trim() === "") {
      return "Un-Assigned";
    }
    return assignedName;
  };

  const getCounselorStatusBadge = (counselor) => {
    return counselor.status === "Active" 
      ? "badge bg-success" 
      : "badge bg-danger";
  };

  const getStatusCounts = () => {
    if (Object.keys(backendStatusCounts).length > 0) {
      return {
        NEW: backendStatusCounts.NEW || 0,
        CONTACTED: backendStatusCounts.CONTACTED || 0,
        INTERESTED: backendStatusCounts.INTERESTED || 0,
        NOT_INTERESTED: backendStatusCounts.NOT_INTERESTED || 0,
        ENROLLED: backendStatusCounts.ENROLLED || 0
      };
    }
    
    const counts = {
      NEW: 0,
      CONTACTED: 0,
      INTERESTED: 0,
      NOT_INTERESTED: 0,
      ENROLLED: 0
    };
    
    allLeads.forEach(lead => {
      if (lead.status && counts.hasOwnProperty(lead.status)) {
        counts[lead.status]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalLeadsCount = totalElements || allLeads.length;

  const getLeadCourseName = (lead) => {
    if (lead.courseId && courses.length > 0) {
      const course = courses.find(c => c.courseId === lead.courseId);
      return course ? course.courseName : "N/A";
    }
    return "N/A";
  };

  const filteredLeads = (isFilteringActive()
    ? allLeads.filter((lead) => {
        const assignedName = getAssignedCounselorName(lead);
        
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
          (lead.leadName && lead.leadName.toLowerCase().includes(filterName.toLowerCase().trim()));

        const matchesPhone =
          filterPhone.trim() === "" ||
          (lead.phone && lead.phone.includes(filterPhone.trim()));

        const matchesAssignedTo =
          filterAssignedTo === "" || 
          (filterAssignedTo === "Assigned" && assignedName && assignedName.trim() !== "") ||
          (filterAssignedTo === "Un-Assigned" && (!assignedName || assignedName.trim() === "")) ||
          (assignedName && assignedName === filterAssignedTo);

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

        // Added source and campaign filters
        const matchesSource =
          filterSource === "" || (lead.source && lead.source === filterSource);

        const matchesCampaign =
          filterCampaign === "" || (lead.campaign && lead.campaign === filterCampaign);

        return matchesEmail && matchesYear && matchesStatus && matchesName && 
               matchesPhone && matchesAssignedTo && matchesGender && 
               matchesQualification && matchesCity && matchesCourse &&
               matchesSource && matchesCampaign; // Added source and campaign conditions
      })
    : paginatedLeads
  ) || [];

  const uniqueYears = [...new Set(allLeads.map((lead) => lead.passedOutYear).filter(Boolean))].sort();
  const uniqueGenders = [...new Set(allLeads.map((lead) => lead.gender).filter(Boolean))];
  const uniqueQualifications = [...new Set(allLeads.map((lead) => lead.qualification).filter(Boolean))].sort();
  const uniqueCities = [...new Set(allLeads.map((lead) => lead.city).filter(Boolean))].sort();
  const uniqueCourses = [...new Set(allLeads.map(lead => getLeadCourseName(lead)).filter(name => name !== "N/A"))].sort();
  const uniqueAssignedTo = [...new Set(allLeads
    .map((lead) => getAssignedDisplayText(lead))
    .filter(Boolean))].sort();
  const uniqueSources = [...new Set(allLeads.map((lead) => lead.source).filter(Boolean))].sort(); // Get unique sources
  const uniqueCampaigns = [...new Set(allLeads.map((lead) => lead.campaign).filter(Boolean))].sort(); // Get unique campaigns

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
    setFilterSource(""); // Clear source filter
    setFilterCampaign(""); // Clear campaign filter
    setPage(0);
    fetchPage(0);
  };

  const goToPage = (p) => {
    if (p < 0) p = 0;
    if (totalPages && p >= totalPages) p = totalPages - 1;
    setPage(p);
  };

  // Main Stats Cards (unchanged)
  const statsCards = [
    { 
      title: "Total Leads", 
      value: totalLeadsCount, 
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

  const currentUserName = getCurrentUserName();

  return (
    <div className="container-fluid p-4" style={{ background: "linear-gradient(180deg, #f8f9fc 0%, #eef2f7 100%)", minHeight: "100vh" }}>
      
      {/* User Info Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">🎯 Leads Management Dashboard</h2>
          <p className="text-muted mb-0">Comprehensive overview of your leads and performance metrics</p>
        </div>
        <div className="text-end">
          <div className="badge bg-primary fs-6 mb-2">Role: {userRole}</div>
          <br />
          <small className="text-muted">User: <strong>{currentUserName}</strong></small>
          {canAssignLeads() && (
            <small className="text-success d-block mt-1">
              ✅ Can assign leads to counselors
            </small>
          )}
          {canEditLeads() && (
            <small className="text-info d-block mt-1">
              ✏️ Can edit leads
            </small>
          )}
        </div>
      </div>
      
      {/* Main Stats Cards Row */}
      <div className="mb-4">
        <h5 className="fw-bold mb-3 text-dark">📊 Lead Status Overview</h5>
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
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
                onClick={() => {
                  setFilterStatus(card.title.toUpperCase().replace(' ', '_'));
                }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="text-uppercase mb-2 fw-semibold" style={{ color: "#fff", opacity: 0.9, fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                        {card.title}
                      </h6>
                      <h3 className="fw-bold mb-1" style={{ color: "#fff", fontSize: "2rem" }}>
                        {card.value}
                      </h3>
                      <p className="mb-0 fw-semibold" style={{ color: "#fff", opacity: 0.9, fontSize: "0.75rem" }}>
                        {totalLeadsCount > 0 ? ((card.value / totalLeadsCount) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                    <div style={{ fontSize: "2rem", opacity: 0.8 }}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-2">
                    <small style={{ color: "#fff", opacity: 0.8 }}>{card.description}</small>
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

            {/* Assigned To Filter */}
            {canAssignLeads() && (
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
                  {uniqueAssignedTo
                    .filter(assigned => assigned !== "Un-Assigned")
                    .map((assigned) => (
                      <option key={assigned} value={assigned}>{assigned}</option>
                    ))}
                </select>
              </div>
            )}

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

            {/* Added Source Filter */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Source</label>
              <select
                className="form-select"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Added Campaign Filter */}
            <div className="col-md-3">
              <label className="form-label fw-semibold small text-muted">Campaign</label>
              <select
                className="form-select"
                value={filterCampaign}
                onChange={(e) => setFilterCampaign(e.target.value)}
              >
                <option value="">All Campaigns</option>
                {uniqueCampaigns.map((campaign) => (
                  <option key={campaign} value={campaign}>{campaign}</option>
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
                <option value="CONTACTED">CONTACTED</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT_INTERESTED">NOT INTERESTED</option>
                <option value="ENROLLED">ENROLLED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Leads Card */}
      {canAssignLeads() && selectedLeads.size > 0 && (
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
                  disabled={assigning}
                >
                  {assigning ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Assigning...
                    </>
                  ) : (
                    "👥 Assign to Counselor"
                  )}
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedLeads(new Set())}
                  disabled={assigning}
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

      {/* Table */}
      {!loading && filteredLeads.length > 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">📋 Leads List ({filteredLeads.length} records)</h5>
              {/* Select All checkbox */}
              {canAssignLeads() && (
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    id="selectAll"
                    disabled={assigning}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="selectAll">
                    Select All
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                <tr>
                  {canAssignLeads() && (
                    <th className="fw-semibold" style={{ width: '40px' }}>#</th>
                  )}
                  <th className="fw-semibold">ID</th>
                  <th className="fw-semibold">Name</th>
                  <th className="fw-semibold">Phone</th>
                  <th className="fw-semibold">Email</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold">Assigned To</th>
                  <th className="fw-semibold">Assigned By</th>
                  <th className="fw-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr key={lead.leadId} style={{ background: idx % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                    {canAssignLeads() && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isLeadSelected(lead.leadId)}
                          onChange={() => toggleLeadSelection(lead.leadId)}
                          disabled={assigning}
                        />
                      </td>
                    )}
                    <td className="fw-medium">{lead.leadId}</td>
                    <td className="fw-semibold text-dark">{lead.leadName}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email || <span className="text-muted">-</span>}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.status)} rounded-pill px-3 py-2`}>
                        {getStatusDisplayText(lead.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getAssignedBadgeClass(getAssignedDisplayText(lead))} rounded-pill px-3 py-2`}>
                        {getAssignedDisplayText(lead)}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted fw-medium">
                        {getAssignedByName(lead)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          className="btn btn-sm btn-outline-info" 
                          onClick={() => handleView(lead)} 
                          disabled={assigning}
                          title="View Lead History"
                        >
                          👁️
                        </button>
                        
                        {canEditLeads() && (
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => handleEdit(lead)} 
                            disabled={assigning}
                            title="Edit Lead"
                          >
                            ✏️
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => deleteLead(lead.leadId)} 
                          disabled={assigning}
                          title="Delete Lead"
                        >
                          🗑️
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

      {/* Pagination */}
      {!isFilteringActive() && totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing page <strong className="text-dark">{currentPage + 1}</strong> of <strong className="text-dark">{totalPages}</strong>
            {" · "}Total records: <strong className="text-dark">{totalElements}</strong>
          </div>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)} disabled={assigning}>Previous</button>
              </li>

              {Array.from({ length: totalPages }).map((_, idx) => {
                if (
                  idx === 0 ||
                  idx === totalPages - 1 ||
                  (idx >= currentPage - 2 && idx <= currentPage + 2)
                ) {
                  return (
                    <li key={idx} className={`page-item ${idx === currentPage ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(idx)} disabled={assigning}>{idx + 1}</button>
                    </li>
                  );
                }
                const shouldShowLeftEllipsis = idx === 1 && currentPage > 3;
                const shouldShowRightEllipsis = idx === totalPages - 2 && currentPage < totalPages - 4;
                if (shouldShowLeftEllipsis || shouldShowRightEllipsis) {
                  return (
                    <li key={`dots-${idx}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              })}

              <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)} disabled={assigning}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* View Lead Modal */}
      {showViewModal && viewingLead && (
        <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header" style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", color: "#fff" }}>
                <div>
                  <h5 className="modal-title fw-bold mb-0">👁️ View Lead History</h5>
                  <small className="opacity-75">Lead ID: {viewingLead.leadId}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowViewModal(false);
                  setViewingLead(null);
                }}></button>
              </div>

              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-semibold border-bottom pb-2 mb-3">📋 Personal Information</h6>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Full Name</label>
                      <p className="fw-semibold">{viewingLead.leadName || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Phone</label>
                      <p className="fw-semibold">{viewingLead.phone || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Email</label>
                      <p className="fw-semibold">{viewingLead.email || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Gender</label>
                      <p className="fw-semibold">{viewingLead.gender || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">City</label>
                      <p className="fw-semibold">{viewingLead.city || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">College</label>
                      <p className="fw-semibold">{viewingLead.college || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-semibold border-bottom pb-2 mb-3">🎓 Academic Information</h6>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Qualification</label>
                      <p className="fw-semibold">{viewingLead.qualification || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Passed Out Year</label>
                      <p className="fw-semibold">{viewingLead.passedOutYear || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Course Interested</label>
                      <p className="fw-semibold">{getLeadCourseName(viewingLead)}</p>
                    </div>
                    
                    <h6 className="fw-semibold border-bottom pb-2 mb-3 mt-4">📊 Status & Assignment</h6>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Status</label>
                      <span className={`badge ${getStatusBadgeClass(viewingLead.status)} rounded-pill px-3 py-2`}>
                        {getStatusDisplayText(viewingLead.status)}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Assigned To</label>
                      <p className="fw-semibold">
                        <span className={`badge ${getAssignedBadgeClass(getAssignedDisplayText(viewingLead))} rounded-pill px-3 py-2`}>
                          {getAssignedDisplayText(viewingLead)}
                        </span>
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Assigned By</label>
                      <p className="fw-semibold">{getAssignedByName(viewingLead)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6 className="fw-semibold border-bottom pb-2 mb-3">📈 Lead Source</h6>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Source</label>
                      <p className="fw-semibold">{viewingLead.source || "N/A"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Campaign</label>
                      <p className="fw-semibold">{viewingLead.campaign || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-semibold border-bottom pb-2 mb-3">🗒️ Additional Information</h6>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Notes</label>
                      <p className="fw-semibold">{viewingLead.notes || "No notes available"}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-muted">Reminder Time</label>
                      <p className="fw-semibold">{formatDateForDisplay(viewingLead.reminderTime)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowViewModal(false);
                  setViewingLead(null);
                }}>Close</button>
                {canEditLeads() && (
                  <button type="button" className="btn btn-primary" onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingLead);
                  }}>✏️ Edit Lead</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Counselor Modal */}
      {canAssignLeads() && showAssignModal && (
        <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "#fff" }}>
                <h5 className="modal-title fw-bold mb-0">
                  {assigning ? "🔄 Assigning Leads..." : "👥 Assign Leads to Counselor"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCounselor("");
                }} disabled={assigning}></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-4">
                  <p className="fw-semibold">
                    Assigning <span className="text-primary">{selectedLeads.size}</span> selected lead(s) to:
                  </p>
                  <p className="text-muted small">
                    Current User: <strong>{currentUserName}</strong> (ID: {getLoggedInUserId()})
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Counselor</label>
                  <select
                    className="form-select"
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    disabled={assigning}
                  >
                    <option value="">-- Choose a Counselor --</option>
                    {counselors
                      .filter(counselor => counselor.status === "Active")
                      .map((counselor) => (
                        <option key={counselor.id} value={counselor.name}>
                          {counselor.name} {counselor.email && `(${counselor.email})`} {counselor.phone && `- 📞 ${counselor.phone}`}
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
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleAssignLeads}
                  disabled={!selectedCounselor || counselors.filter(c => c.status === "Active").length === 0 || assigning}
                >
                  {assigning ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Assigning...
                    </>
                  ) : (
                    "✅ Assign Leads"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedLead && canEditLeads() && (
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
                    <input type="text" name="leadName" className="form-control" value={formData.leadName} onChange={handleChange} />
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

                  {/* Updated Source dropdown to use API data */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Source</label>
                    <select name="source" className="form-select" value={formData.source} onChange={handleChange}>
                      <option value="">Select Source</option>
                      {sources.map((source) => (
                        <option key={source.id} value={source.name}>
                          {source.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Updated Campaign dropdown to use API data */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Campaign</label>
                    <select name="campaign" className="form-select" value={formData.campaign} onChange={handleChange}>
                      <option value="">Select Campaign</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.name}>
                          {campaign.name}
                        </option>
                      ))}
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
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="INTERESTED">INTERESTED</option>
                      <option value="NOT_INTERESTED">NOT INTERESTED</option>
                      <option value="ENROLLED">ENROLLED</option>
                    </select>
                  </div>

                  {canAssignLeads() && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Assigned To</label>
                      <select 
                        name="assignedTo" 
                        className="form-select" 
                        value={formData.assignedTo} 
                        onChange={handleChange}
                      >
                        <option value="">Un-Assigned</option>
                        {counselors
                          .filter(counselor => counselor.status === "Active")
                          .map((counselor) => (
                            <option key={counselor.id} value={counselor.name}>
                              {counselor.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label fw-semibold">Notes</label>
                    <textarea 
                      name="notes" 
                      className="form-control" 
                      rows="3" 
                      value={formData.notes || ''} 
                      onChange={handleChange}
                      placeholder="Add any additional notes about the lead..."
                    />
                    <small className="text-muted">Add any important notes or comments about this lead.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Reminder Time</label>
                    <input 
                      type="datetime-local" 
                      name="reminderTime" 
                      className="form-control" 
                      value={formData.reminderTime || ''} 
                      onChange={handleChange}
                    />
                    <small className="text-muted">Set a reminder for follow-up (Date and Time)</small>
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