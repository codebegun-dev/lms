//  import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const ROLE_API = "http://localhost:8080/api/roles";
// const PERMISSION_API = "http://localhost:8080/api/permissions";

// const ManageRoles = () => {
//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   const [selectedPermIds, setSelectedPermIds] = useState([]);
//   const [selectedPermission, setSelectedPermission] = useState("");
//   const [name, setName] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [toast, setToast] = useState(null);
//   const timerRef = useRef(null);

//   const axiosAuth = axios.create({
//     baseURL: ROLE_API,
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       "Content-Type": "application/json",
//     },
//   });

//   useEffect(() => {
//     loadRoles();
//     loadPermissions();
//     return () => timerRef.current && clearTimeout(timerRef.current);
//   }, []);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     timerRef.current = setTimeout(() => setToast(null), 3000);
//   };

//   const loadRoles = async () => {
//     try {
//       const res = await axiosAuth.get("");
//       setRoles(res.data);
//     } catch {
//       showToast("Failed to load roles", "danger");
//     }
//   };

//   const loadPermissions = async () => {
//     const res = await axios.get(PERMISSION_API, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     setPermissions(res.data);
//   };

//   const resetForm = () => {
//     setName("");
//     setSelectedPermIds([]);
//     setSelectedPermission("");
//     setEditingId(null);
//   };

//   // CREATE / UPDATE ROLE
//   const saveRole = async () => {
//     if (!name.trim()) {
//       showToast("Role name required", "danger");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       description: "",
//       permissionIds: selectedPermIds,
//     };

//     try {
//       if (editingId) {
//         await axiosAuth.put(`/${editingId}`, payload);
//         showToast("Role updated");
//       } else {
//         await axiosAuth.post("", payload);
//         showToast("Role created");
//       }
//       resetForm();
//       loadRoles();
//     } catch (e) {
//       showToast(e.response?.data?.message || "Permission denied", "danger");
//     }
//   };

//   // EDIT ROLE
//   const editRole = (role) => {
//     setEditingId(role.id);
//     setName(role.name);

//     const ids = permissions
//       .filter((p) => role.permissions.includes(p.name))
//       .map((p) => p.id);

//     setSelectedPermIds(ids);
//   };

//   const deleteRole = async (id) => {
//     if (!window.confirm("Delete this role?")) return;
//     try {
//       await axiosAuth.delete(`/${id}`);
//       showToast("Role deleted", "warning");
//       loadRoles();
//       if (editingId === id) resetForm();
//     } catch {
//       showToast("Delete not allowed", "danger");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Manage Roles</h4>

//       {/* FORM */}
//       <div className="card mb-3">
//         <div className="card-body row g-3 align-items-start">
//           <div className="col-md-4">
//             <input
//               className="form-control"
//               placeholder="Role Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div className="col-md-5">
//             {/* NORMAL DROPDOWN */}
//             <div className="d-flex gap-2">
//               <select
//                 className="form-select"
//                 value={selectedPermission}
//                 onChange={(e) => setSelectedPermission(e.target.value)}
//               >
//                 <option value="">Select Permission</option>
//                 {permissions.map((p) => (
//                   <option
//                     key={p.id}
//                     value={p.id}
//                     disabled={selectedPermIds.includes(p.id)}
//                   >
//                     {p.name}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 className="btn btn-outline-primary"
//                 type="button"
//                 onClick={() => {
//                   if (!selectedPermission) return;
//                   setSelectedPermIds((prev) => [
//                     ...prev,
//                     Number(selectedPermission),
//                   ]);
//                   setSelectedPermission("");
//                 }}
//               >
//                 Add
//               </button>
//             </div>

//             {/* SELECTED PERMISSIONS */}
//             <div className="mt-2">
//               {permissions
//                 .filter((p) => selectedPermIds.includes(p.id))
//                 .map((p) => (
//                   <span key={p.id} className="badge bg-primary me-2">
//                     {p.name}
//                     <button
//                       type="button"
//                       className="btn-close btn-close-white btn-sm ms-2"
//                       onClick={() =>
//                         setSelectedPermIds((prev) =>
//                           prev.filter((id) => id !== p.id)
//                         )
//                       }
//                     ></button>
//                   </span>
//                 ))}
//             </div>
//           </div>

