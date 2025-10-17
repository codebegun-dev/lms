import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && formData.email === storedUser.email && formData.password === storedUser.password) {
        setErrors({});
        navigate("/dashboard");
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow rounded overflow-hidden flex-column flex-md-row">
        {/* Left Image */}
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

        {/* Right Form */}
        <div className="col-md-6 p-4 bg-light d-flex align-items-center flex-column">
          <div className="w-100">
            <h2 className="text-center mb-4 text-primary">Login</h2>

            {errors.general && (
              <div className="alert alert-danger text-center">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute eye-icon "
                   onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="d-flex justify-content-between mb-3">
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
};

export default LoginForm;
