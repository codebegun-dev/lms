// src/Admin_Dashboard/UserManagement/AdminUserProfileView.jsx
import React, { useEffect, useState } from "react";
import { FaTimes, FaArrowLeft, FaSave, FaEdit, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

/**
 * Full profile view — stores section data in localStorage per user.
 * Props: user (object), onClose (fn)
 */
const AdminUserProfileView = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);

  const sections = [
    { key: "personal", title: "Personal Information", storageKey: `user_${user.id}_personalInfo`, icon: "👤" },
    { key: "generic", title: "Generic Details", storageKey: `user_${user.id}_genericInfo`, icon: "📋" },
    { key: "tenth", title: "10th Grade", storageKey: `user_${user.id}_tenthGrade`, icon: "🎓" },
    { key: "twelfth", title: "12th Grade", storageKey: `user_${user.id}_twelfthGrade`, icon: "📚" },
    { key: "ug", title: "UG Details", storageKey: `user_${user.id}_ugDetails`, icon: "🎯" },
    { key: "pg", title: "PG Details", storageKey: `user_${user.id}_pgDetails`, icon: "🏆" },
    { key: "course", title: "Course Details", storageKey: `user_${user.id}_courseDetails`, icon: "📖" },
    { key: "projects", title: "Projects", storageKey: `user_${user.id}_projects`, icon: "💼" },
    { key: "fee", title: "Fee Details", storageKey: `user_${user.id}_feeDetails`, icon: "💰" },
  ];

  useEffect(() => {
    loadAllSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllSections = () => {
    try {
      setLoading(true);
      const loaded = {};
      sections.forEach((s) => {
        const raw = localStorage.getItem(s.storageKey);
        loaded[s.key] = raw ? JSON.parse(raw) : {};
      });
      setSectionData(loaded);
    } catch (err) {
      console.error("Error loading sections", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (key) => setEditMode((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = (key, storageKey, data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setSectionData((p) => ({ ...p, [key]: data }));
      setEditMode((p) => ({ ...p, [key]: false }));
      alert("Changes saved");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save");
    }
  };

  const Section = ({ title, keyName, storageKey, icon }) => {
    const isEditing = !!editMode[keyName];
    const [formState, setFormState] = useState(sectionData[keyName] || {});

    useEffect(() => setFormState(sectionData[keyName] || {}), [sectionData, keyName]);

    const handleChange = (field, value) => setFormState((p) => ({ ...p, [field]: value }));

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
              <button className={`btn btn-sm ${isEditing ? "btn-light" : "btn-outline-light"}`} onClick={(e) => { e.stopPropagation(); toggleEdit(keyName); }}>
                {isEditing ? <><FaTimes className="me-1" /> Cancel</> : <><FaEdit className="me-1" /> Edit</>}
              </button>
            )}
            <span className={`fw-bold ${activeSection === keyName ? "text-white" : "text-primary"}`}>{activeSection === keyName ? "▲" : "▼"}</span>
          </div>
        </div>

        {activeSection === keyName && (
          <div className="p-4 bg-white">
            {Object.keys(formState).length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
                <p className="text-muted mb-0 mt-2">No data available</p>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {Object.entries(formState).map(([k, v]) => (
                    <div className="col-md-6" key={k}>
                      <label className="form-label fw-semibold text-secondary small text-capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</label>
                      {isEditing ? (
                        <input type="text" className="form-control" value={formState[k] || ""} onChange={(e) => handleChange(k, e.target.value)} />
                      ) : (
                        <div className="p-2 bg-light rounded border" style={{ minHeight: "38px" }}>{v || <span className="text-muted">-</span>}</div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-4 d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={() => toggleEdit(keyName)}><FaTimes className="me-1" /> Cancel</button>
                    <button className="btn btn-success" onClick={() => handleSave(keyName, storageKey, formState)}><FaSave className="me-1" /> Save Changes</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="container py-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
        <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="text-white">
              <h4 className="mb-2 fw-bold d-flex align-items-center">👤 {user.firstName} {user.lastName}'s Complete Profile</h4>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-dark px-3 py-2">{typeof user.role === "string" ? user.role : user.role?.name}</span>
                <span className="badge bg-white text-dark px-3 py-2">{user.email}</span>
                <span className="badge bg-white text-dark px-3 py-2">ID: {user.id}</span>
              </div>
            </div>

            <button className="btn btn-light rounded-circle shadow" onClick={onClose}><FaTimes /></button>
          </div>

          <div className="p-3" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="alert alert-success mb-0 d-flex align-items-center border-0 shadow-sm">
              <FaCheckCircle className="me-2 fs-5" />
              <span className="fw-semibold">Admin Full Access - You can view and edit all sections</span>
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
                <Section key={s.key} title={s.title} keyName={s.key} storageKey={s.storageKey} icon={s.icon} />
              ))
            )}
          </div>

          <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ background: "#f8f9fa" }}>
            <div className="text-muted small">All changes are saved in localStorage</div>
            <button className="btn btn-primary" onClick={onClose}><FaArrowLeft className="me-2" /> Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfileView;
