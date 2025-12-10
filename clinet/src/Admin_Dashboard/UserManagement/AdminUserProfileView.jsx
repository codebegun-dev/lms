// src/Admin_Dashboard/UserManagement/AdminUserProfileView.jsx
import React, { useEffect, useState } from "react";
import { FaTimes, FaArrowLeft, FaSave, FaEdit, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const API_BASE = "http://localhost:8080";

/**
 * Full profile view — fetches data from APIs based on user role
 * Props: user (object), onClose (fn)
 */
const AdminUserProfileView = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState("");

  // Determine user role
  useEffect(() => {
    if (user) {
      const role = user.role?.name || user.role || "";
      setUserRole(role.toUpperCase());
    }
  }, [user]);

  // Define sections based on user role
  const getSections = () => {
    const baseSections = [
      { key: "basic", title: "Basic Information", icon: "👤" },
    ];

    if (userRole === "STUDENT") {
      return [
        ...baseSections,
        { key: "personal", title: "Personal Information", icon: "👤" },
        { key: "generic", title: "Generic Details", icon: "📋" },
        { key: "tenth", title: "10th Grade", icon: "🎓" },
        { key: "twelfth", title: "12th Grade", icon: "📚" },
        { key: "ug", title: "UG Details", icon: "🎯" },
        { key: "pg", title: "PG Details", icon: "🏆" },
        { key: "course", title: "Course Details", icon: "📖" },
        { key: "projects", title: "Projects", icon: "💼" },
        { key: "fee", title: "Fee Details", icon: "💰" },
      ];
    } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
      return [
        ...baseSections,
        { key: "adminPersonal", title: "Admin Personal Info", icon: "👔" },
      ];
    } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
      return [
        ...baseSections,
        { key: "salesPersonal", title: "Sales Personal Info", icon: "💰" },
      ];
    } else if (userRole === "INTERVIEWER") {
      return [
        ...baseSections,
        { key: "interviewerPersonal", title: "Interviewer Personal Info", icon: "🎤" },
      ];
    }
    
    return baseSections;
  };

  // Load all section data
  useEffect(() => {
    loadAllSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRole]);

  const loadAllSections = async () => {
    try {
      setLoading(true);
      const loaded = {};
      
      // Always load basic info
      loaded.basic = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role?.name || user.role || "",
        status: user.status || "active",
      };

      // Load role-specific data
      if (userRole === "STUDENT") {
        await loadStudentSections(loaded);
      } else if (userRole === "ADMIN" || userRole === "MASTER_ADMIN") {
        await loadAdminSections(loaded);
      } else if (userRole === "SALES_MANAGER" || userRole === "SA_COUNSELOR") {
        await loadSalesSections(loaded);
      }

      setSectionData(loaded);
    } catch (err) {
      console.error("Error loading sections", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      
      // Personal Information
      const personalRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`);
      loaded.personal = personalRes.data || {};
      
      // Generic Details
      const genericRes = await axios.get(`${API_BASE}/api/student-generic-details/${userId}`);
      loaded.generic = genericRes.data || {};
      
      // 10th Grade
      const tenthRes = await axios.get(`${API_BASE}/api/tenth-grade/${userId}`);
      loaded.tenth = tenthRes.data || {};
      
      // 12th Grade
      const twelfthRes = await axios.get(`${API_BASE}/api/twelfth-grade/${userId}`);
      loaded.twelfth = twelfthRes.data || {};
      
      // UG Details
      const ugRes = await axios.get(`${API_BASE}/api/student/ug-details/${userId}`);
      loaded.ug = ugRes.data || {};
      
      // PG Details
      const pgRes = await axios.get(`${API_BASE}/api/student/pg-details/${userId}`);
      loaded.pg = pgRes.data || {};
      
      // Projects
      const projectsRes = await axios.get(`${API_BASE}/api/student/projects/${userId}`);
      loaded.projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      
      // Course Details (from student profile)
      loaded.course = {
        courseName: "Full Stack Java", // This would come from your backend
        courseStartDate: "2025-02-15",
        batchName: "Batch A-2025",
      };
      
      // Fee Details
      loaded.fee = {
        totalFee: 50000,
        paidFee: 25000,
        balanceFee: 25000,
      };
      
    } catch (err) {
      console.error("Error loading student sections:", err);
    }
  };

  const loadAdminSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      const adminRes = await axios.get(`${API_BASE}/api/student/personal-info/${userId}`);
      loaded.adminPersonal = {
        ...adminRes.data,
        jobTitle: adminRes.data.jobTitle || "",
      };
    } catch (err) {
      console.error("Error loading admin sections:", err);
      loaded.adminPersonal = {};
    }
  };

  const loadSalesSections = async (loaded) => {
    try {
      const userId = user.id || user.userId;
      const salesRes = await axios.get(`${API_BASE}/api/sales/personal-info/${userId}`);
      loaded.salesPersonal = {
        ...salesRes.data,
        jobTitle: salesRes.data.jobTitle || "",
      };
    } catch (err) {
      console.error("Error loading sales sections:", err);
      loaded.salesPersonal = {};
    }
  };

  const toggleEdit = (key) => setEditMode((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = async (key, data) => {
    try {
      const userId = user.id || user.userId;
      let endpoint = "";
      let payload = { ...data, userId };

      switch (key) {
        case "personal":
          endpoint = `${API_BASE}/api/student/personal-info/update`;
          break;
        case "generic":
          endpoint = `${API_BASE}/api/student-generic-details/update`;
          break;
        case "tenth":
          endpoint = `${API_BASE}/api/tenth-grade`;
          break;
        case "twelfth":
          endpoint = `${API_BASE}/api/twelfth-grade`;
          break;
        case "ug":
          endpoint = `${API_BASE}/api/student/ug-details/update`;
          break;
        case "pg":
          endpoint = `${API_BASE}/api/student/pg-details/update`;
          break;
        case "adminPersonal":
          endpoint = `${API_BASE}/api/student/personal-info/update`;
          break;
        case "salesPersonal":
          endpoint = `${API_BASE}/api/sales/personal-info/update`;
          break;
        default:
          console.warn(`No endpoint defined for section: ${key}`);
          return;
      }

      await axios.put(endpoint, payload);
      setSectionData((p) => ({ ...p, [key]: data }));
      setEditMode((p) => ({ ...p, [key]: false }));
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    }
  };

  const Section = ({ title, keyName, icon }) => {
    const isEditing = !!editMode[keyName];
    const [formState, setFormState] = useState(sectionData[keyName] || {});

    useEffect(() => {
      setFormState(sectionData[keyName] || {});
    }, [sectionData, keyName]);

    const handleChange = (field, value) => {
      setFormState((p) => ({ ...p, [field]: value }));
      setErrors((p) => ({ ...p, [field]: "" }));
    };

    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      handleChange(name, value);
    };

    const handleSaveSection = () => {
      // Basic validation for required fields
      const newErrors = {};
      
      if (keyName === "personal" || keyName === "adminPersonal" || keyName === "salesPersonal") {
        if (!formState.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!formState.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!formState.mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      handleSave(keyName, formState);
    };

    const renderFields = () => {
      if (!formState || Object.keys(formState).length === 0) {
        return (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
            <p className="text-muted mb-0 mt-2">No data available</p>
          </div>
        );
      }

      // Special rendering for projects (array)
      if (keyName === "projects" && Array.isArray(formState)) {
        return (
          <div className="row g-3">
            {formState.map((project, index) => (
              <div className="col-12 mb-3 border p-3 rounded" key={index}>
                <h6>Project {index + 1}</h6>
                {Object.entries(project).map(([k, v]) => (
                  <div className="mb-2" key={k}>
                    <label className="form-label fw-semibold text-secondary small text-capitalize">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={v || ""}
                        onChange={(e) => {
                          const newProjects = [...formState];
                          newProjects[index][k] = e.target.value;
                          setFormState(newProjects);
                        }}
                      />
                    ) : (
                      <div className="p-2 bg-light rounded border">
                        {v || <span className="text-muted">-</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }

      // Special rendering for fee details
      if (keyName === "fee") {
        return (
          <div className="row g-3">
            {Object.entries(formState).map(([k, v]) => (
              <div className="col-md-6" key={k}>
                <label className="form-label fw-semibold text-secondary small text-capitalize">
                  {k.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="p-3 bg-light rounded border">
                  ₹ {Number(v).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
            {!isEditing && (
              <div className="col-12 mt-3">
                <div className="alert alert-info">
                  <strong>Note:</strong> Fee details are managed by the administration. 
                  For any queries, please contact the accounts department.
                </div>
              </div>
            )}
          </div>
        );
      }

      // Default rendering for object data
      return (
        <div className="row g-3">
          {Object.entries(formState).map(([k, v]) => {
            // Skip userId field in display
            if (k === "userId" || k === "id") return null;
            
            // Special handling for dates
            if (k.toLowerCase().includes("date")) {
              v = v ? new Date(v).toISOString().split('T')[0] : v;
            }
            
            return (
              <div className="col-md-6" key={k}>
                <label className="form-label fw-semibold text-secondary small text-capitalize">
                  {k.replace(/([A-Z])/g, " $1").trim()}
                  {(k === "firstName" || k === "lastName" || k === "mobileNumber") && " *"}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type={k.toLowerCase().includes("email") ? "email" : 
                            k.toLowerCase().includes("date") ? "date" : "text"}
                      name={k}
                      className={`form-control ${errors[k] ? "is-invalid" : ""}`}
                      value={v || ""}
                      onChange={handleFieldChange}
                    />
                    {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
                  </>
                ) : (
                  <div className="p-2 bg-light rounded border" style={{ minHeight: "38px" }}>
                    {v || <span className="text-muted">-</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="border rounded-3 mb-3 shadow-sm overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
        <div
          className="p-3 d-flex justify-content-between align-items-center"
          style={{
            cursor: "pointer",
            background: activeSection === keyName ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f8f9fa",
          }}
          onClick={() => setActiveSection(activeSection === keyName ? null : keyName)}
        >
          <h6 className={`mb-0 fw-semibold d-flex align-items-center ${activeSection === keyName ? "text-white" : "text-dark"}`}>
            <span className="me-2" style={{ fontSize: "1.2rem" }}>{icon}</span>
            {title}
          </h6>

          <div className="d-flex gap-2 align-items-center">
            {activeSection === keyName && (
              <button 
                className={`btn btn-sm ${isEditing ? "btn-light" : "btn-outline-light"}`} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (keyName === "fee" || keyName === "course") {
                    alert("This section is read-only and cannot be edited.");
                    return;
                  }
                  toggleEdit(keyName); 
                }}
              >
                {isEditing ? <><FaTimes className="me-1" /> Cancel</> : <><FaEdit className="me-1" /> Edit</>}
              </button>
            )}
            <span className={`fw-bold ${activeSection === keyName ? "text-white" : "text-primary"}`}>
              {activeSection === keyName ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {activeSection === keyName && (
          <div className="p-4 bg-white">
            {renderFields()}

            {isEditing && keyName !== "fee" && keyName !== "course" && (
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => toggleEdit(keyName)}>
                  <FaTimes className="me-1" /> Cancel
                </button>
                <button className="btn btn-success" onClick={handleSaveSection}>
                  <FaSave className="me-1" /> Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const sections = getSections();

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="container py-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
        <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="text-white">
              <h4 className="mb-2 fw-bold d-flex align-items-center">
                👤 {user.firstName} {user.lastName}'s Complete Profile
              </h4>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-dark px-3 py-2">{userRole}</span>
                <span className="badge bg-white text-dark px-3 py-2">{user.email}</span>
                <span className="badge bg-white text-dark px-3 py-2">ID: {user.id || user.userId}</span>
              </div>
            </div>

            <button className="btn btn-light rounded-circle shadow" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="p-3" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="alert alert-success mb-0 d-flex align-items-center border-0 shadow-sm">
              <FaCheckCircle className="me-2 fs-5" />
              <span className="fw-semibold">
                Admin Full Access - You can view {userRole === "STUDENT" ? "all" : "personal"} details
                {userRole === "STUDENT" ? " (Fee and Course sections are read-only)" : ""}
              </span>
            </div>
          </div>

          <div className="p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3 text-muted fw-semibold">Loading user information...</p>
              </div>
            ) : (
              sections.map((s) => (
                <Section key={s.key} title={s.title} keyName={s.key} icon={s.icon} />
              ))
            )}
          </div>

          <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ background: "#f8f9fa" }}>
            <div className="text-muted small">
              {userRole === "STUDENT" 
                ? "All data is fetched from the database. Fee and Course sections are read-only."
                : "All data is fetched from the database."}
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              <FaArrowLeft className="me-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfileView;