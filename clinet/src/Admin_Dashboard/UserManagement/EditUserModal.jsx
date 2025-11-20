// src/Admin_Dashboard/UserManagement/EditUserModal.jsx
import React, { useEffect, useState } from "react";
import { FaTimes, FaEye } from "react-icons/fa";

/**
 * Simple view-only modal that shows basic info for a user.
 * Props: user (object), onClose (fn)
 */
const EditUserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        status: user.status || "active",
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
      <div className="bg-white rounded-4 shadow-lg" style={{ maxWidth: "900px", width: "90%" }}>
        <div className="p-4 border-bottom" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="d-flex justify-content-between align-items-center text-white">
            <h5 className="mb-0 fw-bold d-flex align-items-center"><FaEye className="me-2" /> View Basic Information</h5>
            <button className="btn btn-light rounded-circle shadow" onClick={onClose}><FaTimes /></button>
          </div>
        </div>

        <div className="p-4">
          <div className="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm">
            <i className="bi bi-info-circle me-2 fs-5"></i>
            <span>View-only mode - Basic profile information</span>
          </div>

          <div className="row g-3">
            {[
              { label: "First Name", value: formData.firstName },
              { label: "Last Name", value: formData.lastName },
              { label: "Email", value: formData.email },
              { label: "Phone", value: formData.phone },
              { label: "Role", value: typeof formData.role === "string" ? formData.role : formData.role?.name },
              { label: "Status", value: formData.status }
            ].map((f, i) => (
              <div className="col-md-6" key={i}>
                <label className="form-label fw-semibold text-secondary">{f.label}</label>
                <div className="p-3 bg-light rounded border" style={{ borderRadius: '8px' }}>{f.value || <span className="text-muted">-</span>}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-top d-flex justify-content-end" style={{ background: '#f8f9fa' }}>
          <button className="btn btn-primary shadow" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
