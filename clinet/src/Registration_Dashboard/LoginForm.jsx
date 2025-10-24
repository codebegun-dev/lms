import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registrationImage from "../assets/registrationImage.png";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
  };

  // Validate input fields
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        formData
      );

      const { role, userId, firstName, email } = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({ userId, firstName, email, role })
      );

      if (role === "STUDENT") navigate("/dashboard");
      else if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "INTERVIEWER") navigate("/interviewer-dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setGeneralError(error.response.data.message || "Invalid credentials");
      } else {
        setGeneralError("Unable to connect to server");
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
          <p className="text-secondary text-center">
            Log in to access your learning journey.
          </p>
        </div>

        {/* Right Side */}
        <div className="col-md-6 p-4 d-flex align-items-center justify-content-center">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>

            {generalError && (
              <div className="alert alert-danger text-center">{generalError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={togglePasswordVisibility}
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* Forgot password */}
              <div className="text-end mb-3">
                <Link to="/sendresetmail" className="text-primary fw-semibold">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>

              {/* Register */}
              <p className="text-center mt-3">
                Don’t have an account?{" "}
                <Link to="/" className="text-primary fw-semibold">
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
