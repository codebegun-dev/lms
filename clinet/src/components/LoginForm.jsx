import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png"; // using the registration image

function LoginForm() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.emailOrPhone.trim())
      tempErrors.emailOrPhone = "Email or Phone is required";
    if (!formData.password.trim())
      tempErrors.password = "Password is required";
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        formData
      );

      const { role, userId, firstName, email } = response.data;
      localStorage.setItem("user", JSON.stringify({ userId, firstName, email, role }));

      if (role === "STUDENT") navigate("/student-dashboard");
      else if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "INTERVIEWER") navigate("/interviewer-dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setGeneralError(error.response.data.message || "Invalid credentials");
      } else {
        setGeneralError("Unable to connect to server");
    
    if (validate()) {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (!storedUser) {
          setErrors({ general: "No account found. Please register first." });
          return;
        }

        const user = JSON.parse(storedUser);
        
        // Check credentials
        if (formData.email === user.email && formData.password === user.password) {
          setErrors({});
          
          // Store current session
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          
          // Redirect based on role
          if (user.role === "Student") {
            navigate("/student-dashboard");
          } else if (user.role === "Admin" || user.role === "Interviewer") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          setErrors({ general: "Invalid email or password" });
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ general: "An error occurred during login. Please try again." });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg rounded-4 overflow-hidden">
        {/* Left Side: Image with title & text */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center bg-light p-4">
          <img
            src={registrationImage}
            alt="Login"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px", objectFit: "cover" }}
          />
          <h2 className="fw-bold text-primary mb-3">Welcome Back!</h2>
           
          <p className="mb-2 text-secondary">
            Sign in to continue your journey towards new skills, knowledge, and opportunities.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-md-6 p-4">
          <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>

          {generalError && (
            <p className="alert alert-danger text-center fw-bold fs-5">{generalError}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Login as</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
                <option value="INTERVIEWER">Interviewer</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email or Phone</label>
              <input
                type="text"
                className={`form-control ${errors.emailOrPhone ? "is-invalid" : ""}`}
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter email or phone"
              />
              {errors.emailOrPhone && (
                <div className="invalid-feedback">{errors.emailOrPhone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
              <div className="text-end mt-1">
                <Link to="/sendresetmail" className="text-primary fw-semibold">
      <div className="row shadow rounded overflow-hidden flex-column flex-md-row">
        {/* Left Image Section */}
        <div className="col-md-6 p-0">
          <img
            src={registrationImage}
            alt="Login"
            className="img-fluid w-100 image"
          />
          <div className="text-center py-3 bg-light">
            <h4>Welcome Back!</h4>
            <p>Log in to access your account</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 p-4 bg-light d-flex align-items-center flex-column">
          <div className="w-100">
            <h2 className="text-center mb-4 text-primary">Login</h2>

            {/* General Error Message */}
            {errors.general && (
              <div className="alert alert-danger text-center" role="alert">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span
                  className="position-absolute eye-icon"
                  onClick={togglePasswordVisibility}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      togglePasswordVisibility();
                    }
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="d-flex justify-content-between mb-3">
                <Link 
                  to="/sendresetmail" 
                  className="text-primary text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </div>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/" className="text-primary fw-semibold">Register</Link>
            </p>
          </form>
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-100"
              >
                Login
              </button>

              {/* Registration Link */}
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <Link to="/" className="text-primary text-decoration-none">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;