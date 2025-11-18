import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registrationImage from "../assets/registrationImage.png";

function LoginForm() {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //  Handle Input 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
  };

  //   Validate Form  
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.emailOrPhone.trim()) tempErrors.emailOrPhone = "Email or Phone is required";
    if (!formData.password.trim()) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Toggle Password 
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  //Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/user/login", formData);
      const user = res.data;

      if (!user || !user.role) {
        setGeneralError("User role not found. Please contact admin.");
        return;
      }

      const roleName = user.role.trim().toUpperCase();

       localStorage.setItem("user", JSON.stringify(user));

       if (roleName === "MASTER_ADMIN") {
        localStorage.setItem("masterAdminId", user.userId);
      }

      window.dispatchEvent(new Event("user-updated"));
      console.log("Logged in as:", roleName);

      //  Role-based navigation
      if (roleName === "STUDENT") navigate("/student-dashboard");
      else if (roleName === "ADMIN" || roleName === "MASTER_ADMIN") navigate("/admin-dashboard");
      else if (roleName === "INTERVIEWER") navigate("/interviewer-dashboard");
else setGeneralError(`Unknown role: ${roleName}`);

    } catch (error) {
      console.error("Login error:", error);
      setGeneralError(error.response?.data?.message || "Invalid credentials or server error.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg rounded-4 overflow-hidden flex-column flex-md-row">
        {/* Left Side */}
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center bg-light p-4">
          <img
            src={registrationImage}
            alt="Login"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px", objectFit: "cover" }}
          />
          <h2 className="fw-bold text-primary mb-3">Welcome Back!</h2>
          <p className="text-secondary text-center">Log in to access your learning journey.</p>
        </div>

        {/* Right Side */}
        <div className="col-md-6 p-4 d-flex align-items-center justify-content-center">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>
            {generalError && <p className="alert alert-danger text-center">{generalError}</p>}

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
                  placeholder="Enter email or phone"
                />
                {errors.emailOrPhone && <div className="invalid-feedback">{errors.emailOrPhone}</div>}
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
                  placeholder="Enter password"
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
                  style={{ cursor: "pointer" }}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="text-end mb-3">
                <Link to="/sendresetmail" className="text-primary">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary w-100">Login</button>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/" className="text-primary">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;