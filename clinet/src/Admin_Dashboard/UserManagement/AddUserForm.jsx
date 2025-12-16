// // src/Admin_Dashboard/UserManagement/AddUserForm.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddUserForm = ({ onClose, onSuccess, apiBase = "http://localhost:8080" }) => {
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);
//   const [formData, setFormData] = useState({ 
//     firstName: "", 
//     lastName: "", 
//     email: "", 
//     phone: "", 
//     role: "" 
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   // Get token from localStorage
//   const token = localStorage.getItem("token");

//   // Show toast notification
//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     // Auto hide after 5 seconds
//     setTimeout(() => {
//       setToast({ show: false, message: "", type: "success" });
//     }, 5000);
//   };

//   // Close toast manually
//   const closeToast = () => {
//     setToast({ show: false, message: "", type: "success" });
//   };

//   // Fetch roles from API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await axios.get(`${apiBase}/api/roles`, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         });
        
//         let rolesArray = [];
        
//         // Handle different response formats
//         if (Array.isArray(res.data)) {
//           rolesArray = res.data;
//         } else if (res.data && typeof res.data === 'object') {
//           if (Array.isArray(res.data.data)) {
//             rolesArray = res.data.data;
//           } else if (Array.isArray(res.data.roles)) {
//             rolesArray = res.data.roles;
//           } else if (Array.isArray(res.data.result)) {
//             rolesArray = res.data.result;
//           } else {
//             rolesArray = Object.values(res.data);
//           }
//         }
        
//         // Normalize role objects
//         const normalizedRoles = rolesArray
//           .filter(role => role && (role.id || role.roleId || role.roleID))
//           .map(role => {
//             const id = role.id || role.roleId || role.roleID;
//             const name = role.name || role.roleName || role.role || `Role ${id}`;
            
//             return {
//               id: Number(id),
//               name: String(name).trim()
//             };
//           })
//           .filter((role, index, self) => 
//             index === self.findIndex(r => r.id === role.id)
//           )
//           .sort((a, b) => a.name.localeCompare(b.name));
        
//         setRoles(normalizedRoles);
        
