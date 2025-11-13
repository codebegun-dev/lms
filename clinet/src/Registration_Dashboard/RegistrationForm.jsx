
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import registrationImage from "../assets/registrationImage.png";

function RegistrationForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ If admin navigates like: navigate("/register", { state: { adminRegistration: true } })
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

  // ✅ If admin opens registration page → set default password + role
  useEffect(() => {
    if (isAdminRegistration) {
      setFormData((prev) => ({
        ...prev,
        password: "Admin@123",
        confirmPassword: "Admin@123",
        role: "ADMIN",
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

    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";

    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";

    if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone must be 10 digits";

    if (!isAdminRegistration) {
      if (!formData.password.trim()) tempErrors.password = "Password is required";
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
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: isAdminRegistration ? formData.role : "STUDENT",
      status: "ACTIVE"
    };

    const res = await axios.post("http://localhost:8080/api/user", payload);

    // ✅ Show backend success message
    setSuccess(res.data.message);

    // ✅ Store user (for login purpose)
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    setTimeout(() => {
      navigate(isAdminRegistration ? "/admin-dashboard/usermanagement" : "/login");
    }, 1500);

  } catch (error) {
    setErrors({
      general: error.response?.data?.message || "Server error occurred"
    });
  }
};

  return (
    <div className="container mt-5">
      <div className="row shadow-lg p-4 rounded-4">

        {/* IMAGE SIDE */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center px-4">
          <img src={registrationImage} alt="Register" className="img-fluid mb-4" />
          <h2 className="fw-bold text-primary mb-3">
            {isAdminRegistration ? "Create Admin" : "Welcome!"}
          </h2>
        </div>

        {/* FORM SIDE */}
        <div className="col-12 col-md-6 p-4">
          <h3 className="text-center mb-4 text-primary fw-bold">
            {isAdminRegistration ? "Admin Creation" : "Register"}
          </h3>

          {success && <div className="alert alert-success text-center">{success}</div>}
          {errors.general && <div className="alert alert-danger text-center">{errors.general}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                value={formData.firstName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.firstName}</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                value={formData.lastName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.lastName}</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={formData.phone}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.phone}</div>
            </div>

            {!isAdminRegistration && (
              <>
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="position-absolute"
                    style={{ right: "10px", top: "38px", cursor: "pointer" }}
                    onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                  >
                    {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                  <div className="invalid-feedback">{errors.password}</div>
                </div>

                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    className="position-absolute"
                    style={{ right: "10px", top: "38px", cursor: "pointer" }}
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                  >
                    {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                </div>
              </>
            )}

            {isAdminRegistration && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Role</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                  <option value="ADMIN">Admin</option>
                  <option value="INTERVIEWER">Interviewer</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              {isAdminRegistration ? "Create Admin" : "Register"}
            </button>

            {!isAdminRegistration && (
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-primary">
                  Login
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
