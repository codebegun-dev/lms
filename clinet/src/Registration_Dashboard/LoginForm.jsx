// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import registrationImage from "../assets/registrationImage.png";

// function LoginForm() {
//   const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [generalError, setGeneralError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   //  Handle Input 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//     setGeneralError("");
//   };

//   //   Validate Form  
//   const validateForm = () => {
//     const tempErrors = {};
//     if (!formData.emailOrPhone.trim()) tempErrors.emailOrPhone = "Email or Phone is required";
//     if (!formData.password.trim()) tempErrors.password = "Password is required";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // Toggle Password 
//   const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

//   //Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/user/login`,
//         formData
//       );

//       const user = res.data;


//       if (!user || !user.role) {
//         setGeneralError("User role not found. Please contact admin.");
//         return;
//       }

//       const roleName = user.role.trim().toUpperCase();

//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("userId", user.userId); // required for lead APIs


//       if (roleName === "MASTER_ADMIN") {
//         localStorage.setItem("masterAdminId", user.userId);
//       }

//       window.dispatchEvent(new Event("user-updated"));
//       console.log("Logged in as:", roleName);

//       //  Role-based navigation
//       if (roleName === "STUDENT") navigate("/student-dashboard");
//       else if (roleName === "ADMIN" || roleName === "MASTER_ADMIN") navigate("/admin-dashboard");
//       else if (roleName === "INTERVIEWER") navigate("/interviewer-dashboard");
//       else if (roleName === "SALES_MANAGER") navigate("/sales-dashboard");
//       else if (roleName === "SA_COUNSELOR") navigate("/sales-counselor");
//       else setGeneralError(`Unknown role: ${roleName}`);

//     } catch (error) {
//       console.error("Login error:", error);
//       setGeneralError(error.response?.data?.message || "Invalid credentials or server error.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row shadow-lg rounded-4 overflow-hidden flex-column flex-md-row">
//         {/* Left Side */}
//         <div className="col-md-6 d-flex flex-column align-items-center justify-content-center bg-light p-4">
//           <img
//             src={registrationImage}
//             alt="Login"
//             className="img-fluid mb-4"
//             style={{ maxHeight: "280px", objectFit: "cover" }}
//           />
//           <h2 className="fw-bold text-primary mb-3">Welcome Back!</h2>
//           <p className="text-secondary text-center">Log in to access your learning journey.</p>
//         </div>

//         {/* Right Side */}
//         <div className="col-md-6 p-4 d-flex align-items-center justify-content-center">
//           <div className="w-100" style={{ maxWidth: "400px" }}>
//             <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>
//             {generalError && <p className="alert alert-danger text-center">{generalError}</p>}

//             <form onSubmit={handleSubmit}>
//               {/* Email/Phone */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Email or Phone</label>
//                 <input
//                   type="text"
//                   name="emailOrPhone"
//                   value={formData.emailOrPhone}
//                   onChange={handleChange}
//                   className={`form-control ${errors.emailOrPhone ? "is-invalid" : ""}`}
//                   placeholder="Enter email or phone"
//                 />
//                 {errors.emailOrPhone && <div className="invalid-feedback">{errors.emailOrPhone}</div>}
//               </div>

//               {/* Password */}
//               <div className="mb-3 position-relative">
//                 <label className="form-label fw-semibold">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`form-control ${errors.password ? "is-invalid" : ""}`}
//                   placeholder="Enter password"
//                 />
//                 <span
//                   className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
//                   style={{ cursor: "pointer" }}
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//                 {errors.password && <div className="invalid-feedback">{errors.password}</div>}
//               </div>

//               <div className="text-end mb-3">
//                 <Link to="/sendresetmail" className="text-primary">Forgot Password?</Link>
//               </div>

//               <button type="submit" className="btn btn-primary w-100">Login</button>
//               <p className="text-center mt-3">
//                 Don't have an account? <Link to="/" className="text-primary">Register</Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import registrationImage from "../assets/registrationImage.png";

function LoginForm() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ---------------- Handle Input ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
  };

  // ---------------- Validate ----------------
  const validateForm = () => {
    const temp = {};
    if (!formData.emailOrPhone.trim()) temp.emailOrPhone = "Email or Phone is required";
    if (!formData.password.trim()) temp.password = "Password is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        formData
      );

      const token = res.data.token;
      if (!token) {
        setGeneralError("Token not received from server");
        return;
      }

      // Decode JWT
      const decoded = jwtDecode(token);

      const role = decoded.roles?.[0];
      const userId = decoded.userId;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("permissions", JSON.stringify(decoded.permissions || []));

      window.dispatchEvent(new Event("user-updated"));

      // Role-based navigation
      if (role === "STUDENT") navigate("/student-dashboard");
      else if (role === "ADMIN" || role === "MASTER_ADMIN") navigate("/admin-dashboard");
      else if (role === "INTERVIEWER") navigate("/interviewer-dashboard");
      else if (role === "SALES_MANAGER") navigate("/sales-dashboard");
      else if (role === "SA_COUNSELOR") navigate("/sales-counselor");
      else setGeneralError(`Unknown role: ${role}`);

    } catch (err) {
      setGeneralError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg rounded-4 overflow-hidden">

        {/* Left */}
        <div className="col-md-6 bg-light p-4 text-center">
          <img
            src={registrationImage}
            alt="Login"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px" }}
          />
          <h2 className="fw-bold text-primary">Welcome Back!</h2>
          <p className="text-secondary">Login to continue</p>
        </div>

        {/* Right */}
        <div className="col-md-6 p-4">
          <h3 className="text-center text-primary fw-bold mb-4">Login</h3>

          {generalError && (
            <p className="alert alert-danger text-center">{generalError}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email/Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email or Phone</label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={`form-control ${errors.emailOrPhone ? "is-invalid" : ""}`}
              />
              {errors.emailOrPhone && (
                <div className="invalid-feedback">{errors.emailOrPhone}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="text-end mb-3">
              <Link to="/sendresetmail">Forgot Password?</Link>
            </div>

            <button className="btn btn-primary w-100">Login</button>

            <p className="text-center mt-3">
              Don't have an account? <Link to="/">Register</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default LoginForm;
