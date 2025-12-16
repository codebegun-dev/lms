 import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ROLE_API = "http://localhost:8080/api/roles";
const PERMISSION_API = "http://localhost:8080/api/permissions";

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermIds, setSelectedPermIds] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const axiosAuth = axios.create({
    baseURL: ROLE_API,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    loadRoles();
    loadPermissions();
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const loadRoles = async () => {
    try {
      const res = await axiosAuth.get("");
      setRoles(res.data);
    } catch {
      showToast("Failed to load roles", "danger");
    }
  };

  const loadPermissions = async () => {
    const res = await axios.get(PERMISSION_API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setPermissions(res.data);
  };

  const resetForm = () => {
    setName("");
    setSelectedPermIds([]);
    setSelectedPermission("");
    setEditingId(null);
  };

  // CREATE / UPDATE ROLE
  const saveRole = async () => {
    if (!name.trim()) {
      showToast("Role name required", "danger");
      return;
    }

    const payload = {
      name: name.trim(),
      description: "",
      permissionIds: selectedPermIds,
    };

    try {
      if (editingId) {
        await axiosAuth.put(`/${editingId}`, payload);
        showToast("Role updated");
      } else {
        await axiosAuth.post("", payload);
        showToast("Role created");
      }
      resetForm();
      loadRoles();
    } catch (e) {
      showToast(e.response?.data?.message || "Permission denied", "danger");
    }
  };

  // EDIT ROLE
  const editRole = (role) => {
    setEditingId(role.id);
    setName(role.name);

    const ids = permissions
      .filter((p) => role.permissions.includes(p.name))
      .map((p) => p.id);

    setSelectedPermIds(ids);
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await axiosAuth.delete(`/${id}`);
      showToast("Role deleted", "warning");
      loadRoles();
      if (editingId === id) resetForm();
    } catch {
      showToast("Delete not allowed", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Manage Roles</h4>

      {/* FORM */}
      <div className="card mb-3">
        <div className="card-body row g-3 align-items-start">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-5">
            {/* NORMAL DROPDOWN */}
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
              >
                <option value="">Select Permission</option>
                {permissions.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={selectedPermIds.includes(p.id)}
                  >
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  if (!selectedPermission) return;
                  setSelectedPermIds((prev) => [
                    ...prev,
                    Number(selectedPermission),
                  ]);
                  setSelectedPermission("");
                }}
              >
                Add
              </button>
            </div>

            {/* SELECTED PERMISSIONS */}
            <div className="mt-2">
              {permissions
                .filter((p) => selectedPermIds.includes(p.id))
                .map((p) => (
                  <span key={p.id} className="badge bg-primary me-2">
                    {p.name}
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm ms-2"
                      onClick={() =>
                        setSelectedPermIds((prev) =>
                          prev.filter((id) => id !== p.id)
                        )
                      }
                    ></button>
                  </span>
                ))}
            </div>
          </div>

          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={saveRole}>
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROLE LIST */}
      <div className="list-group">
        {roles.length === 0 && (
          <div className="text-muted">No roles found</div>
        )}
        {roles.map((r) => (
          <div
            key={r.id}
            className="list-group-item d-flex justify-content-between"
          >
            <div>
              <div className="fw-bold">{r.name}</div>
              <div className="mt-1">
                {r.permissions?.map((p, i) => (
                  <span key={i} className="badge bg-secondary me-1">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="btn-group">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => editRole(r)}
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteRole(r.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div className={`alert alert-${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;
