// src/Admin_Dashboard/UserManagement/UserRow.jsx
import React from "react";
import { FaEdit, FaEye, FaTrash, FaBan, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const normalizeRoleName = (role) => {
  if (!role) return "";
  return typeof role === "string" ? role : role.name || "";
};

const UserRow = ({ user, onEditFullProfile, onViewBasicInfo, onDelete, onToggleStatus, canPerformAction }) => {
  const roleName = normalizeRoleName(user.role);
  const isStudent = roleName?.toUpperCase() === "STUDENT";
  const protectedAction = !canPerformAction();

  return (
    <tr key={user.id} style={{ transition: "all 0.3s ease" }}>
      <td className="fw-semibold ps-4 align-middle">
        <span className="badge bg-light text-dark px-3 py-2">{user.id}</span>
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-gradient d-flex align-items-center justify-content-center me-2"
               style={{
                 width: "35px",
                 height: "35px",
                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                 color: "white",
                 fontWeight: "bold"
               }}>
            {String(user.firstName?.charAt(0) || "?")}{String(user.lastName?.charAt(0) || "")}
          </div>
          <span className="fw-semibold">{user.firstName} {user.lastName}</span>
        </div>
      </td>
      <td className="align-middle text-secondary">{user.email}</td>
      <td className="align-middle text-secondary">{user.phone}</td>
      <td className="align-middle">
        <span className={`badge px-3 py-2 ${
          roleName === "ADMIN" ? "bg-danger" : roleName === "INTERVIEWER" ? "bg-warning text-dark" : "bg-info text-dark"
        }`} style={{ borderRadius: "20px" }}>
          {roleName}
        </span>
      </td>
      <td className="align-middle">
        <span className={`badge px-3 py-2 ${user.status === "active" ? "bg-success" : "bg-secondary"}`} style={{ borderRadius: "20px" }}>
          {user.status === "active" ? <><FaCheckCircle className="me-1" /> Active</> : <><FaTimesCircle className="me-1" /> Inactive</>}
        </span>
      </td>
      <td className="align-middle text-center pe-4">
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-sm shadow-sm" onClick={onEditFullProfile} title="Edit Full Profile" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: "8px", border: "none" }}>
            <FaEdit />
          </button>

          {isStudent && (
            <button className="btn btn-sm btn-warning shadow-sm" onClick={onViewBasicInfo} title="View Basic Info" style={{ borderRadius: "8px" }}>
              <FaEye />
            </button>
          )}

          {protectedAction ? (
            <span className="badge bg-warning text-dark px-3 py-2 d-flex align-items-center" style={{ borderRadius: "20px" }}>
              Protected
            </span>
          ) : (
            <>
              <button className={`btn btn-sm shadow-sm ${user.status === "active" ? "btn-outline-secondary" : "btn-outline-success"}`} onClick={onToggleStatus} title={user.status === "active" ? "Deactivate User" : "Activate User"} style={{ borderRadius: "8px" }}>
                <FaBan />
              </button>

              <button className="btn btn-sm btn-outline-danger shadow-sm" onClick={onDelete} title="Delete User" style={{ borderRadius: "8px" }}>
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
