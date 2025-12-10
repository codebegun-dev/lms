import React, { useEffect, useState } from "react";
import axios from "axios";

function LeadsList() {
  const [paginatedLeads, setPaginatedLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [courses, setCourses] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
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
  const [filterSource, setFilterSource] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [assigning, setAssigning] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLead, setViewingLead] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedReminderLead, setSelectedReminderLead] = useState(null);
  const [reminderForm, setReminderForm] = useState({
    notes: "",
    reminderTime: ""
  });

  const [formData, setFormData] = useState({
    leadName: "",
    phone: "",
    email: "",
    gender: "",
    passedOutYear: "",
    qualification: "",
    courseId: "",
    status: "New",
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

  const statusCategories = {
    New: ["New"],
    MESSAGE_STATUS: [
      "Message Sent",
      "Waiting for Reply",
      "No Reply – 1st Attempt",
      "No Reply – 2nd Attempt",
      "No Reply – Final Attempt"
    ],
    ELIGIBILITY: [
      "Eligible",
      "Not Eligible"
    ],
    CALL_STATUS: [
      "Call Connected",
      "Call Not Picked – 1st",
      "Call Not Picked – 2nd",
      "Call Not Picked – Final",
      "Not Reachable",
      "Switched Off",
      "Wrong Number"
    ],
    FOLLOW_UP: [
      "Interested – Active",
      "Follow-Up Scheduled",
      "Reminder Sent",
      "Follow-Up Missed",
      "Future Prospect",
      "Parent Approval Pending",
      "Budget Issue",
      "Considering Other Institute",
      "Not Interested"
    ],
    DEMO_COUNSELLING: [
      "Demo Scheduled",
      "Demo Completed",
      "Demo No-Show",
      "Counselling Completed"
    ],
    REGISTRATION: [
      "Registration Form Sent",
      "Registration Completed",
      "Payment Pending",
      "Part Payment",
      "Payment Completed",
      "Payment Follow-Up",
      "Payment Dropped"
    ],
    STUDENT_STAGE: [
      "Enrolled",
      "Added to LMS",
      "Batch Assigned",
      "Orientation Completed"
    ],
    CLOSED: [
      "Closed – Not Interested",
      "Closed – Not Eligible",
      "Closed – No Response",
      "Closed – Wrong Number"
    ]
  };

  const statusProgression = [
    {
      title: "New",
      statuses: ["New"],
      icon: "🆕",
      color: "#667eea",
      description: "Lead created"
    },
    {
      title: "Message Status",
      statuses: ["Message Sent", "Waiting for Reply", "No Reply – 1st Attempt", "No Reply – 2nd Attempt", "No Reply – Final Attempt"],
      icon: "💬",
      color: "#4facfe",
      description: "Initial contact"
    },
    {
      title: "Eligibility",
      statuses: ["Eligible", "Not Eligible"],
      icon: "✅",
      color: "#43e97b",
      description: "Eligibility check"
    },
    {
      title: "Call Status",
      statuses: ["Call Connected", "Call Not Picked – 1st", "Call Not Picked – 2nd", "Call Not Picked – Final", "Not Reachable", "Switched Off", "Wrong Number"],
      icon: "📱",
      color: "#fa709a",
      description: "Phone communication"
    },
    {
      title: "Follow Up",
      statuses: ["Interested – Active", "Follow-Up Scheduled", "Reminder Sent", "Follow-Up Missed", "Future Prospect", "Parent Approval Pending", "Budget Issue", "Considering Other Institute", "Not Interested"],
      icon: "🔄",
      color: "#ff9a9e",
      description: "Follow-up activities"
    },
    {
      title: "Demo/Counselling",
      statuses: ["Demo Scheduled", "Demo Completed", "Demo No-Show", "Counselling Completed"],
      icon: "🎓",
      color: "#a18cd1",
      description: "Demo session"
    },
    {
      title: "Registration",
      statuses: ["Registration Form Sent", "Registration Completed", "Payment Pending", "Part Payment", "Payment Completed", "Payment Follow-Up", "Payment Dropped"],
      icon: "📝",
      color: "#fbc2eb",
      description: "Registration process"
    },
    {
      title: "Student Stage",
      statuses: ["Enrolled", "Added to LMS", "Batch Assigned", "Orientation Completed"],
      icon: "🎯",
      color: "#6a11cb",
      description: "Student onboarding"
    },
    {
      title: "Closed",
      statuses: ["Closed – Not Interested", "Closed – Not Eligible", "Closed – No Response", "Closed – Wrong Number"],
      icon: "❌",
      color: "#8e9eab",
      description: "Lead closure"
    }
  ];

  const BASE_URL = "http://localhost:8080/api/saleCourse/leads";
  const COUNSELOR_URL = "http://localhost:8080/api/user/assignable-users";
  const USERS_URL = "http://localhost:8080/api/user/all";
  const SOURCES_URL = "http://localhost:8080/api/sources";
  const CAMPAIGNS_URL = "http://localhost:8080/api/campaigns";
  const HISTORY_URL = "http://localhost:8080/api/history";

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDateForDisplay(dateString);
  };

  const getLoggedInUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return null;
  };

  const getLoggedInUserId = () => {
    const user = getLoggedInUser();
    return user ? user.userId : null;
  };

  const getCurrentUserName = () => {
    const user = getLoggedInUser();
    if (user) return user.firstName || user.name || user.username || 'Current User';
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
    return userRole === "MASTER_ADMIN" || userRole === "SALES_MANAGER" || userRole.startsWith("SA_");
  };

  const isSARole = () => {
    return userRole.startsWith("SA_");
  };

  const isManagerOrAdmin = () => {
    return userRole === "MASTER_ADMIN" || userRole === "SALES_MANAGER";
  };

  useEffect(() => {
    setUserRole(getLoggedInUserRole());
    fetchPage(page);
    fetchAllLeadsForCounts();
    fetchCourses();
    fetchCounselors();
    fetchAllUsers();
    fetchSources();
    fetchCampaigns();
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
      (filterSource && filterSource.trim() !== "") ||
      (filterCampaign && filterCampaign.trim() !== "")
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
      setApiError("Failed to load leads!");
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
      setCounselors(transformedCounselors);
    } catch (err) {
      console.error("Failed to load counselors", err);
      setCounselors([]);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(USERS_URL);
      const transformedUsers = (res.data || []).map(user => ({
        id: user.userId || user.id,
        name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        email: user.email || 'No email',
        role: user.role || user.roleName || 'Unknown Role'
      }));
      setAllUsers(transformedUsers);
    } catch (err) {
      console.error("Failed to load all users", err);
      setAllUsers([]);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get(SOURCES_URL);
      const transformedSources = (res.data || []).map(source => ({
        id: source.sourceId || source.id,
        name: source.sourceName || source.name || 'Unknown Source'
      }));
      setSources(transformedSources);
    } catch (err) {
      console.error("Failed to load sources", err);
      setSources([]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(CAMPAIGNS_URL);
      const transformedCampaigns = (res.data || []).map(campaign => ({
        id: campaign.campaignId || campaign.id,
        name: campaign.campaignName || campaign.name || 'Unknown Campaign'
      }));
      setCampaigns(transformedCampaigns);
    } catch (err) {
      console.error("Failed to load campaigns", err);
      setCampaigns([]);
    }
  };

  const fetchActivityHistory = async (leadId) => {
    try {
      setLoadingHistory(true);
      const response = await axios.get(`${HISTORY_URL}/lead/${leadId}`);
      setActivityHistory(response.data || []);
      setLoadingHistory(false);
    } catch (error) {
      console.error("Error fetching activity history:", error);
      setActivityHistory([]);
      setLoadingHistory(false);
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
      const user = allUsers.find(u => u.id.toString() === lead.assignedBy.toString());
      return user ? user.name : lead.assignedBy;
    }
    return getCurrentUserName();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReminderChange = (e) => {
    setReminderForm({ ...reminderForm, [e.target.name]: e.target.value });
  };

  const handleView = async (lead) => {
    setViewingLead(lead);
    await fetchActivityHistory(lead.leadId);
    setShowViewModal(true);
  };

  const handleSetReminder = (lead) => {
    setSelectedReminderLead(lead);
    setReminderForm({
      notes: "",
      reminderTime: ""
    });
    setShowReminderModal(true);
  };

  const handleSubmitReminder = async () => {
    if (!selectedReminderLead) return;
    
    try {
      const loggedInUserId = getLoggedInUserId();
      if (!loggedInUserId) {
        alert("User not logged in. Please login again.");
        return;
      }

      const reminderData = {
        leadId: selectedReminderLead.leadId,
        notes: reminderForm.notes,
        reminderTime: reminderForm.reminderTime,
        loggedInUserId: loggedInUserId
      };

      await axios.post(`${BASE_URL}/reminder`, reminderData);
      
      alert("Reminder set successfully!");
      setShowReminderModal(false);
      setSelectedReminderLead(null);
      
      fetchPage(page);
      fetchAllLeadsForCounts();
      
    } catch (error) {
      console.error("Error setting reminder:", error);
      alert("Failed to set reminder: " + (error.response?.data?.message || error.message));
    }
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
      status: lead.status || "New",
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
        updateData.assignedTo = selectedLead.assignedTo || "";
      }

      const { assignedTo, ...dataToSend } = updateData;
      
      await axios.put(`${BASE_URL}/${selectedLead.leadId}`, dataToSend);
      
      alert("Lead updated successfully!");
      setSelectedLead(null);
      
      const updatedLead = {
        ...selectedLead,
        ...formData,
        assignedTo: formData.assignedTo || selectedLead.assignedTo,
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

      const bulkAssignRequest = {
        leadIds: selectedLeadIds,
        assignedUserId: selectedCounselorObj.id
      };

      await axios.post(`${BASE_URL}/assign/bulk?loggedInUserId=${loggedInUserId}`, bulkAssignRequest);
      
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
      alert("Failed to assign leads: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "New") return "bg-primary";
    if (statusCategories.MESSAGE_STATUS.includes(status)) return "bg-info";
    if (status === "Eligible") return "bg-success";
    if (status === "Not Eligible") return "bg-danger";
    if (statusCategories.CALL_STATUS.includes(status)) return "bg-warning text-dark";
    if (status === "Interested – Active") return "bg-success";
    if (status === "Follow-Up Scheduled") return "bg-primary";
    if (status === "Reminder Sent") return "bg-info";
    if (status === "Follow-Up Missed") return "bg-warning text-dark";
    if (status === "Future Prospect") return "bg-secondary";
    if (status === "Parent Approval Pending") return "bg-warning text-dark";
    if (status === "Budget Issue") return "bg-warning text-dark";
    if (status === "Considering Other Institute") return "bg-warning text-dark";
    if (status === "Not Interested") return "bg-danger";
    if (status === "Demo Scheduled") return "bg-primary";
    if (status === "Demo Completed") return "bg-success";
    if (status === "Demo No-Show") return "bg-danger";
    if (status === "Counselling Completed") return "bg-success";
    if (status === "Registration Form Sent") return "bg-info";
    if (status === "Registration Completed") return "bg-success";
    if (status === "Payment Pending") return "bg-warning text-dark";
    if (status === "Part Payment") return "bg-warning text-dark";
    if (status === "Payment Completed") return "bg-success";
    if (status === "Payment Follow-Up") return "bg-warning text-dark";
    if (status === "Payment Dropped") return "bg-danger";
    if (statusCategories.STUDENT_STAGE.includes(status)) return "bg-dark";
    if (statusCategories.CLOSED.includes(status)) return "bg-secondary";
    return "bg-secondary";
  };

  const getStatusDisplayText = (status) => {
    return status || "New";
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
        New: backendStatusCounts.New || 0,
        MESSAGE_SENT: backendStatusCounts.MESSAGE_SENT || 0,
        ELIGIBLE: backendStatusCounts.ELIGIBLE || 0,
        NOT_ELIGIBLE: backendStatusCounts.NOT_ELIGIBLE || 0,
        INTERESTED: backendStatusCounts.INTERESTED || 0,
        NOT_INTERESTED: backendStatusCounts.NOT_INTERESTED || 0,
        ENROLLED: backendStatusCounts.ENROLLED || 0,
        CLOSED: backendStatusCounts.CLOSED || 0
      };
    }
    
    const counts = {
      New: 0,
      MESSAGE_SENT: 0,
      ELIGIBLE: 0,
      NOT_ELIGIBLE: 0,
      INTERESTED: 0,
      NOT_INTERESTED: 0,
      ENROLLED: 0,
      CLOSED: 0
    };
    
    allLeads.forEach(lead => {
      if (lead.status) {
        if (statusCategories.New.includes(lead.status)) {
          counts.New++;
        } else if (statusCategories.MESSAGE_STATUS.includes(lead.status)) {
          counts.MESSAGE_SENT++;
        } else if (lead.status === "Eligible") {
          counts.ELIGIBLE++;
        } else if (lead.status === "Not Eligible") {
          counts.NOT_ELIGIBLE++;
        } else if (lead.status === "Interested – Active") {
          counts.INTERESTED++;
        } else if (lead.status === "Not Interested") {
          counts.NOT_INTERESTED++;
        } else if (statusCategories.STUDENT_STAGE.includes(lead.status)) {
          counts.ENROLLED++;
        } else if (statusCategories.CLOSED.includes(lead.status)) {
          counts.CLOSED++;
        }
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

  const getCurrentProgressStage = (status) => {
    for (let i = 0; i < statusProgression.length; i++) {
      if (statusProgression[i].statuses.includes(status)) {
        return i;
      }
    }
    return 0;
  };

  const getProgressPercentage = (status) => {
    const currentStage = getCurrentProgressStage(status);
    const totalStages = statusProgression.length;
    return ((currentStage + 1) / totalStages) * 100;
  };

  const getStatusDateFromHistory = (status) => {
    if (!activityHistory || activityHistory.length === 0) return null;
    
    const statusActivities = activityHistory.filter(activity => 
      activity.newStatus === status
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return statusActivities.length > 0 ? statusActivities[0].createdAt : null;
  };

  const getAllStatusDates = () => {
    const statusDates = {};
    if (!activityHistory || activityHistory.length === 0) return statusDates;
    
    activityHistory.forEach(activity => {
      if (activity.newStatus && !statusDates[activity.newStatus]) {
        statusDates[activity.newStatus] = activity.createdAt;
      }
    });
    
    return statusDates;
  };

  const getLeadTimeline = (lead) => {
    const currentStage = getCurrentProgressStage(lead.status);
    const timeline = [];
    const statusDates = getAllStatusDates();
    
    for (let i = 0; i < statusProgression.length; i++) {
      const stage = statusProgression[i];
      const isCompleted = i < currentStage;
      const isCurrent = i === currentStage;
      const isFuture = i > currentStage;
      
      let stageStatus = "";
      let statusDate = "";
      let activityDetails = null;
      
      for (const status of stage.statuses) {
        if (statusDates[status]) {
          stageStatus = status;
          statusDate = statusDates[status];
          
          const activity = activityHistory.find(act => 
            act.newStatus === status && act.createdAt === statusDate
          );
          if (activity) {
            activityDetails = activity;
          }
          break;
        }
      }
      
      if (!stageStatus && isCurrent && lead.status) {
        stageStatus = lead.status;
        statusDate = lead.updatedAt || new Date().toISOString();
      }
      
      timeline.push({
        stage: i,
        title: stage.title,
        description: stage.description,
        status: stageStatus,
        icon: stage.icon,
        color: stage.color,
        date: statusDate,
        activity: activityDetails,
        completed: isCompleted,
        current: isCurrent,
        future: isFuture
      });
    }
    
    return timeline;
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

        const matchesSource =
          filterSource === "" || (lead.source && lead.source === filterSource);

        const matchesCampaign =
          filterCampaign === "" || (lead.campaign && lead.campaign === filterCampaign);

        return matchesEmail && matchesYear && matchesStatus && matchesName && 
               matchesPhone && matchesAssignedTo && matchesGender && 
               matchesQualification && matchesCity && matchesCourse &&
               matchesSource && matchesCampaign;
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
  const uniqueSources = [...new Set(allLeads.map((lead) => lead.source).filter(Boolean))].sort();
  const uniqueCampaigns = [...new Set(allLeads.map((lead) => lead.campaign).filter(Boolean))].sort();

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
    setFilterSource("");
    setFilterCampaign("");
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
      bgColor: "bg-primary"
    },
    { 
      title: "New Leads", 
      value: statusCounts.New, 
      icon: "🆕",
      bgColor: "bg-danger"
    },
    { 
      title: "In Contact", 
      value: statusCounts.MESSAGE_SENT, 
      icon: "📞",
      bgColor: "bg-info"
    },
    { 
      title: "Eligible", 
      value: statusCounts.ELIGIBLE, 
      icon: "✅",
      bgColor: "bg-success"
    },
    { 
      title: "Interested", 
      value: statusCounts.INTERESTED, 
      icon: "⭐",
      bgColor: "bg-warning"
    },
    { 
      title: "Enrolled", 
      value: statusCounts.ENROLLED, 
      icon: "🎓",
      bgColor: "bg-dark"
    }
  ];

  const currentUserName = getCurrentUserName();

  return (
    <div className="container-fluid p-3 bg-light" style={{ minHeight: "100vh" }}>
      
      {/* Header */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">🎯 Leads Management</h2>
              <p className="text-muted mb-0">Manage and track your leads efficiently</p>
            </div>
            <div className="text-end">
              <div className="badge bg-primary fs-6 mb-2">Role: {userRole}</div>
              <br />
              <small className="text-muted">User: <strong>{currentUserName}</strong></small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        {statsCards.map((card, index) => (
          <div key={index} className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className={`card ${card.bgColor} text-white border-0 shadow-sm`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 opacity-75">{card.title}</h6>
                    <h2 className="card-title fw-bold mb-0">{card.value}</h2>
                  </div>
                  <div className="display-4">
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark">🔍 Advanced Filters</h5>
            {isFilteringActive() && (
              <button className="btn btn-sm btn-outline-danger" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label small text-muted">Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted">Phone</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by phone..."
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
              />
            </div>

            {canAssignLeads() && (
              <div className="col-md-3">
                <label className="form-label small text-muted">Assigned To</label>
                <select
                  className="form-select form-select-sm"
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
              <label className="form-label small text-muted">Gender</label>
              <select
                className="form-select form-select-sm"
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
              <label className="form-label small text-muted">Qualification</label>
              <select
                className="form-select form-select-sm"
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
              <label className="form-label small text-muted">City</label>
              <select
                className="form-select form-select-sm"
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
              <label className="form-label small text-muted">Course</label>
              <select
                className="form-select form-select-sm"
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
              <label className="form-label small text-muted">Source</label>
              <select
                className="form-select form-select-sm"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
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
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedLeads(new Set())}
                  disabled={assigning}
                >
                  Clear Selection
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
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          <strong>Error:</strong> {apiError}
          <button type="button" className="btn-close" onClick={() => setApiError("")}></button>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredLeads.length === 0 && (
        <div className="card shadow-sm border-0 mb-3">
          <div className="card-body text-center py-5">
            <div className="display-4 text-muted mb-3">📭</div>
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
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">📋 Leads List ({filteredLeads.length} records)</h5>
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
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  {canAssignLeads() && (
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                        onChange={toggleSelectAll}
                        disabled={assigning}
                      />
                    </th>
                  )}
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Assigned By</th>
                  <th>Reminder</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr key={lead.leadId}>
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
                    <td className="fw-semibold">{lead.leadName}</td>
                    <td>{lead.phone}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.status)} rounded-pill`}>
                        {getStatusDisplayText(lead.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getAssignedBadgeClass(getAssignedDisplayText(lead))} rounded-pill`}>
                        {getAssignedDisplayText(lead)}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{getAssignedByName(lead)}</small>
                    </td>
                    <td>
                      {lead.reminderTime ? (
                        <small className="text-success">⏰ {formatDateForDisplay(lead.reminderTime)}</small>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          className="btn btn-outline-info"
                          onClick={() => handleView(lead)} 
                          disabled={assigning}
                          title="View Lead"
                        >
                          👁️
                        </button>
                        
                        {canEditLeads() && (
                          <>
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(lead)} 
                              disabled={assigning}
                              title="Edit Lead"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-outline-warning"
                              onClick={() => handleSetReminder(lead)} 
                              disabled={assigning}
                              title="Set Reminder"
                            >
                              ⏰
                            </button>
                          </>
                        )}
                        <button 
                          className="btn btn-outline-danger"
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
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)} disabled={assigning}>
                Previous
              </button>
            </li>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              if (idx === 0 || idx === totalPages - 1 || (idx >= currentPage - 2 && idx <= currentPage + 2)) {
                return (
                  <li key={idx} className={`page-item ${idx === currentPage ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(idx)} disabled={assigning}>
                      {idx + 1}
                    </button>
                  </li>
                );
              }
              return null;
            })}
            
            <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)} disabled={assigning}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* View Lead Modal */}
      {showViewModal && viewingLead && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">📊 Lead Progress Timeline</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowViewModal(false);
                  setViewingLead(null);
                  setActivityHistory([]);
                }}></button>
              </div>

              <div className="modal-body">
                {/* Current Status Section */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="card-title mb-3">🕒 Lead Created Time</h6>
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-3">📅</span>
                          <div>
                            <p className="mb-0 fw-semibold fs-5">
                              {formatDateForDisplay(viewingLead.createdAt || viewingLead.updatedAt)}
                            </p>
                            <p className="mb-0 text-muted">
                              {formatTimeAgo(viewingLead.createdAt || viewingLead.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="card-title mb-3">🎯 Current Status</h6>
                        <div className="d-flex align-items-center">
                          <span className="fs-4 me-3">📊</span>
                          <div>
                            <p className="mb-0">
                              <span className={`badge ${getStatusBadgeClass(viewingLead.status)} fs-6`}>
                                {getStatusDisplayText(viewingLead.status)}
                              </span>
                            </p>
                            <p className="mb-0 text-muted small">
                              Stage {getCurrentProgressStage(viewingLead.status) + 1} of {statusProgression.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline Section */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0">📈 Progress Timeline</h6>
                  </div>
                  <div className="card-body">
                    <div className="progress-timeline">
                      <div className="timeline-container" style={{ position: 'relative' }}>
                        {/* Progress line background */}
                        <div 
                          className="progress-line" 
                          style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            right: '0',
                            height: '6px',
                            backgroundColor: '#e9ecef',
                            zIndex: 1,
                            borderRadius: '3px'
                          }}
                        ></div>
                        
                        {/* Active progress line */}
                        <div 
                          className="progress-line-active" 
                          style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            width: `${getProgressPercentage(viewingLead.status)}%`,
                            height: '6px',
                            backgroundColor: '#0d6efd',
                            zIndex: 2,
                            transition: 'width 0.5s ease',
                            borderRadius: '3px'
                          }}
                        ></div>
                        
                        <div className="row g-0">
                          {getLeadTimeline(viewingLead).map((stage, index) => {
                            const isActive = stage.completed || stage.current;
                            const hasDate = stage.date;
                            
                            return (
                              <div key={index} className="col" style={{ position: 'relative', zIndex: 3 }}>
                                <div className="text-center px-2">
                                  {/* Stage dot */}
                                  <div 
                                    className="stage-dot mx-auto mb-3"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      backgroundColor: isActive ? stage.color : '#e9ecef',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: isActive ? '#fff' : '#6c757d',
                                      fontSize: '18px',
                                      fontWeight: 'bold',
                                      transition: 'all 0.3s ease',
                                      border: '3px solid #fff',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                    {stage.icon}
                                  </div>
                                  
                                  {/* Stage title */}
                                  <div className="mb-2">
                                    <small className="fw-semibold d-block" style={{ color: isActive ? stage.color : '#6c757d' }}>
                                      {stage.title}
                                    </small>
                                    <small className="text-muted d-block">{stage.description}</small>
                                  </div>
                                  
                                  {/* Current status */}
                                  {stage.current && stage.status && (
                                    <div className="mb-2">
                                      <span className="badge bg-primary">{stage.status}</span>
                                    </div>
                                  )}
                                  
                                  {/* Date information */}
                                  {hasDate ? (
                                    <div className="mb-2">
                                      <small className="text-muted d-block">
                                        {formatDateForDisplay(stage.date)}
                                      </small>
                                      <small className="text-muted d-block">
                                        {formatTimeAgo(stage.date)}
                                      </small>
                                    </div>
                                  ) : (
                                    <div className="mb-2">
                                      <small className="text-muted d-block">
                                        {stage.completed ? '✓ Completed' : stage.current ? '● In Progress' : '○ Pending'}
                                      </small>
                                    </div>
                                  )}
                                  
                                  {/* Activity details */}
                                  {stage.activity && stage.activity.actionBy && (
                                    <div className="mb-1">
                                      <small className="text-muted d-block">
                                        By: {getUserNameById(stage.activity.actionBy)}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">📋 Personal Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-6 mb-2">
                            <small className="text-muted">Full Name</small>
                            <p className="fw-semibold mb-0">{viewingLead.leadName || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Phone</small>
                            <p className="fw-semibold mb-0">{viewingLead.phone || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Email</small>
                            <p className="fw-semibold mb-0">{viewingLead.email || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Gender</small>
                            <p className="fw-semibold mb-0">{viewingLead.gender || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">City</small>
                            <p className="fw-semibold mb-0">{viewingLead.city || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">College</small>
                            <p className="fw-semibold mb-0">{viewingLead.college || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">🎓 Academic Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-6 mb-2">
                            <small className="text-muted">Qualification</small>
                            <p className="fw-semibold mb-0">{viewingLead.qualification || "N/A"}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Passed Out Year</small>
                            <p className="fw-semibold mb-0">{viewingLead.passedOutYear || "N/A"}</p>
                          </div>
                          
                          <div className="col-12 mb-2">
                            <small className="text-muted">Course Interested</small>
                            <p className="fw-semibold mb-0">{getLeadCourseName(viewingLead)}</p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Assigned To</small>
                            <p className="fw-semibold mb-0">
                              <span className={`badge ${getAssignedBadgeClass(getAssignedDisplayText(viewingLead))}`}>
                                {getAssignedDisplayText(viewingLead)}
                              </span>
                            </p>
                          </div>
                          
                          <div className="col-6 mb-2">
                            <small className="text-muted">Assigned By</small>
                            <p className="fw-semibold mb-0">{getAssignedByName(viewingLead)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowViewModal(false);
                  setViewingLead(null);
                  setActivityHistory([]);
                }}>Close</button>
                {canEditLeads() && (
                  <button type="button" className="btn btn-primary" onClick={() => {
                    setShowViewModal(false);
                    setViewingLead(null);
                    setActivityHistory([]);
                    handleEdit(viewingLead);
                  }}>✏️ Edit Lead</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedReminderLead && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">⏰ Set Reminder</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowReminderModal(false);
                  setSelectedReminderLead(null);
                }}></button>
              </div>

              <div className="modal-body">
                <p className="fw-semibold">
                  Setting reminder for: <span className="text-primary">{selectedReminderLead.leadName}</span>
                </p>
                <p className="text-muted small mb-3">
                  Lead ID: {selectedReminderLead.leadId} • Phone: {selectedReminderLead.phone}
                </p>

                <div className="mb-3">
                  <label className="form-label">Reminder Notes</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    value={reminderForm.notes}
                    onChange={handleReminderChange}
                    placeholder="Enter reminder notes..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Reminder Date & Time</label>
                  <input
                    type="datetime-local"
                    name="reminderTime"
                    className="form-control"
                    value={reminderForm.reminderTime}
                    onChange={handleReminderChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowReminderModal(false);
                    setSelectedReminderLead(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning" 
                  onClick={handleSubmitReminder}
                  disabled={!reminderForm.reminderTime}
                >
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {canAssignLeads() && showAssignModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {assigning ? "Assigning Leads..." : "Assign Leads to Counselor"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCounselor("");
                }} disabled={assigning}></button>
              </div>

              <div className="modal-body">
                <p className="fw-semibold">
                  Assigning <span className="text-primary">{selectedLeads.size}</span> selected lead(s)
                </p>

                <div className="mb-3">
                  <label className="form-label">Select Counselor</label>
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
                          {counselor.name}
                        </option>
                      ))}
                  </select>
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
                  disabled={!selectedCounselor || assigning}
                >
                  {assigning ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Assigning...
                    </>
                  ) : (
                    "Assign Leads"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - UPDATED with all fields */}
      {selectedLead && canEditLeads() && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">✏️ Edit Lead</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedLead(null)}></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  {/* Basic Information */}
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="leadName" className="form-control" value={formData.leadName} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Academic Information */}
                  <div className="col-md-6">
                    <label className="form-label">Passed Out Year</label>
                    <input type="text" name="passedOutYear" className="form-control" value={formData.passedOutYear} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Qualification</label>
                    <input type="text" name="qualification" className="form-control" value={formData.qualification} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">College</label>
                    <input type="text" name="college" className="form-control" value={formData.college} onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
                  </div>

                  {/* Course Information */}
                  <div className="col-md-6">
                    <label className="form-label">Course</label>
                    <select name="courseId" className="form-select" value={formData.courseId} onChange={handleChange}>
                      <option value="">-- Select Course --</option>
                      {courses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                      <option value="">Select Status</option>
                      <optgroup label="New">
                        <option value="New">New</option>
                      </optgroup>
                      <optgroup label="Message Status">
                        {statusCategories.MESSAGE_STATUS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Eligibility">
                        {statusCategories.ELIGIBILITY.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Call Status">
                        {statusCategories.CALL_STATUS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Follow-Up">
                        {statusCategories.FOLLOW_UP.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Demo/Counselling">
                        {statusCategories.DEMO_COUNSELLING.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Registration">
                        {statusCategories.REGISTRATION.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Student Stage">
                        {statusCategories.STUDENT_STAGE.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Closed">
                        {statusCategories.CLOSED.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Source & Campaign */}
                  <div className="col-md-6">
                    <label className="form-label">Source</label>
                    <select name="source" className="form-select" value={formData.source} onChange={handleChange}>
                      <option value="">Select Source</option>
                      {sources.map((source) => (
                        <option key={source.id} value={source.name}>
                          {source.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Campaign</label>
                    <select name="campaign" className="form-select" value={formData.campaign} onChange={handleChange}>
                      <option value="">Select Campaign</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.name}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Counselor Assignment - Only for Managers/Admins */}
                  {isManagerOrAdmin() && (
                    <div className="col-md-6">
                      <label className="form-label">Assigned Counselor</label>
                      <select 
                        name="assignedTo" 
                        className="form-select" 
                        value={formData.assignedTo} 
                        onChange={handleChange}
                      >
                        <option value="">-- Select Counselor --</option>
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

                  {/* For SA roles, show read-only assigned counselor info */}
                  {isSARole() && (
                    <div className="col-md-6">
                      <label className="form-label">Currently Assigned To</label>
                      <div className="form-control bg-light">
                        {formData.assignedTo || "Unassigned"}
                      </div>
                      <small className="text-muted">Assignment can only be changed by managers or administrators</small>
                    </div>
                  )}

                  {/* Notes & Reminder */}
                  <div className="col-md-6">
                    <label className="form-label">Reminder Time</label>
                    <input 
                      type="datetime-local" 
                      name="reminderTime" 
                      className="form-control" 
                      value={formData.reminderTime || ''} 
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea 
                      name="notes" 
                      className="form-control" 
                      rows="3" 
                      value={formData.notes || ''} 
                      onChange={handleChange}
                      placeholder="Add any additional notes about the lead..."
                    />
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

      {/* Modal Backdrop */}
      {(showViewModal || showReminderModal || showAssignModal || (selectedLead && canEditLeads())) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default LeadsList; 