//       } catch (err) {
//         console.error("Failed to fetch roles:", err);
        
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           setErrors({ 
//             general: "Authentication failed. Please log in again." 
//           });
//         }
        
//         setRoles([]);
//       } finally {
//         setLoadingRoles(false);
//       }
//     };
    
//     if (token) {
//       fetchRoles();
//     } else {
//       setErrors({ 
//         general: "You are not logged in. Please log in first." 
//       });
//       setLoadingRoles(false);
//     }
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
//     setFormData((p) => ({ ...p, [name]: value }));
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
//         roleId: Number(formData.role),
//         adminAuthId: Number(adminId),
//       };
      
//       await axios.post(`${apiBase}/api/users/register`, payload, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       // Show success toast instead of alert
//       showToast("User added successfully!", "success");
      
//       // Reset form
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         role: "",
//       });
      
//       // Call onSuccess callback after a short delay
//       setTimeout(() => {
//         onSuccess && onSuccess();
//       }, 1500);
      
//     } catch (err) {
//       console.error("Add user error:", err);
      
//       let errorMessage = "Failed to add user";
      
//       if (err.response) {
//         const data = err.response.data;
//         errorMessage = data.message || data.error || "Failed to add user";
        
//         // Show error toast
//         showToast(errorMessage, "danger");
        
//         if (errorMessage.includes("Email") || errorMessage.includes("email")) {
//           setErrors({ email: errorMessage });
//         } else if (errorMessage.includes("Phone") || errorMessage.includes("phone")) {
//           setErrors({ phone: errorMessage });
//         } else if (errorMessage.includes("Role") || errorMessage.includes("role")) {
//           setErrors({ role: errorMessage });
//         } else {
//           setErrors({ general: errorMessage });
//         }
//       } else {
//         showToast(errorMessage, "danger");
//         setErrors({ general: errorMessage });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Toast Notification */}
//       <div 
//         className={`toast align-items-center text-bg-${toast.type} border-0 ${toast.show ? 'show' : ''}`} 
//         role="alert" 
//         aria-live="assertive" 
//         aria-atomic="true"
//         style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           zIndex: 9999,
//           minWidth: '300px'
//         }}
//       >
//         <div className="d-flex">
//           <div className="toast-body">
//             {toast.type === 'success' ? '✅ ' : '❌ '}
//             {toast.message}
//           </div>
//           <button 
//             type="button" 
//             className="btn-close btn-close-white me-2 m-auto" 
//             data-bs-dismiss="toast" 
//             aria-label="Close"
//             onClick={closeToast}
//           ></button>
//         </div>
//       </div>

//       <div className="card mb-4 border-0 shadow-lg rounded-4 overflow-hidden">
//         <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//           <h5 className="mb-0 text-white fw-bold">Add New User</h5>
//           <button className="btn btn-light rounded-circle" onClick={onClose}>✕</button>
//         </div>

//         <div className="card-body p-4">
//           {errors.general && (
//             <div className="alert alert-danger">
//               {errors.general}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label fw-semibold">First Name *</label>
//                 <input 
//                   name="firstName" 
//                   value={formData.firstName} 
//                   onChange={handleChange} 
//                   className={`form-control ${errors.firstName ? "is-invalid" : ""}`} 
//                   placeholder="Enter first name"
//                 />
//                 {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label fw-semibold">Last Name *</label>
//                 <input 
//                   name="lastName" 
//                   value={formData.lastName} 
//                   onChange={handleChange} 
//                   className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
//                   placeholder="Enter last name"
//                 />
//                 {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label fw-semibold">Email *</label>
//                 <input 
//                   name="email" 
//                   type="email" 
//                   value={formData.email} 
//                   onChange={handleChange} 
//                   className={`form-control ${errors.email ? "is-invalid" : ""}`}
//                   placeholder="Enter email address"
//                 />
//                 {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label fw-semibold">Phone *</label>
//                 <input 
//                   name="phone" 
//                   maxLength={10} 
//                   value={formData.phone} 
//                   onChange={handleChange} 
//                   className={`form-control ${errors.phone ? "is-invalid" : ""}`}
//                   placeholder="Enter 10-digit phone"
//                 />
//                 {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label fw-semibold">Role *</label>
//                 <select 
//                   name="role" 
//                   value={formData.role} 
//                   onChange={handleChange} 
//                   className={`form-select ${errors.role ? "is-invalid" : ""}`} 
//                   disabled={loadingRoles}
//                 >
//                   <option value="">
//                     {loadingRoles 
//                       ? "Loading roles..." 
//                       : roles.length === 0 
//                         ? "No roles available" 
//                         : "Select Role"
//                     }
//                   </option>
//                   {roles.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.role && <div className="invalid-feedback">{errors.role}</div>}
//                 {!loadingRoles && roles.length === 0 && (
//                   <div className="alert alert-warning mt-2 mb-0 py-2">
//                     No roles found. Please check API endpoint or permissions.
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 d-flex gap-2">
//               <button 
//                 type="submit" 
//                 className="btn btn-success px-4 py-2" 
//                 disabled={loading || loadingRoles || roles.length === 0}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     Adding...
//                   </>
//                 ) : "Create User"}
//               </button>
//               <button 
//                 type="button" 
//                 className="btn btn-secondary px-4 py-2" 
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddUserForm;




// src/Admin_Dashboard/UserManagement/AddUserForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUserForm = ({ onClose, onSuccess, apiBase = "http://localhost:8080" }) => {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    roleId: "", // Changed from 'role' to 'roleId' to match backend
    password: "", // Added for student registration
    confirmPassword: "" // Added for confirmation
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 5000);
  };

  // Close toast manually
  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/roles`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        let rolesArray = [];
        
        // Handle different response formats
        if (Array.isArray(res.data)) {
          rolesArray = res.data;
        } else if (res.data && typeof res.data === 'object') {
          if (Array.isArray(res.data.data)) {
            rolesArray = res.data.data;
          } else if (Array.isArray(res.data.roles)) {
            rolesArray = res.data.roles;
          } else if (Array.isArray(res.data.result)) {
            rolesArray = res.data.result;
          } else {
            rolesArray = Object.values(res.data);
          }
        }
        
        // Filter out MASTER_ADMIN role since it shouldn't be assignable
        const filteredRoles = rolesArray.filter(role => {
          const roleName = (role.name || role.roleName || "").toUpperCase();
          return roleName !== "MASTER_ADMIN";
        });
        
        // Normalize role objects
        const normalizedRoles = filteredRoles
          .filter(role => role && (role.id || role.roleId || role.roleID))
          .map(role => {
            const id = role.id || role.roleId || role.roleID;
            const name = role.name || role.roleName || role.role || `Role ${id}`;
            
            return {
              id: Number(id),
              name: String(name).trim()
            };
          })
          .filter((role, index, self) => 
            index === self.findIndex(r => r.id === role.id)
          )
          .sort((a, b) => {
            // Sort STUDENT to the top, then alphabetically
            if (a.name.toUpperCase() === "STUDENT") return -1;
            if (b.name.toUpperCase() === "STUDENT") return 1;
            return a.name.localeCompare(b.name);
          });
        
        setRoles(normalizedRoles);
        
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          setErrors({ 
            general: "Authentication failed. Please log in again." 
          });
        }
        
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    
    if (token) {
      fetchRoles();
    } else {
      setErrors({ 
        general: "You are not logged in. Please log in first." 
      });
      setLoadingRoles(false);
    }
  }, [apiBase, token]);

  const validate = () => {
    const e = {};
    
    // Required fields
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email format";
    
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter 10 digit phone number";
    
    if (!formData.roleId) e.roleId = "Role is required";
    
    // Password validation based on role
    const selectedRole = roles.find(r => r.id === Number(formData.roleId));
    const isStudent = selectedRole?.name.toUpperCase() === "STUDENT";
    
    if (isStudent) {
      // For STUDENT role, password is required
      if (!formData.password.trim()) {
        e.password = "Password is required for student registration";
      } else if (formData.password.length < 8) {
        e.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
        e.password = "Password must contain uppercase, lowercase, number and special character";
      }
      
      if (!formData.confirmPassword.trim()) {
        e.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const adminId = loggedUser?.userId ?? loggedUser?.id;
    
    if (!adminId) {
      setErrors({ general: "Admin session expired. Please log in again." });
      return;
    }

    // Get selected role info
    const selectedRole = roles.find(r => r.id === Number(formData.roleId));
    const isStudent = selectedRole?.name.toUpperCase() === "STUDENT";

    setLoading(true);
    try {
      // Prepare payload according to UserRequestDto
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        roleId: Number(formData.roleId),
      };

      // Add password only for STUDENT role (public registration)
      if (isStudent && formData.password) {
        payload.password = formData.password;
      }

      console.log("Sending payload:", payload); // Debug log
      
      const response = await axios.post(`${apiBase}/api/users/register`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Show success toast
      const newUser = response.data;
      showToast(`User ${newUser.firstName} ${newUser.lastName} added successfully!`, "success");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
        password: "",
        confirmPassword: ""
      });
      
      // Call onSuccess callback after a short delay
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1500);
      
    } catch (err) {
      console.error("Add user error:", err);
      
      let errorMessage = "Failed to add user";
      let fieldErrors = {};
      
      if (err.response) {
        const data = err.response.data;
        
        // Handle different error response formats
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        // Map backend validation errors to form fields
        if (data.errors) {
          data.errors.forEach(error => {
            if (error.field === 'email') fieldErrors.email = error.message;
            else if (error.field === 'phone') fieldErrors.phone = error.message;
            else if (error.field === 'password') fieldErrors.password = error.message;
            else fieldErrors.general = error.message;
          });
        }
        
        // Check for specific error messages
        if (errorMessage.includes("Email") || errorMessage.includes("email")) {
          fieldErrors.email = errorMessage;
        } else if (errorMessage.includes("Phone") || errorMessage.includes("phone")) {
          fieldErrors.phone = errorMessage;
        } else if (errorMessage.includes("Role") || errorMessage.includes("role")) {
          fieldErrors.roleId = errorMessage;
        } else if (errorMessage.includes("Password") || errorMessage.includes("password")) {
          fieldErrors.password = errorMessage;
        } else {
          fieldErrors.general = errorMessage;
        }
        
        setErrors(fieldErrors);
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
      
      // Show error toast
      showToast(errorMessage, "danger");
      
    } finally {
      setLoading(false);
    }
  };

  // Check if password fields should be shown
  const selectedRole = roles.find(r => r.id === Number(formData.roleId));
  const showPasswordFields = selectedRole?.name.toUpperCase() === "STUDENT";

  return (
    <>
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

      <div className="card mb-4 border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <h5 className="mb-0 text-white fw-bold">Add New User</h5>
          <button className="btn btn-light rounded-circle" onClick={onClose}>✕</button>
        </div>

        <div className="card-body p-4">
          {errors.general && (
            <div className="alert alert-danger">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* First Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">First Name *</label>
                <input 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`} 
                  placeholder="Enter first name"
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Last Name *</label>
                <input 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone *</label>
                <input 
                  name="phone" 
                  maxLength={10} 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter 10-digit phone"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              {/* Role Selection */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Role *</label>
                <select 
                  name="roleId" 
                  value={formData.roleId} 
                  onChange={handleChange} 
                  className={`form-select ${errors.roleId ? "is-invalid" : ""}`} 
                  disabled={loadingRoles}
                >
                  <option value="">
                    {loadingRoles 
                      ? "Loading roles..." 
                      : roles.length === 0 
                        ? "No roles available" 
                        : "Select Role"
                    }
                  </option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.name.toUpperCase() === "STUDENT" ? " (Requires Password)" : ""}
                    </option>
                  ))}
                </select>
                {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
                {!loadingRoles && roles.length === 0 && (
                  <div className="alert alert-warning mt-2 mb-0 py-2">
                    No roles found. Please check API endpoint or permissions.
                  </div>
                )}
              </div>

              {/* Conditional Password Fields for STUDENT role */}
              {showPasswordFields && (
                <>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password *</label>
                    <input 
                      name="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Enter password for student"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    <small className="text-muted">
                      Must contain: uppercase, lowercase, number, special character (@$!%*?&#), min 8 chars
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </>
              )}            
            </div>

            <div className="mt-4 d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-success px-4 py-2" 
                disabled={loading || loadingRoles || roles.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : "Create User"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary px-4 py-2" 
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUserForm;