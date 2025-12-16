// // // // import React, { useEffect, useState } from "react";
// // // // import axios from "axios";
// // // // import { FaUserPlus, FaFilter } from "react-icons/fa";

// // // // import UserTable from "./UserTable";
// // // // import AddUserForm from "./AddUserForm";
// // // // import EditUserModal from "./EditUserModal";
// // // // import ConfirmModal from "./ConfirmModal";
// // // // import AdminUserProfileView from "./AdminUserProfileView";

// // // // const API_BASE = "http://localhost:8080";

// // // // const normalizeRoleName = (role) => {
// // // //   if (!role) return "";
// // // //   return typeof role === "string" ? role : role.name || "";
// // // // };

// // // // const UserManagement = () => {
// // // //   const [users, setUsers] = useState([]);
// // // //   const [roles, setRoles] = useState([]);
// // // //   const [loadingUsers, setLoadingUsers] = useState(true);
// // // //   const [loadingRoles, setLoadingRoles] = useState(true);

// // // //   const [showAddUserForm, setShowAddUserForm] = useState(false);
// // // //   const [showFullProfileModal, setShowFullProfileModal] = useState(false);
// // // //   const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
// // // //   const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });

// // // //   const [selectedUser, setSelectedUser] = useState(null);
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [filterRole, setFilterRole] = useState("All");
// // // //   const [currentUser, setCurrentUser] = useState(null);

// // // //   useEffect(() => {
// // // //     loadCurrentUser();
// // // //     loadRoles();
// // // //     loadUsers();
// // // //   }, []);

// // // //   const loadCurrentUser = () => {
// // // //     try {
// // // //       const u = JSON.parse(localStorage.getItem("user") || "{}");
// // // //       setCurrentUser(u);
// // // //     } catch (err) {
// // // //       setCurrentUser(null);
// // // //     }
// // // //   };

// // // //   const loadRoles = async () => {
// // // //     try {
// // // //       setLoadingRoles(true);
// // // //       const res = await axios.get(`${API_BASE}/api/roles`);
// // // //       // Expecting array of { id, name }
// // // //       setRoles(res.data || []);
// // // //     } catch (err) {
// // // //       console.error("Failed to load roles", err);
// // // //       setRoles([]);
// // // //     } finally {
// // // //       setLoadingRoles(false);
// // // //     }
// // // //   };

// // // //   const loadUsers = async () => {
// // // //     try {
// // // //       setLoadingUsers(true);
// // // //       const res = await axios.get(`${API_BASE}/api/user/all`);
// // // //       const mapped = (res.data || []).map((u) => ({
// // // //         id: u.userId ?? u.id ?? null,
// // // //         firstName: u.firstName ?? "",
// // // //         lastName: u.lastName ?? "",
// // // //         email: u.email ?? "",
// // // //         phone: u.phone ?? "",
// // // //         role: u.role ?? (u.roleName ?? ""),
// // // //         status: (u.status ?? "active").toLowerCase(),
// // // //         raw: u,
// // // //       }));
// // // //       setUsers(mapped);
// // // //     } catch (err) {
// // // //       console.error("Failed to load users", err);
// // // //       setUsers([]);
// // // //     } finally {
// // // //       setLoadingUsers(false);
// // // //     }
// // // //   };

// // // //   // Filtering (frontend-only)
// // // //   const filteredUsers = users.filter((user) => {
// // // //     const q = searchTerm.trim().toLowerCase();
// // // //     const matchesSearch =
// // // //       !q ||
// // // //       (user.firstName && user.firstName.toLowerCase().includes(q)) ||
// // // //       (user.lastName && user.lastName.toLowerCase().includes(q)) ||
// // // //       (user.email && user.email.toLowerCase().includes(q)) ||
// // // //       (user.phone && user.phone.toLowerCase().includes(q));

// // // //     const roleName = normalizeRoleName(user.role).toUpperCase();
// // // //     const matchesRole = filterRole === "All" || roleName === filterRole;

// // // //     return matchesSearch && matchesRole;
// // // //   });

// // // //   const handleOpenAdd = () => setShowAddUserForm(true);
// // // //   const handleCloseAdd = () => setShowAddUserForm(false);

// // // //   const handleAddSuccess = async () => {
// // // //     await loadUsers();
// // // //     setShowAddUserForm(false);
// // // //   };

// // // //   const handleOpenFullProfile = (user) => {
// // // //     setSelectedUser(user.raw || user);
// // // //     setShowFullProfileModal(true);
// // // //   };

// // // //   const handleOpenBasicInfo = (user) => {
// // // //     setSelectedUser(user.raw || user);
// // // //     setShowBasicInfoModal(true);
// // // //   };

// // // //   const canPerformAction = (targetUser) => {
// // // //     // Prevent current admin from modifying their own admin account (front-end safeguard)
// // // //     const currentId = currentUser?.userId ?? currentUser?.id;
// // // //     const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
// // // //     const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
// // // //     if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
// // // //       return false;
// // // //     }
// // // //     return true;
// // // //   };

// // // //   const askDelete = (user) => {
// // // //     if (!canPerformAction(user)) {
// // // //       alert("Protected action: cannot delete your own admin account.");
// // // //       return;
// // // //     }
// // // //     setConfirmState({ open: true, type: "delete", payload: user });
// // // //   };

// // // //   const askToggleStatus = (user) => {
// // // //     if (!canPerformAction(user)) {
// // // //       alert("Protected action: cannot change your own admin account status.");
// // // //       return;
// // // //     }
// // // //     setConfirmState({ open: true, type: "toggleStatus", payload: user });
// // // //   };

// // // //   const performConfirm = async () => {
// // // //   const { type, payload } = confirmState;
// // // //   if (!payload) return;

// // // //   try {
// // // //     // DELETE USER
// // // //     if (type === "delete") {
// // // //       await axios.delete(`${API_BASE}/api/user/delete/${payload.id}`);
// // // //       await loadUsers();
// // // //       alert("User deleted successfully");

// // // //     // ACTIVATE / DEACTIVATE USER
// // // //     } else if (type === "toggleStatus") {
// // // //       if (payload.status === "active") {
// // // //         await axios.delete(`${API_BASE}/api/user/deactivate/${payload.id}`);
// // // //         alert("User deactivated successfully");
// // // //       } else {
// // // //         await axios.put(`${API_BASE}/api/user/activate/${payload.id}`);
// // // //         alert("User activated successfully");
// // // //       }

// // // //       await loadUsers();
// // // //     }

// // // //   } catch (err) {
// // // //     console.error("Confirm action failed", err);
// // // //     alert("Action failed: " + (err.response?.data?.message || err.message));
// // // //   } finally {
// // // //     setConfirmState({ open: false, type: "", payload: null });
// // // //   }
// // // // };

// // // //   return (
// // // //     <div className="container my-4">
// // // //       <div className="bg-white rounded-4 shadow-lg p-4">
// // // //         <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
// // // //           <div>
// // // //             <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
// // // //               <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
// // // //               User Management System
// // // //             </h2>
// // // //             <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
// // // //           </div>

// // // //           {!showAddUserForm && (
// // // //             <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
// // // //               <FaUserPlus className="me-2" /> Add New User
// // // //             </button>
// // // //           )}
// // // //         </div>

// // // //         {/* AddUserForm */}
// // // //         {showAddUserForm ? (
// // // //           <AddUserForm
// // // //             onClose={handleCloseAdd}
// // // //             onSuccess={handleAddSuccess}
// // // //             roles={roles}
// // // //             loadingRoles={loadingRoles}
// // // //             apiBase={API_BASE}
// // // //           />
// // // //         ) : (
// // // //           <>
// // // //             {/* Controls */}
// // // //             <div className="row g-3 mb-4">
// // // //               <div className="col-md-5">
// // // //                 <div className="input-group shadow-sm">
// // // //                   <span className="input-group-text border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
// // // //                     <i className="bi bi-search"></i>
// // // //                   </span>
// // // //                   <input
// // // //                     type="text"
// // // //                     className="form-control border-0"
// // // //                     placeholder="Search by name, email, phone..."
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                     style={{ borderRadius: '0 8px 8px 0' }}
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="col-md-3">
// // // //                 <div className="input-group shadow-sm">
// // // //                   <span className="input-group-text border-0 bg-light">
// // // //                     <FaFilter />
// // // //                   </span>
// // // //                   <select
// // // //                     className="form-select border-0"
// // // //                     value={filterRole}
// // // //                     onChange={(e) => setFilterRole(e.target.value)}
// // // //                     style={{ borderRadius: '0 8px 8px 0' }}
// // // //                   >
// // // //                     <option value="All">All Roles</option>
// // // //                     {/* dynamic roles (from backend) */}
// // // //                     {roles.map((r) => (
// // // //                       <option key={r.id} value={r.name?.toUpperCase()}>
// // // //                         {r.name}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="col-md-4">
// // // //                 <button className="btn btn-outline-primary w-100 shadow-sm d-flex align-items-center justify-content-center" onClick={loadUsers} style={{ borderRadius: '8px' }}>
// // // //                   <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             {/* Table */}
// // // //             <UserTable
// // // //               users={filteredUsers}
// // // //               loading={loadingUsers}
// // // //               onEditFullProfile={handleOpenFullProfile}
// // // //               onViewBasicInfo={handleOpenBasicInfo}
// // // //               onDelete={askDelete}
// // // //               onToggleStatus={askToggleStatus}
// // // //               canPerformAction={canPerformAction}
// // // //             />
// // // //           </>
// // // //         )}
// // // //       </div>

// // // //       {/* Modals */}
// // // //       {showFullProfileModal && selectedUser && (
// // // //         <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
// // // //       )}

// // // //       {showBasicInfoModal && selectedUser && (
// // // //         <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
// // // //       )}

// // // //       <ConfirmModal
// // // //         open={confirmState.open}
// // // //         title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
// // // //         message={
// // // //           confirmState.type === "delete"
// // // //             ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// // // //             : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// // // //         }
// // // //         onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
// // // //         onConfirm={performConfirm}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default UserManagement;




// // // // src/Admin_Dashboard/UserManagement/UserManagement.jsx
// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import { FaUserPlus, FaFilter } from "react-icons/fa";

// // // import UserTable from "./UserTable";
// // // import AddUserForm from "./AddUserForm";
// // // import EditUserModal from "./EditUserModal";
// // // import ConfirmModal from "./ConfirmModal";
// // // import AdminUserProfileView from "./AdminUserProfileView";

// // // const API_BASE = "http://localhost:8080";

// // // // Utility to normalize role names
// // // const normalizeRoleName = (role) => {
// // //   if (!role) return "";
// // //   return typeof role === "string" ? role : role.name || "";
// // // };

// // // const UserManagement = () => {
// // //   const [users, setUsers] = useState([]);
// // //   const [roles, setRoles] = useState([]);
// // //   const [loadingUsers, setLoadingUsers] = useState(true);
// // //   const [loadingRoles, setLoadingRoles] = useState(true);

// // //   const [showAddUserForm, setShowAddUserForm] = useState(false);
// // //   const [showFullProfileModal, setShowFullProfileModal] = useState(false);
// // //   const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
// // //   const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });

// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [filterRole, setFilterRole] = useState("All");
// // //   const [currentUser, setCurrentUser] = useState(null);

// // //   // JWT token
// // //   const token = localStorage.getItem("token");

// // //   useEffect(() => {
// // //     loadCurrentUser();
// // //     loadRoles();
// // //     loadUsers();
// // //   }, []);

// // //   const loadCurrentUser = () => {
// // //     try {
// // //       const u = JSON.parse(localStorage.getItem("user") || "{}");
// // //       setCurrentUser(u);
// // //     } catch {
// // //       setCurrentUser(null);
// // //     }
// // //   };

// // //   // Fetch Roles with token
// // //   const loadRoles = async () => {
// // //     try {
// // //       setLoadingRoles(true);
// // //       const res = await axios.get(`${API_BASE}/api/roles`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setRoles(res.data || []);
// // //     } catch (err) {
// // //       console.error("Failed to load roles", err);
// // //       setRoles([]);
// // //     } finally {
// // //       setLoadingRoles(false);
// // //     }
// // //   };

// // //   // Fetch Users with token
// // //   const loadUsers = async () => {
// // //     try {
// // //       setLoadingUsers(true);
// // //       const res = await axios.get(`${API_BASE}/api/user/all`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       const mapped = (res.data || []).map((u) => ({
// // //         id: u.userId ?? u.id ?? null,
// // //         firstName: u.firstName ?? "",
// // //         lastName: u.lastName ?? "",
// // //         email: u.email ?? "",
// // //         phone: u.phone ?? "",
// // //         role: u.role ?? (u.roleName ?? ""),
// // //         status: (u.status ?? "active").toLowerCase(),
// // //         raw: u,
// // //       }));
// // //       setUsers(mapped);
// // //     } catch (err) {
// // //       console.error("Failed to load users", err);
// // //       setUsers([]);
// // //     } finally {
// // //       setLoadingUsers(false);
// // //     }
// // //   };

// // //   // Filtering
// // //   const filteredUsers = users.filter((user) => {
// // //     const q = searchTerm.trim().toLowerCase();
// // //     const matchesSearch =
// // //       !q ||
// // //       (user.firstName && user.firstName.toLowerCase().includes(q)) ||
// // //       (user.lastName && user.lastName.toLowerCase().includes(q)) ||
// // //       (user.email && user.email.toLowerCase().includes(q)) ||
// // //       (user.phone && user.phone.toLowerCase().includes(q));

// // //     const roleName = normalizeRoleName(user.role).toUpperCase();
// // //     const matchesRole = filterRole === "All" || roleName === filterRole;

// // //     return matchesSearch && matchesRole;
// // //   });

// // //   const handleOpenAdd = () => setShowAddUserForm(true);
// // //   const handleCloseAdd = () => setShowAddUserForm(false);

// // //   const handleAddSuccess = async () => {
// // //     await loadUsers();
// // //     setShowAddUserForm(false);
// // //   };

// // //   const handleOpenFullProfile = (user) => {
// // //     setSelectedUser(user.raw || user);
// // //     setShowFullProfileModal(true);
// // //   };

// // //   const handleOpenBasicInfo = (user) => {
// // //     setSelectedUser(user.raw || user);
// // //     setShowBasicInfoModal(true);
// // //   };

// // //   const canPerformAction = (targetUser) => {
// // //     const currentId = currentUser?.userId ?? currentUser?.id;
// // //     const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
// // //     const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
// // //     if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
// // //       return false;
// // //     }
// // //     return true;
// // //   };

// // //   const askDelete = (user) => {
// // //     if (!canPerformAction(user)) {
// // //       alert("Protected action: cannot delete your own admin account.");
// // //       return;
// // //     }
// // //     setConfirmState({ open: true, type: "delete", payload: user });
// // //   };

// // //   const askToggleStatus = (user) => {
// // //     if (!canPerformAction(user)) {
// // //       alert("Protected action: cannot change your own admin account status.");
// // //       return;
// // //     }
// // //     setConfirmState({ open: true, type: "toggleStatus", payload: user });
// // //   };

// // //   const performConfirm = async () => {
// // //     const { type, payload } = confirmState;
// // //     if (!payload) return;

// // //     try {
// // //       if (type === "delete") {
// // //         await axios.delete(`${API_BASE}/api/user/delete/${payload.id}`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         await loadUsers();
// // //         alert("User deleted successfully");
// // //       } else if (type === "toggleStatus") {
// // //         if (payload.status === "active") {
// // //           await axios.delete(`${API_BASE}/api/user/deactivate/${payload.id}`, {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           });
// // //           alert("User deactivated successfully");
// // //         } else {
// // //           await axios.put(`${API_BASE}/api/user/activate/${payload.id}`, null, {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           });
// // //           alert("User activated successfully");
// // //         }
// // //         await loadUsers();
// // //       }
// // //     } catch (err) {
// // //       console.error("Confirm action failed", err);
// // //       alert("Action failed: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setConfirmState({ open: false, type: "", payload: null });
// // //     }
// // //   };

// // //   return (
// // //     <div className="container my-4">
// // //       <div className="bg-white rounded-4 shadow-lg p-4">
// // //         <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
// // //           <div>
// // //             <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
// // //               <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
// // //               User Management System
// // //             </h2>
// // //             <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
// // //           </div>

// // //           {!showAddUserForm && (
// // //             <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
// // //               <FaUserPlus className="me-2" /> Add New User
// // //             </button>
// // //           )}
// // //         </div>

// // //         {showAddUserForm ? (
// // //           <AddUserForm
// // //             onClose={handleCloseAdd}
// // //             onSuccess={handleAddSuccess}
// // //             roles={roles}
// // //             loadingRoles={loadingRoles}
// // //             apiBase={API_BASE}
// // //           />
// // //         ) : (
// // //           <>
// // //             <div className="row g-3 mb-4">
// // //               <div className="col-md-5">
// // //                 <input
// // //                   type="text"
// // //                   className="form-control shadow-sm"
// // //                   placeholder="Search by name, email, phone..."
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                 />
// // //               </div>

// // //               <div className="col-md-3">
// // //                 <select
// // //                   className="form-select shadow-sm"
// // //                   value={filterRole}
// // //                   onChange={(e) => setFilterRole(e.target.value)}
// // //                 >
// // //                   <option value="All">All Roles</option>
// // //                   {roles.map((r) => (
// // //                     <option key={r.id} value={r.name?.toUpperCase()}>{r.name}</option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               <div className="col-md-4">
// // //                 <button className="btn btn-outline-primary w-100 shadow-sm" onClick={loadUsers}>
// // //                   Refresh Data
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <UserTable
// // //               users={filteredUsers}
// // //               loading={loadingUsers}
// // //               onEditFullProfile={handleOpenFullProfile}
// // //               onViewBasicInfo={handleOpenBasicInfo}
// // //               onDelete={askDelete}
// // //               onToggleStatus={askToggleStatus}
// // //               canPerformAction={canPerformAction}
// // //             />
// // //           </>
// // //         )}
// // //       </div>

// // //       {showFullProfileModal && selectedUser && (
// // //         <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
// // //       )}

// // //       {showBasicInfoModal && selectedUser && (
// // //         <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
// // //       )}

// // //       <ConfirmModal
// // //         open={confirmState.open}
// // //         title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
// // //         message={
// // //           confirmState.type === "delete"
// // //             ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// // //             : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// // //         }
// // //         onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
// // //         onConfirm={performConfirm}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default UserManagement;




// // // src/Admin_Dashboard/UserManagement/UserManagement.jsx
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { FaUserPlus, FaFilter } from "react-icons/fa";

// // import UserTable from "./UserTable";
// // import AddUserForm from "./AddUserForm";
// // import EditUserModal from "./EditUserModal";
// // import ConfirmModal from "./ConfirmModal";
// // import AdminUserProfileView from "./AdminUserProfileView";

// // const API_BASE = "http://localhost:8080";

// // // Utility to normalize role names
// // const normalizeRoleName = (role) => {
// //   if (!role) return "";
// //   return typeof role === "string" ? role : role.name || "";
// // };

// // const UserManagement = () => {
// //   const [users, setUsers] = useState([]);
// //   const [roles, setRoles] = useState([]);
// //   const [loadingUsers, setLoadingUsers] = useState(true);
// //   const [loadingRoles, setLoadingRoles] = useState(true);

// //   const [showAddUserForm, setShowAddUserForm] = useState(false);
// //   const [showFullProfileModal, setShowFullProfileModal] = useState(false);
// //   const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
// //   const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });

// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterRole, setFilterRole] = useState("All");
// //   const [currentUser, setCurrentUser] = useState(null);

// //   // JWT token
// //   const token = localStorage.getItem("token");

// //   useEffect(() => {
// //     loadCurrentUser();
// //     loadRoles();
// //     loadUsers();
// //   }, []);

// //   const loadCurrentUser = () => {
// //     try {
// //       const u = JSON.parse(localStorage.getItem("user") || "{}");
// //       setCurrentUser(u);
// //     } catch {
// //       setCurrentUser(null);
// //     }
// //   };

// //   // Fetch Roles with token - FIXED ENDPOINT
// //   const loadRoles = async () => {
// //     try {
// //       setLoadingRoles(true);
// //       const res = await axios.get(`${API_BASE}/api/roles`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setRoles(res.data || []);
// //     } catch (err) {
// //       console.error("Failed to load roles", err);
// //       setRoles([]);
// //     } finally {
// //       setLoadingRoles(false);
// //     }
// //   };

// //   // Fetch Users with token - FIXED ENDPOINT to /api/users
// //   const loadUsers = async () => {
// //     try {
// //       setLoadingUsers(true);
// //       const res = await axios.get(`${API_BASE}/api/users`, {  // Changed from /api/user/all to /api/users
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       const mapped = (res.data || []).map((u) => ({
// //         id: u.userId ?? u.id ?? null,
// //         firstName: u.firstName ?? "",
// //         lastName: u.lastName ?? "",
// //         email: u.email ?? "",
// //         phone: u.phone ?? "",
// //         role: u.role ?? (u.roleName ?? ""),
// //         status: (u.status ?? "active").toLowerCase(),
// //         raw: u,
// //       }));
// //       setUsers(mapped);
// //     } catch (err) {
// //       console.error("Failed to load users", err);
// //       setUsers([]);
// //     } finally {
// //       setLoadingUsers(false);
// //     }
// //   };

// //   // Filtering
// //   const filteredUsers = users.filter((user) => {
// //     const q = searchTerm.trim().toLowerCase();
// //     const matchesSearch =
// //       !q ||
// //       (user.firstName && user.firstName.toLowerCase().includes(q)) ||
// //       (user.lastName && user.lastName.toLowerCase().includes(q)) ||
// //       (user.email && user.email.toLowerCase().includes(q)) ||
// //       (user.phone && user.phone.toLowerCase().includes(q));

// //     const roleName = normalizeRoleName(user.role).toUpperCase();
// //     const matchesRole = filterRole === "All" || roleName === filterRole;

// //     return matchesSearch && matchesRole;
// //   });

// //   const handleOpenAdd = () => setShowAddUserForm(true);
// //   const handleCloseAdd = () => setShowAddUserForm(false);

// //   const handleAddSuccess = async () => {
// //     await loadUsers();
// //     setShowAddUserForm(false);
// //   };

// //   const handleOpenFullProfile = (user) => {
// //     setSelectedUser(user.raw || user);
// //     setShowFullProfileModal(true);
// //   };

// //   const handleOpenBasicInfo = (user) => {
// //     setSelectedUser(user.raw || user);
// //     setShowBasicInfoModal(true);
// //   };

// //   const canPerformAction = (targetUser) => {
// //     const currentId = currentUser?.userId ?? currentUser?.id;
// //     const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
// //     const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
// //     if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
// //       return false;
// //     }
// //     return true;
// //   };

// //   const askDelete = (user) => {
// //     if (!canPerformAction(user)) {
// //       alert("Protected action: cannot delete your own admin account.");
// //       return;
// //     }
// //     setConfirmState({ open: true, type: "delete", payload: user });
// //   };

// //   const askToggleStatus = (user) => {
// //     if (!canPerformAction(user)) {
// //       alert("Protected action: cannot change your own admin account status.");
// //       return;
// //     }
// //     setConfirmState({ open: true, type: "toggleStatus", payload: user });
// //   };

// //   const performConfirm = async () => {
// //     const { type, payload } = confirmState;
// //     if (!payload) return;

// //     try {
// //       if (type === "delete") {
// //         // FIXED ENDPOINT: Changed from /api/user/delete to /api/users/{id}
// //         await axios.delete(`${API_BASE}/api/users/${payload.id}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         await loadUsers();
// //         alert("User deleted successfully");
// //       } else if (type === "toggleStatus") {
// //         if (payload.status === "active") {
// //           // FIXED ENDPOINT: Changed from /api/user/deactivate to /api/users/{id}/deactivate
// //           await axios.put(`${API_BASE}/api/users/${payload.id}/deactivate`, null, {
// //             headers: { Authorization: `Bearer ${token}` },
// //           });
// //           alert("User deactivated successfully");
// //         } else {
// //           // FIXED ENDPOINT: Changed from /api/user/activate to /api/users/{id}/activate
// //           await axios.put(`${API_BASE}/api/users/${payload.id}/activate`, null, {
// //             headers: { Authorization: `Bearer ${token}` },
// //           });
// //           alert("User activated successfully");
// //         }
// //         await loadUsers();
// //       }
// //     } catch (err) {
// //       console.error("Confirm action failed", err);
// //       alert("Action failed: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setConfirmState({ open: false, type: "", payload: null });
// //     }
// //   };

// //   return (
// //     <div className="container my-4">
// //       <div className="bg-white rounded-4 shadow-lg p-4">
// //         <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
// //           <div>
// //             <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
// //               <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
// //               User Management System
// //             </h2>
// //             <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
// //           </div>

// //           {!showAddUserForm && (
// //             <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
// //               <FaUserPlus className="me-2" /> Add New User
// //             </button>
// //           )}
// //         </div>

// //         {showAddUserForm ? (
// //           <AddUserForm
// //             onClose={handleCloseAdd}
// //             onSuccess={handleAddSuccess}
// //             roles={roles}
// //             loadingRoles={loadingRoles}
// //             apiBase={API_BASE}
// //           />
// //         ) : (
// //           <>
// //             <div className="row g-3 mb-4">
// //               <div className="col-md-5">
// //                 <input
// //                   type="text"
// //                   className="form-control shadow-sm"
// //                   placeholder="Search by name, email, phone..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>

// //               <div className="col-md-3">
// //                 <select
// //                   className="form-select shadow-sm"
// //                   value={filterRole}
// //                   onChange={(e) => setFilterRole(e.target.value)}
// //                 >
// //                   <option value="All">All Roles</option>
// //                   {roles.map((r) => (
// //                     <option key={r.id} value={r.name?.toUpperCase()}>{r.name}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="col-md-4">
// //                 <button className="btn btn-outline-primary w-100 shadow-sm" onClick={loadUsers}>
// //                   Refresh Data
// //                 </button>
// //               </div>
// //             </div>

// //             <UserTable
// //               users={filteredUsers}
// //               loading={loadingUsers}
// //               onEditFullProfile={handleOpenFullProfile}
// //               onViewBasicInfo={handleOpenBasicInfo}
// //               onDelete={askDelete}
// //               onToggleStatus={askToggleStatus}
// //               canPerformAction={canPerformAction}
// //             />
// //           </>
// //         )}
// //       </div>

// //       {showFullProfileModal && selectedUser && (
// //         <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
// //       )}

// //       {showBasicInfoModal && selectedUser && (
// //         <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
// //       )}

// //       <ConfirmModal
// //         open={confirmState.open}
// //         title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
// //         message={
// //           confirmState.type === "delete"
// //             ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// //             : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
// //         }
// //         onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
// //         onConfirm={performConfirm}
// //       />
// //     </div>
// //   );
// // };

// // export default UserManagement;






// // src/Admin_Dashboard/UserManagement/UserManagement.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUserPlus, FaFilter } from "react-icons/fa";

// import UserTable from "./UserTable";
// import AddUserForm from "./AddUserForm";
// import EditUserModal from "./EditUserModal";
// import ConfirmModal from "./ConfirmModal";
// import AdminUserProfileView from "./AdminUserProfileView";

// const API_BASE = "http://localhost:8080";

// // Utility to normalize role names
// const normalizeRoleName = (role) => {
//   if (!role) return "";
//   return typeof role === "string" ? role : role.name || "";
// };

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [loadingRoles, setLoadingRoles] = useState(true);

//   const [showAddUserForm, setShowAddUserForm] = useState(false);
//   const [showFullProfileModal, setShowFullProfileModal] = useState(false);
//   const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
//   const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("All");
//   const [currentUser, setCurrentUser] = useState(null);

//   // JWT token
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     loadCurrentUser();
//     loadRoles();
//     loadUsers();
//   }, []);

//   const loadCurrentUser = () => {
//     try {
//       const u = JSON.parse(localStorage.getItem("user") || "{}");
//       setCurrentUser(u);
//     } catch {
//       setCurrentUser(null);
//     }
//   };

//   // Fetch Roles with token
//   const loadRoles = async () => {
//     try {
//       setLoadingRoles(true);
//       const res = await axios.get(`${API_BASE}/api/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(res.data || []);
//     } catch (err) {
//       console.error("Failed to load roles", err);
//       setRoles([]);
//     } finally {
//       setLoadingRoles(false);
//     }
//   };

//   // Fetch Users with token - FIXED ENDPOINT
//   const loadUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       // FIXED: Changed from /api/user/all to /api/users
//       const res = await axios.get(`${API_BASE}/api/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const mapped = (res.data || []).map((u) => ({
//         id: u.userId ?? u.id ?? null,
//         firstName: u.firstName ?? "",
//         lastName: u.lastName ?? "",
//         email: u.email ?? "",
//         phone: u.phone ?? "",
//         role: u.role ?? (u.roleName ?? ""),
//         status: (u.status ?? "active").toLowerCase(),
//         raw: u,
//       }));
//       setUsers(mapped);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   // Filtering
//   const filteredUsers = users.filter((user) => {
//     const q = searchTerm.trim().toLowerCase();
//     const matchesSearch =
//       !q ||
//       (user.firstName && user.firstName.toLowerCase().includes(q)) ||
//       (user.lastName && user.lastName.toLowerCase().includes(q)) ||
//       (user.email && user.email.toLowerCase().includes(q)) ||
//       (user.phone && user.phone.toLowerCase().includes(q));

//     const roleName = normalizeRoleName(user.role).toUpperCase();
//     const matchesRole = filterRole === "All" || roleName === filterRole;

//     return matchesSearch && matchesRole;
//   });

//   const handleOpenAdd = () => setShowAddUserForm(true);
//   const handleCloseAdd = () => setShowAddUserForm(false);

//   const handleAddSuccess = async () => {
//     await loadUsers();
//     setShowAddUserForm(false);
//   };

//   const handleOpenFullProfile = (user) => {
//     setSelectedUser(user.raw || user);
//     setShowFullProfileModal(true);
//   };

//   const handleOpenBasicInfo = (user) => {
//     setSelectedUser(user.raw || user);
//     setShowBasicInfoModal(true);
//   };

//   const canPerformAction = (targetUser) => {
//     const currentId = currentUser?.userId ?? currentUser?.id;
//     const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
//     const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
//     if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
//       return false;
//     }
//     return true;
//   };

//   const askDelete = (user) => {
//     if (!canPerformAction(user)) {
//       alert("Protected action: cannot delete your own admin account.");
//       return;
//     }
//     setConfirmState({ open: true, type: "delete", payload: user });
//   };

//   const askToggleStatus = (user) => {
//     if (!canPerformAction(user)) {
//       alert("Protected action: cannot change your own admin account status.");
//       return;
//     }
//     setConfirmState({ open: true, type: "toggleStatus", payload: user });
//   };

//   const performConfirm = async () => {
//     const { type, payload } = confirmState;
//     if (!payload) return;

//     try {
//       if (type === "delete") {
//         // FIXED ENDPOINT: Changed from /api/user/delete to /api/users/{id}
//         await axios.delete(`${API_BASE}/api/users/${payload.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         await loadUsers();
//         alert("User deleted successfully");
//       } else if (type === "toggleStatus") {
//         if (payload.status === "active") {
//           // FIXED ENDPOINT: Changed from /api/user/deactivate to /api/users/{id}/deactivate
//           await axios.put(`${API_BASE}/api/users/${payload.id}/deactivate`, null, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           alert("User deactivated successfully");
//         } else {
//           // FIXED ENDPOINT: Changed from /api/user/activate to /api/users/{id}/activate
//           await axios.put(`${API_BASE}/api/users/${payload.id}/activate`, null, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           alert("User activated successfully");
//         }
//         await loadUsers();
//       }
//     } catch (err) {
//       console.error("Confirm action failed", err);
//       alert("Action failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setConfirmState({ open: false, type: "", payload: null });
//     }
//   };

//   return (
//     <div className="container my-4">
//       <div className="bg-white rounded-4 shadow-lg p-4">
//         <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
//           <div>
//             <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
//               <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
//               User Management System
//             </h2>
//             <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
//           </div>

//           {!showAddUserForm && (
//             <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
//               <FaUserPlus className="me-2" /> Add New User
//             </button>
//           )}
//         </div>

//         {showAddUserForm ? (
//           <AddUserForm
//             onClose={handleCloseAdd}
//             onSuccess={handleAddSuccess}
//             roles={roles}
//             loadingRoles={loadingRoles}
//             apiBase={API_BASE}
//           />
//         ) : (
//           <>
//             <div className="row g-3 mb-4">
//               <div className="col-md-5">
//                 <input
//                   type="text"
//                   className="form-control shadow-sm"
//                   placeholder="Search by name, email, phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="col-md-3">
//                 <select
//                   className="form-select shadow-sm"
//                   value={filterRole}
//                   onChange={(e) => setFilterRole(e.target.value)}
//                 >
//                   <option value="All">All Roles</option>
//                   {roles.map((r) => (
//                     <option key={r.id} value={r.name?.toUpperCase()}>{r.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-md-4">
//                 <button className="btn btn-outline-primary w-100 shadow-sm" onClick={loadUsers}>
//                   Refresh Data
//                 </button>
//               </div>
//             </div>

//             <UserTable
//               users={filteredUsers}
//               loading={loadingUsers}
//               onEditFullProfile={handleOpenFullProfile}
//               onViewBasicInfo={handleOpenBasicInfo}
//               onDelete={askDelete}
//               onToggleStatus={askToggleStatus}
//               canPerformAction={canPerformAction}
//             />
//           </>
//         )}
//       </div>

//       {showFullProfileModal && selectedUser && (
//         <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
//       )}

//       {showBasicInfoModal && selectedUser && (
//         <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
//       )}

//       <ConfirmModal
//         open={confirmState.open}
//         title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
//         message={
//           confirmState.type === "delete"
//             ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
//             : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
//         }
//         onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
//         onConfirm={performConfirm}
//       />
//     </div>
//   );
// };

// export default UserManagement;




// src/Admin_Dashboard/UserManagement/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";

import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import EditUserModal from "./EditUserModal";
import ConfirmModal from "./ConfirmModal";
import AdminUserProfileView from "./AdminUserProfileView";

const API_BASE = "http://localhost:8080";

// Utility to normalize role names
const normalizeRoleName = (role) => {
  if (!role) return "";
  return typeof role === "string" ? role : role.name || "";
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, type: "", payload: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  // JWT token
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCurrentUser();
    loadRoles();
    loadUsers();
  }, []);

  const loadCurrentUser = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(u);
    } catch {
      setCurrentUser(null);
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 5000);
  };

  // Close toast manually
  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  // Fetch Roles with token - Fixed to remove duplicates
  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await axios.get(`${API_BASE}/api/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Process roles to remove duplicates
      const rolesData = res.data || [];
      const uniqueRolesMap = new Map();
      
      rolesData.forEach(role => {
        if (role && role.id) {
          // Use ID as key to ensure uniqueness
          if (!uniqueRolesMap.has(role.id)) {
            uniqueRolesMap.set(role.id, {
              id: role.id,
              name: role.name || role.roleName || `Role ${role.id}`
            });
          }
        }
      });
      
      // Convert map back to array
      const uniqueRoles = Array.from(uniqueRolesMap.values());
      setRoles(uniqueRoles);
      
    } catch (err) {
      console.error("Failed to load roles", err);
      showToast("Failed to load roles", "danger");
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Fetch Users with token - Fixed to handle 500 error
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      
      let response;
      try {
        // Try the main endpoint
        response = await axios.get(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (primaryError) {
        console.warn("Primary endpoint failed, trying alternatives...", primaryError);
        
        // Try alternative endpoints
        const endpoints = [
          `${API_BASE}/api/user/all`,
          `${API_BASE}/api/users`,
          `${API_BASE}/api/users/all`
        ];
        
        let lastError = primaryError;
        
        for (const endpoint of endpoints) {
          try {
            response = await axios.get(endpoint, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`Success with endpoint: ${endpoint}`);
            break; // Exit loop on success
          } catch (err) {
            lastError = err;
            console.warn(`Failed with endpoint ${endpoint}:`, err.message);
          }
        }
        
        if (!response) {
          throw lastError; // Throw the last error if all endpoints failed
        }
      }
      
      // Process user data
      let usersData = [];
      
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else if (Array.isArray(response.data.users)) {
          usersData = response.data.users;
        } else if (Array.isArray(response.data.result)) {
          usersData = response.data.result;
        } else {
          usersData = Object.values(response.data);
        }
      }
      
      // Map users with unique IDs
      const mapped = usersData.map((u, index) => ({
        id: u.userId ?? u.id ?? `temp-${index}`,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        role: u.role ?? (u.roleName ?? ""),
        status: (u.status ?? "active").toLowerCase(),
        raw: u,
      }));
      
      setUsers(mapped);
      showToast("Users loaded successfully", "success");
      
    } catch (err) {
      console.error("Failed to load users", err);
      
      let errorMessage = "Failed to load users";
      if (err.response) {
        if (err.response.status === 500) {
          errorMessage = "Server error (500). Please check backend server.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      showToast(errorMessage, "danger");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filtering
  const filteredUsers = users.filter((user) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (user.firstName && user.firstName.toLowerCase().includes(q)) ||
      (user.lastName && user.lastName.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.phone && user.phone.toLowerCase().includes(q));

    const roleName = normalizeRoleName(user.role).toUpperCase();
    const matchesRole = filterRole === "All" || roleName === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => setShowAddUserForm(true);
  const handleCloseAdd = () => setShowAddUserForm(false);

  const handleAddSuccess = async () => {
    await loadUsers();
    setShowAddUserForm(false);
    showToast("User added successfully!", "success");
  };

  const handleOpenFullProfile = (user) => {
    setSelectedUser(user.raw || user);
    setShowFullProfileModal(true);
  };

  const handleOpenBasicInfo = (user) => {
    setSelectedUser(user.raw || user);
    setShowBasicInfoModal(true);
  };

  const canPerformAction = (targetUser) => {
    if (!targetUser) return false;
    
    const currentId = currentUser?.userId ?? currentUser?.id;
    const currentRole = normalizeRoleName(currentUser?.role)?.toUpperCase();
    const targetRole = normalizeRoleName(targetUser.role)?.toUpperCase();
    
    if (currentRole === "ADMIN" && targetRole === "ADMIN" && Number(currentId) === Number(targetUser.id)) {
      return false;
    }
    return true;
  };

  const askDelete = (user) => {
    if (!canPerformAction(user)) {
      showToast("Protected action: cannot delete your own admin account.", "warning");
      return;
    }
    setConfirmState({ open: true, type: "delete", payload: user });
  };

  const askToggleStatus = (user) => {
    if (!canPerformAction(user)) {
      showToast("Protected action: cannot change your own admin account status.", "warning");
      return;
    }
    setConfirmState({ open: true, type: "toggleStatus", payload: user });
  };

  const performConfirm = async () => {
    const { type, payload } = confirmState;
    if (!payload) return;

    try {
      if (type === "delete") {
        await axios.delete(`${API_BASE}/api/users/${payload.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await loadUsers();
        showToast("User deleted successfully", "success");
      } else if (type === "toggleStatus") {
        if (payload.status === "active") {
          await axios.put(`${API_BASE}/api/users/${payload.id}/deactivate`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast("User deactivated successfully", "success");
        } else {
          await axios.put(`${API_BASE}/api/users/${payload.id}/activate`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast("User activated successfully", "success");
        }
        await loadUsers();
      }
    } catch (err) {
      console.error("Confirm action failed", err);
      const errorMsg = err.response?.data?.message || err.message || "Action failed";
      showToast(errorMsg, "danger");
    } finally {
      setConfirmState({ open: false, type: "", payload: null });
    }
  };

  return (
    <div className="container my-4">
      {/* Toast Notification */}
      <div 
        className={`toast align-items-center text-bg-${toast.type} border-0 ${toast.show ? 'show' : ''}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '300px'
        }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {toast.type === 'success' ? '✅ ' : '❌ '}
            {toast.message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            data-bs-dismiss="toast" 
            aria-label="Close"
            onClick={closeToast}
          ></button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold text-dark mb-2 d-flex align-items-center">
              <span className="me-2" style={{ fontSize: "2rem" }}>👥</span>
              User Management System
            </h2>
            <p className="text-secondary mb-0">Comprehensive user administration and profile management</p>
          </div>

          {!showAddUserForm && (
            <button className="btn btn-success shadow d-flex align-items-center" onClick={handleOpenAdd} style={{ borderRadius: "20px", padding: "12px 24px" }}>
              <FaUserPlus className="me-2" /> Add New User
            </button>
          )}
        </div>

        {showAddUserForm ? (
          <AddUserForm
            onClose={handleCloseAdd}
            onSuccess={handleAddSuccess}
            roles={roles}
            loadingRoles={loadingRoles}
            apiBase={API_BASE}
          />
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select shadow-sm"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  {roles.map((r) => (
                    <option key={`filter-role-${r.id}`} value={r.name?.toUpperCase()}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <button className="btn btn-outline-primary w-100 shadow-sm" onClick={loadUsers}>
                  Refresh Data
                </button>
              </div>
            </div>

            <UserTable
              users={filteredUsers}
              loading={loadingUsers}
              onEditFullProfile={handleOpenFullProfile}
              onViewBasicInfo={handleOpenBasicInfo}
              onDelete={askDelete}
              onToggleStatus={askToggleStatus}
              canPerformAction={canPerformAction}
            />
          </>
        )}
      </div>

      {showFullProfileModal && selectedUser && (
        <AdminUserProfileView user={selectedUser} onClose={() => setShowFullProfileModal(false)} />
      )}

      {showBasicInfoModal && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setShowBasicInfoModal(false)} />
      )}

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.type === "delete" ? "Confirm Delete" : "Confirm Status Change"}
        message={
          confirmState.type === "delete"
            ? `Are you sure you want to delete ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
            : `Are you sure you want to ${confirmState.payload?.status === "active" ? "deactivate" : "activate"} ${confirmState.payload?.firstName} ${confirmState.payload?.lastName}?`
        }
        onCancel={() => setConfirmState({ open: false, type: "", payload: null })}
        onConfirm={performConfirm}
      />
    </div>
  );
};

export default UserManagement;