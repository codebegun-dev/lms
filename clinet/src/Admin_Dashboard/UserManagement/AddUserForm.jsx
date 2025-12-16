// // src/Admin_Dashboard/UserManagement/AddUserForm.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddUserForm = ({ onClose, onSuccess, apiBase = "http://localhost:8080" }) => {
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);
//   const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Get token from localStorage
//   const token = localStorage.getItem("token");

//   // Fetch roles from API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await axios.get(`${apiBase}/api/roles`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRoles(res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch roles:", err);
//       } finally {
//         setLoadingRoles(false);
//       }
//     };
//     fetchRoles();
//   }, [apiBase, token]);

//   const validate = () => {
//     const e = {};
//     if (!formData.firstName.trim()) e.firstName = "First name is required";
//     if (!formData.lastName.trim()) e.lastName = "Last name is required";
//     if (!formData.email.trim()) e.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
//     if (!formData.phone.trim()) e.phone = "Phone is required";
//     else if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter 10 digit phone";
//     if (!formData.role) e.role = "Role is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: name === "role" ? Number(value) : value }));
//     setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     if (!validate()) return;

//     const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const adminId = loggedUser?.userId ?? loggedUser?.id;
//     if (!adminId) {
//       setErrors({ general: "Admin session expired. Login again." });
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         roleId: formData.role,
//         adminAuthId: Number(adminId),
//       };

//       await axios.post(`${apiBase}/api/user`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       onSuccess && onSuccess();
//       alert("User added successfully");
//     } catch (err) {
//       const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add user";
//       if (msg.includes("Email")) setErrors({ email: msg });
//       else if (msg.includes("Phone")) setErrors({ phone: msg });
//       else setErrors({ general: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card mb-4 border-0 shadow-lg rounded-4 overflow-hidden">
//       <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//         <h5 className="mb-0 text-white fw-bold">Add New User</h5>
//         <button className="btn btn-light rounded-circle" onClick={onClose}>✕</button>
//       </div>

//       <div className="card-body p-4">
//         {errors.general && <div className="alert alert-danger">{errors.general}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">First Name *</label>
//               <input name="firstName" value={formData.firstName} onChange={handleChange} className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
//               {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Last Name *</label>
//               <input name="lastName" value={formData.lastName} onChange={handleChange} className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
//               {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Email *</label>
//               <input name="email" type="email" value={formData.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} />
//               {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Phone *</label>
//               <input name="phone" maxLength={10} value={formData.phone} onChange={handleChange} className={`form-control ${errors.phone ? "is-invalid" : ""}`} />
//               {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Role *</label>
//               <select name="role" value={formData.role} onChange={handleChange} className={`form-select ${errors.role ? "is-invalid" : ""}`} disabled={loadingRoles}>
//                 <option value="">{loadingRoles ? "Loading roles..." : "Select Role"}</option>
//                 {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
//               </select>
//               {errors.role && <div className="invalid-feedback">{errors.role}</div>}
//             </div>
//           </div>

//           <div className="mt-4 d-flex gap-2">
//             <button type="submit" className="btn btn-success" disabled={loading}>{loading ? "Adding..." : "Create User"}</button>
//             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUserForm;




// src/Admin_Dashboard/UserManagement/AddUserForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUserForm = ({ onClose, onSuccess, apiBase = "http://localhost:8080" }) => {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data || []);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [apiBase, token]);

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter 10 digit phone";
    if (!formData.role) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: name === "role" ? Number(value) : value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const adminId = loggedUser?.userId ?? loggedUser?.id;
    if (!adminId) {
      setErrors({ general: "Admin session expired. Login again." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roleId: formData.role,
        adminAuthId: Number(adminId),
      };

      // FIXED: Changed endpoint from /api/user to /api/users/register
      await axios.post(`${apiBase}/api/users/register`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess && onSuccess();
      alert("User added successfully");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add user";
      if (msg.includes("Email")) setErrors({ email: msg });
      else if (msg.includes("Phone")) setErrors({ phone: msg });
      else setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 border-0 shadow-lg rounded-4 overflow-hidden">
      <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <h5 className="mb-0 text-white fw-bold">Add New User</h5>
        <button className="btn btn-light rounded-circle" onClick={onClose}>✕</button>
      </div>

      <div className="card-body p-4">
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">First Name *</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name *</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone *</label>
              <input name="phone" maxLength={10} value={formData.phone} onChange={handleChange} className={`form-control ${errors.phone ? "is-invalid" : ""}`} />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Role *</label>
              <select name="role" value={formData.role} onChange={handleChange} className={`form-select ${errors.role ? "is-invalid" : ""}`} disabled={loadingRoles}>
                <option value="">{loadingRoles ? "Loading roles..." : "Select Role"}</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>{loading ? "Adding..." : "Create User"}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;