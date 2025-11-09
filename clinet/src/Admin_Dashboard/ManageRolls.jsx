// ✅ ManageRoles.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const STORAGE_KEY = "roles";

const parsePermissions = (txt) => {
  if (!txt) return [];
  return txt
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
};

const stringifyPermissions = (arr) => (arr && arr.length ? arr.join(", ") : "");

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [permsText, setPermsText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null); // { text, variant }
  const dismissRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRoles(JSON.parse(raw));
      else {
        const seed = [
          { id: 1, name: "Admin", permissions: ["CourseManagement", "BatchManagement", "UserManagement", "QuestionBank"] },
          { id: 2, name: "Instructor", permissions: ["CourseManagement", "QuestionBank"] }
        ];
        setRoles(seed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (e) {
      console.error("Failed to load roles", e);
    }
  }, []);

  const persist = (next) => {
    setRoles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showMessage("Please enter a role name", "danger");
      return;
    }

    let permissions = parsePermissions(permsText);

    if (trimmed.toLowerCase() === "instructor") {
      permissions = permissions.filter((p) => p !== "BatchManagement");
    }

    if (editingId) {
      persist(roles.map((r) => (r.id === editingId ? { ...r, name: trimmed, permissions } : r)));
      resetForm();
      showMessage("Role updated", "success");
      return;
    }

    const nextId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    persist([...roles, { id: nextId, name: trimmed, permissions }]);
    resetForm();
    showMessage("Role created", "success");
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setPermsText(stringifyPermissions(role.permissions));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this role?")) return;
    persist(roles.filter((r) => r.id !== id));
    if (editingId === id) resetForm();
    showMessage("Role deleted", "warning");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Manage Roles</h2>

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

      <div>
        {roles.length === 0 && <div className="text-muted">No roles yet.</div>}

        <div className="list-group">
          {roles.map((r) => (
            <div key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{r.name}</div>
                <div className="mt-1">
                  {r.permissions.length ? (
                    r.permissions.map((p, i) => (
                      <span key={i} className="badge bg-secondary me-1">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">No permissions</span>
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