//           <div className="col-md-3 d-flex gap-2">
//             <button className="btn btn-primary" onClick={saveRole}>
//               {editingId ? "Update" : "Create"}
//             </button>
//             {editingId && (
//               <button className="btn btn-secondary" onClick={resetForm}>
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ROLE LIST */}
//       <div className="list-group">
//         {roles.length === 0 && (
//           <div className="text-muted">No roles found</div>
//         )}
//         {roles.map((r) => (
//           <div
//             key={r.id}
//             className="list-group-item d-flex justify-content-between"
//           >
//             <div>
//               <div className="fw-bold">{r.name}</div>
//               <div className="mt-1">
//                 {r.permissions?.map((p, i) => (
//                   <span key={i} className="badge bg-secondary me-1">
//                     {p}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="btn-group">
//               <button
//                 className="btn btn-outline-primary btn-sm"
//                 onClick={() => editRole(r)}
//               >
//                 <FaEdit />
//               </button>
//               <button
//                 className="btn btn-outline-danger btn-sm"
//                 onClick={() => deleteRole(r.id)}
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {toast && (
//         <div className="position-fixed bottom-0 end-0 p-3">
//           <div className={`alert alert-${toast.type}`}>{toast.msg}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageRoles;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select"; // ✅ react-select import

const API = "http://localhost:8080/api/roles";
const MODULE_API = "http://localhost:8080/api/ui/modules";

const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedModules, setSelectedModules] = useState([]); // [{ moduleId, permissionIds: [] }]
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

 const axiosAuth = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});


  useEffect(() => {
    fetchModules();
    fetchRoles();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchModules = async () => {
    try {
      const res = await axiosAuth.get(MODULE_API);
      setModules(res.data); // [{id, name, permissions: [{id, name}]}]
    } catch {
      showToast("Failed to load modules", "danger");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosAuth.get(API);
      setRoles(res.data);
    } catch {
      showToast("Failed to load roles", "danger");
    }
  };

  const resetForm = () => {
    setRoleName("");
    setSelectedModules([]);
    setEditingId(null);
  };

  // ===== Module Selection =====
  const toggleModule = (module) => {
    const exists = selectedModules.find((m) => m.moduleId === module.id);
    if (exists) {
      setSelectedModules(selectedModules.filter((m) => m.moduleId !== module.id));
    } else {
      setSelectedModules([...selectedModules, { moduleId: module.id, permissionIds: [] }]);
    }
  };

  // ===== Permission Selection using react-select =====
  const handlePermissionChange = (moduleId, selectedOptions) => {
    const modulesCopy = [...selectedModules];
    const module = modulesCopy.find((m) => m.moduleId === moduleId);
    if (!module) return;
    module.permissionIds = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setSelectedModules(modulesCopy);
  };

  const saveRole = async () => {
    if (!roleName.trim()) {
      showToast("Role name required", "danger");
      return;
    }
    if (selectedModules.length === 0) {
      showToast("Select at least one module", "danger");
      return;
    }

    const payload = {
      roleName: roleName.trim(),
      modules: selectedModules,
    };

    try {
      if (editingId) {
await axiosAuth.put(`${API}/${editingId}`, payload);
        showToast("Role updated");
      } else {
        await axiosAuth.post(API, payload);
        showToast("Role created");
      }
      resetForm();
      fetchRoles();
    } catch (e) {
      showToast(e.response?.data?.message || "Error saving role", "danger");
    }
  };

  const editRole = (role) => {
    setEditingId(role.roleId);
    setRoleName(role.roleName);
    const modulesData = role.modules.map((m) => ({
      moduleId: m.moduleId,
      permissionIds: m.permissions.map((p) => p.id),
    }));
    setSelectedModules(modulesData);
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await axiosAuth.delete(`${API}/${id}`);
      showToast("Role deleted", "warning");
      fetchRoles();
      if (editingId === id) resetForm();
    } catch {
      showToast("Delete not allowed", "danger");
    }
  };

  const isModuleSelected = (moduleId) => selectedModules.some((m) => m.moduleId === moduleId);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Manage Roles</h4>

      {/* FORM */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          {/* Modules */}
          <div className="mb-2">
            <label className="form-label">Modules</label>
            <div className="d-flex flex-wrap gap-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn btn-sm ${isModuleSelected(m.id) ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => toggleModule(m)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions per module using react-select */}
          {selectedModules.map((m) => {
            const module = modules.find((mod) => mod.id === m.moduleId);
            if (!module) return null;
            const options = module.permissions.map((p) => ({ value: p.id, label: p.name }));
            const selectedOptions = options.filter((opt) => m.permissionIds.includes(opt.value));
            return (
              <div key={m.moduleId} className="mb-3">
                <label className="form-label">{module.name} Permissions</label>
                <Select
                  isMulti
                  options={options}
                  value={selectedOptions}
                  onChange={(selected) => handlePermissionChange(m.moduleId, selected)}
                  placeholder="Select Permissions..."
                />
              </div>
            );
          })}

          <div className="mt-2">
            <button className="btn btn-primary me-2" onClick={saveRole}>
              {editingId ? "Update Role" : "Create Role"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="list-group">
        {roles.length === 0 && <div className="text-muted">No roles found</div>}
        {roles.map((r) => (
          <div
            key={r.roleId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-bold">{r.roleName}</div>
              <div className="mt-1">
                {r.modules.map((m) => (
                  <div key={m.moduleId}>
                    <small className="text-primary">{m.moduleName}:</small>{" "}
                    {m.permissions.map((p) => (
                      <span key={p.id} className="badge bg-secondary me-1">{p.name}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="btn-group">
              <button className="btn btn-outline-primary btn-sm" onClick={() => editRole(r)}>
                <FaEdit />
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteRole(r.roleId)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
<div className={`alert alert-${toast.type}`}>
  {toast.msg}
</div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;