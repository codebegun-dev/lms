import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = "http://localhost:8080/api/roles"; // Change if needed

// 👇 convert "Permission1, Permission2" → ["Permission1", "Permission2"]
const parsePermissions = (txt) => {
  if (!txt) return [];
  return txt
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
};

// 👇 convert ["P1","P2"] → "P1, P2"
const stringifyPermissions = (arr) => (arr && arr.length ? arr.join(", ") : "");

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [permsText, setPermsText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const dismissRef = useRef(null);

  // ✅ Load roles from backend
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setRoles(res.data);
    } catch (e) {
      showMessage("Failed to load roles", "danger");
      console.error(e);
    }
  };

  const resetForm = () => {
    setName("");
    setPermsText("");
    setEditingId(null);
  };

  const showMessage = (text, variant = "success", timeout = 3000) => {
    setMessage({ text, variant });
    if (dismissRef.current) clearTimeout(dismissRef.current);
    dismissRef.current = setTimeout(() => setMessage(null), timeout);
  };

  // ✅ Create OR Update role
  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showMessage("Please enter a role name", "danger");
      return;
    }

    const permissions = parsePermissions(permsText);

    // ✅ Get masterAdminId from localStorage
    const masterAdminId = localStorage.getItem("masterAdminId");
    if (!masterAdminId) {
      showMessage("Master Admin not found. Please login as Master Admin.", "danger");
      return;
    }

    const payload = {
      name: trimmed,
      permissions,
      adminAuthId: parseInt(masterAdminId), // Send adminId for create/update
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, payload);
        showMessage("Role updated successfully", "success");
      } else {
        await axios.post(BASE_URL, payload);
        showMessage("Role created successfully", "success");
      }

      resetForm();
      fetchRoles();
    } catch (e) {
      showMessage(e.response?.data?.message || "Failed to save role", "danger");
      console.error(e);
    }
  };

  // ✅ Edit role
  const handleEdit = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setPermsText(stringifyPermissions(role.permissions));
  };

  // ✅ Delete role (no admin required)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchRoles();
      showMessage("Role deleted successfully", "warning");
      if (editingId === id) resetForm();
    } catch (e) {
      showMessage(e.response?.data?.message || "Failed to delete role", "danger");
      console.error(e);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Manage Roles</h2>

      {/* Create / Edit Form */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-sm-4">
              <input
                className="form-control"
                placeholder="Role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-sm-5">
              <input
                className="form-control"
                placeholder="Permissions (comma separated)"
                value={permsText}
                onChange={(e) => setPermsText(e.target.value)}
              />
            </div>

            <div className="col-sm-3 d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSave}>
                {editingId ? "Save" : "Create Role"}
              </button>

              {editingId && (
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Display roles */}
      <div>
        {roles.length === 0 && <div className="text-muted">No roles found.</div>}

        <div className="list-group">
          {roles.map((r) => (
            <div key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{r.name}</div>
                <div className="mt-1">
                  {r.permissions?.length ? (
                    r.permissions.map((p, i) => (
                      <span key={i} className="badge bg-secondary me-1">{p}</span>
                    ))
                  ) : (
                    <span className="text-muted small">No Permissions</span>
                  )}
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary d-flex align-items-center" onClick={() => handleEdit(r)}>
                  <FaEdit className="me-1" /> Edit
                </button>
                <button className="btn btn-sm btn-outline-danger d-flex align-items-center" onClick={() => handleDelete(r.id)}>
                  <FaTrash className="me-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Toast */}
      {message && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1060 }}>
          <div className={`alert alert-${message.variant} shadow`} role="alert">
            {message.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;