import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import registrationImage from "../assets/registrationImage.png";

function RegistrationForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if coming from admin registration
  const isAdminRegistration = location.state?.adminRegistration || false;
  const defaultRole = location.state?.defaultRole || "STUDENT";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: isAdminRegistration ? "Admin@123" : "",
    confirmPassword: isAdminRegistration ? "Admin@123" : "",
    role: defaultRole,
  });
  //   password: "",
  //   confirmPassword: "",
  //   role:"STUDENT",
  //   status:"ACTIVE"
  //  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAdminRegistration) {
      setFormData((prev) => ({
        ...prev,
        role: "ADMIN",
        password: "Admin@123",
        confirmPassword: "Admin@123",
      }));
    }
  }, [isAdminRegistration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const tempErrors = {};

    if (!formData.firstName.trim())
      tempErrors.firstName = "First name is required";
    else if (formData.firstName.length < 3 || formData.firstName.length > 30)
      tempErrors.firstName = "First name should be 3-30 characters";

    if (!formData.lastName.trim())
      tempErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 3 || formData.lastName.length > 30)
      tempErrors.lastName = "Last name should be 3-30 characters";

    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format";

    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      tempErrors.phone = "Phone must be 10 digits";

    if (!isAdminRegistration) {
      if (!formData.password.trim())
        tempErrors.password = "Password is required";
      else if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,}$/.test(
          formData.password
        )
      )
        tempErrors.password =
          "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character & min 8 chars";

      if (formData.password !== formData.confirmPassword)
        tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/api/user", formData);

      setSuccess(
        isAdminRegistration
          ? "Admin registered successfully!"
          : "User registered successfully!"
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: isAdminRegistration ? "Admin@123" : "",
        confirmPassword: isAdminRegistration ? "Admin@123" : "",
        role: defaultRole,
      });

      // Redirect after success
      setTimeout(() => {
        if (isAdminRegistration) {
          navigate("/admin-dashboard/usermanagement");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data)
        setErrors(error.response.data);
      else setErrors({ general: "Unable to connect to server" });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg p-4 rounded-4">
        {/* Left Section */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center px-4">
          <img
            src={registrationImage}
            alt="Register"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px" }}
          />
          <h2 className="fw-bold text-primary mb-3">
            {isAdminRegistration ? "Add New Admin" : "Join Our Community"}
          </h2>
          <p className="mb-2 text-secondary">
            {isAdminRegistration
              ? "Add a new administrator to manage the platform."
              : "Join our community of learners and professionals. Access exclusive resources and connect with experts to grow your career."}
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="col-12 col-md-6 p-4">
          <h3 className="text-center mb-4 text-primary fw-bold">
            {isAdminRegistration ? "Add Admin" : "Register"}
          </h3>

          {success && (
            <div className="alert alert-success text-center">{success}</div>
          )}
          {errors.general && (
            <div className="alert alert-danger text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Surname</label>
              <input
                type="text"
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="text"
                className={`form-control ${
                  errors.phone ? "is-invalid" : ""
                }`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Password (hidden for admin registration) */}
            {!isAdminRegistration && (
              <>
                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                  <span
                    className="position-absolute"
                    style={{
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword.password,
                      })
                    }
                  >
                    {showPassword.password ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  />
                  <span
                    className="position-absolute"
                    style={{
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Role (hidden for admin registration) */}
            {!isAdminRegistration && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className={`form-select ${
                    errors.role ? "is-invalid" : ""
                  }`}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                  <option value="INTERVIEWER">Interviewer</option>
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
              </div>
            )}

            {isAdminRegistration && (
              <div className="alert alert-info">
                <strong>Default Password:</strong> Admin@123 <br />
                The new admin will use this password to login.
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              {isAdminRegistration ? "Add Admin" : "Register"}
            </button>

            {!isAdminRegistration && (
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-primary fw-semibold">
                  Login
                </Link>
              </p>
            )}

            {isAdminRegistration && (
              <p className="text-center mt-3">
                <Link
                  to="/admin-dashboard/usermanagement"
                  className="text-primary fw-semibold"
                >
                  ← Back to User Management
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
