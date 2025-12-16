
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Eye, EyeOff } from "react-feather";
// import registrationImage from "../assets/registrationImage.png";


// function RegistrationForm() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isAdminRegistration = location.state?.adminRegistration === true;

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: isAdminRegistration ? "ADMIN" : "STUDENT",
//     status: "ACTIVE",
//   });

//   const [showPassword, setShowPassword] = useState({
//     password: false,
//     confirmPassword: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");

//   // Autofill admin role
//   useEffect(() => {
//     if (isAdminRegistration) {
//       setFormData((prev) => ({
//         ...prev,
//         password: "Admin@123",
//         confirmPassword: "Admin@123",
//         role: "ADMIN",
//       }));
//     }
//   }, [isAdminRegistration]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const validateForm = () => {
//     const tempErrors = {};

//     if (formData.firstName.trim().length < 3)
//       tempErrors.firstName = "First name must be at least 3 characters";

//     if (formData.lastName.trim().length < 3)
//       tempErrors.lastName = "Last name must be at least 3 characters";


//     if (!formData.email.trim()) tempErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))

//       if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
//       else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone must be 10 digits";

//     if (!isAdminRegistration) {
//       if (!formData.password.trim()) tempErrors.password = "Password is required";
//       if (formData.password !== formData.confirmPassword)
//         tempErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccess("");
//     setErrors({});

//     if (!validateForm()) return;

//     try {
//       const payload = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role: isAdminRegistration ? formData.role : "STUDENT",
//         status: "ACTIVE",
//       };

//       const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user`, payload);
 
//        setSuccess(res.data.message || "Registered successfully!");

//       if (res.data.user) {
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//       }

//       setTimeout(() => {
//         navigate(isAdminRegistration ? "/admin-dashboard/usermanagement" : "/login");
//       }, 1500);

//     } catch (error) {
//       const backendMessage = error.response?.data?.message;

//       if (!backendMessage) {
//         setErrors({ general: "Server error occurred" });
//         return;
//       }

//       // Map backend errors to specific fields
//       const msg = backendMessage.toLowerCase();

//       if (msg.includes("phone")) {
//         setErrors({ phone: backendMessage });
//       } else if (msg.includes("email")) {
//         setErrors({ email: backendMessage });
//       } else if (msg.includes("password")) {
//         setErrors({ password: backendMessage });
//       } else {
//         setErrors({ general: backendMessage });
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row shadow-lg p-4 rounded-4">

//         {/* IMAGE SIDE */}
//         <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center px-4">
//           <img src={registrationImage} alt="Register" className="img-fluid mb-4" />
//           <h2 className="fw-bold text-primary mb-3">
//             {isAdminRegistration ? "Create Admin" : "Welcome!"}
//           </h2>
//         </div>

//         {/* FORM SIDE */}
//         <div className="col-12 col-md-6 p-4">
//           <h3 className="text-center mb-4 text-primary fw-bold">
//             {isAdminRegistration ? "Admin Creation" : "Register"}
//           </h3>

//           {success && <div className="alert alert-success text-center">{success}</div>}

//           {errors.general && <div className="alert alert-danger text-center">{errors.general}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label fw-semibold">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">{errors.firstName}</div>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
//                 value={formData.lastName}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">{errors.lastName}</div>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 className={`form-control ${errors.email ? "is-invalid" : ""}`}
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">{errors.email}</div>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-semibold">Phone</label>
//               <input
//                 type="text"
//                 name="phone"
//                 className={`form-control ${errors.phone ? "is-invalid" : ""}`}
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">{errors.phone}</div>
//             </div>

//             {!isAdminRegistration && (
//               <>
//                 <div className="mb-3 position-relative">
//                   <label className="form-label fw-semibold">Password</label>
//                   <input
//                     type={showPassword.password ? "text" : "password"}
//                     name="password"
//                     className={`form-control ${errors.password ? "is-invalid" : ""}`}
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   <span
//                     className="position-absolute"
//                     style={{ right: "10px", top: "38px", cursor: "pointer" }}
//                     onClick={() =>
//                       setShowPassword({ ...showPassword, password: !showPassword.password })
//                     }
//                   >
//                     {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </span>
//                   <div className="invalid-feedback">{errors.password}</div>
//                 </div>

//                 <div className="mb-3 position-relative">
//                   <label className="form-label fw-semibold">Confirm Password</label>
//                   <input
//                     type={showPassword.confirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                   <span
//                     className="position-absolute"
//                     style={{ right: "10px", top: "38px", cursor: "pointer" }}
//                     onClick={() =>
//                       setShowPassword({
//                         ...showPassword,
//                         confirmPassword: !showPassword.confirmPassword,
//                       })
//                     }
//                   >
//                     {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </span>
//                   <div className="invalid-feedback">{errors.confirmPassword}</div>
//                 </div>
//               </>
//             )}

//             {isAdminRegistration && (
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Select Role</label>
//                 <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
//                   <option value="ADMIN">Admin</option>
//                   <option value="INTERVIEWER">Interviewer</option>
//                   <option value="STUDENT">Student</option>
//                 </select>
//               </div>
//             )}

//             <button type="submit" className="btn btn-primary w-100">
//               {isAdminRegistration ? "Create Admin" : "Register"}
//             </button>

//             {!isAdminRegistration && (
//               <p className="text-center mt-3">
//                 Already have an account?{" "}
//                 <Link to="/login" className="fw-bold text-primary">
//                   Login
//                 </Link>
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegistrationForm;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import registrationImage from "../assets/registrationImage.png";

function RegistrationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if admin registration is being accessed
  const isAdminRegistration = location.state?.adminRegistration === true;
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: isAdminRegistration ? "ADMIN" : "STUDENT",
    status: "ACTIVE",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check authentication for admin registration
  useEffect(() => {
    if (isAdminRegistration) {
      // Verify user is logged in and has admin privileges
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      
      if (!user || !token) {
        navigate("/login", { 
          state: { 
            message: "You must be logged in to create admin users",
            redirectTo: "/create-admin"
          } 
        });
      } else if (user.role !== "ADMIN") {
        navigate("/unauthorized");
      }
      
      // Pre-fill password for admin registration
      setFormData(prev => ({
        ...prev,
        password: "Admin@123",
        confirmPassword: "Admin@123"
      }));
    }
  }, [isAdminRegistration, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const tempErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 3) {
      tempErrors.firstName = "First name must be at least 3 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 3) {
      tempErrors.lastName = "Last name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone must be 10 digits";
    }

    // Password validation (only for student registration)
    if (!isAdminRegistration) {
      if (!formData.password) {
        tempErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        tempErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      }

      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        status: "ACTIVE"
      };

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json'
      };

      // Add authorization token for admin registration
      if (isAdminRegistration) {
        const token = localStorage.getItem("token");
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Make API call - FIXED ENDPOINT: /api/users/register
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/users/register`,
        payload,
        { headers }
      );

      setSuccess(response.data.message || "Registration successful!");

      // For student registration, store user data and token if returned
      if (!isAdminRegistration && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // If token is returned, store it
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      }

      // Redirect after success
      setTimeout(() => {
        if (isAdminRegistration) {
          navigate("/admin-dashboard/usermanagement");
        } else if (response.data.token) {
          // Auto-login for students if token is provided
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage = errorData.message || errorData;

        // Handle specific error cases
        if (status === 401 || status === 403) {
          setErrors({ 
            general: isAdminRegistration 
              ? "Unauthorized: You need admin privileges to create admin users" 
              : "Authentication failed" 
          });
          
          if (isAdminRegistration) {
            setTimeout(() => navigate("/login"), 2000);
          }
        } else if (status === 409) {
          // Handle duplicate email/phone
          if (errorMessage.toLowerCase().includes("email")) {
            setErrors({ email: errorMessage });
          } else if (errorMessage.toLowerCase().includes("phone")) {
            setErrors({ phone: errorMessage });
          } else {
            setErrors({ general: errorMessage });
          }
        } else if (status === 400) {
          // Handle validation errors from backend
          if (errorData.errors) {
            const backendErrors = {};
            errorData.errors.forEach(err => {
              backendErrors[err.field] = err.defaultMessage;
            });
            setErrors(backendErrors);
          } else {
            setErrors({ general: errorMessage });
          }
        } else {
          setErrors({ general: errorMessage || "Registration failed. Please try again." });
        }
      } else if (error.request) {
        setErrors({ general: "Network error. Please check your connection." });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg p-4 rounded-4">
        
        {/* IMAGE SIDE */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center px-4">
          <img 
            src={registrationImage} 
            alt="Register" 
            className="img-fluid mb-4" 
            style={{ maxHeight: "300px" }}
          />
          <h2 className="fw-bold text-primary mb-3">
            {isAdminRegistration ? "Create New User" : "Join Mock Interview"}
          </h2>
          <p className="text-muted">
            {isAdminRegistration 
              ? "Create new user accounts with specific roles" 
              : "Create your account to start practicing interviews"}
          </p>
        </div>

        {/* FORM SIDE */}
        <div className="col-12 col-md-6 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-primary fw-bold">
              {isAdminRegistration ? "Create User Account" : "Register"}
            </h3>
            {isAdminRegistration && (
              <span className="badge bg-warning">Admin Mode</span>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccess("")}
              ></button>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errors.general}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setErrors({...errors, general: ""})}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                minLength="3"
                required
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                minLength="3"
                required
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Phone Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">+91</span>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
              {errors.phone && (
                <div className="invalid-feedback d-block">{errors.phone}</div>
              )}
            </div>

            {/* Password Fields (only for student registration) */}
            {!isAdminRegistration ? (
              <>
                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    minLength="8"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute"
                    style={{ right: "10px", top: "38px" }}
                    onClick={() => setShowPassword({...showPassword, password: !showPassword.password})}
                  >
                    {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                  <small className="text-muted">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character
                  </small>
                </div>

                {/* Confirm Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute"
                    style={{ right: "10px", top: "38px" }}
                    onClick={() => setShowPassword({...showPassword, confirmPassword: !showPassword.confirmPassword})}
                  >
                    {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </>
            ) : (
              // Admin registration shows auto-generated password info
              <div className="alert alert-info">
                <strong>Note:</strong> Password is auto-generated as <code>Admin@123</code>
                <br />
                User will need to change it on first login.
              </div>
            )}

            {/* Role Selection (only for admin registration) */}
            {isAdminRegistration && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  User Role <span className="text-danger">*</span>
                </label>
                <select 
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="INTERVIEWER">Interviewer</option>
                  <option value="STUDENT">Student</option>
                </select>
                <small className="text-muted">
                  Select the appropriate role for the new user
                </small>
              </div>
            )}

            {/* Submit Button */}
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isAdminRegistration ? "Creating User..." : "Registering..."}
                  </>
                ) : (
                  isAdminRegistration ? "Create User" : "Create Account"
                )}
              </button>
              
              {/* Cancel button for admin registration */}
              {isAdminRegistration && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/admin-dashboard/usermanagement")}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Links for student registration */}
          {!isAdminRegistration && (
            <div className="mt-4 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-primary">
                  Sign In
                </Link>
              </p>
              <p className="text-muted small">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
