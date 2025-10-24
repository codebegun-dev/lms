import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import registrationImage from "../assets/registrationImage.png";

const ForgotPasswordForm = () => {
  const [formData, setFormData] = useState({
     newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    // Retrieve email/phone stored in localStorage from SendResetMail
    const storedData = localStorage.getItem("resetEmailOrPhone");
    if (storedData) setFormData((prev) => ({ ...prev, emailOrPhone: storedData }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validateForm = () => {
    const tempErrors = {};
     if (!formData.newPassword.trim()) tempErrors.newPassword = "New password is required";
    if (formData.newPassword !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    if (!token) {
      setErrors({ newPassword: "Invalid reset link" });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/reset-password",
        {
          token: token,
          newPassword: formData.newPassword,
        }
      );
      setSuccess(response.data);
      setFormData({ ...formData, newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ newPassword: error.response.data.message || "Something went wrong" });
      } else {
        setErrors({ newPassword: "Unable to connect to server" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg rounded-4 overflow-hidden">
        {/* Left Side: Image + title + text */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center bg-light p-4">
          <img
            src={registrationImage}
            alt="Reset Password"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px", objectFit: "cover" }}
          />
          <h2 className="fw-bold text-primary mb-3">Reset Your Password</h2>
          <p className="mb-2 text-secondary">
            Please reset the password for your account.
          </p>
           
        </div>

        {/* Right Side: Form */}
        <div className="col-md-6 p-4">
          <h3 className="text-center mb-4 text-primary fw-bold">Reset Password</h3>

          {success && (
            <p className="alert alert-success text-center fw-bold fs-5">{success}</p>
          )}
          {errors.emailOrPhone && (
            <div className="alert alert-danger text-center fw-bold fs-5">{errors.emailOrPhone}</div>
          )}
          {errors.newPassword && (
            <div className="alert alert-danger text-center fw-bold fs-5">{errors.newPassword}</div>
          )}
          {errors.confirmPassword && (
            <div className="alert alert-danger text-center fw-bold fs-5">{errors.confirmPassword}</div>
          )}

          <form onSubmit={handleSubmit}>
            

            {/* New Password */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <span
                onClick={() => togglePassword("newPassword")}
                style={{ position: "absolute", right: "10px", top: "38px", cursor: "pointer" }}
              >
                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <span
                onClick={() => togglePassword("confirmPassword")}
                style={{ position: "absolute", right: "10px", top: "38px", cursor: "pointer" }}
              >
                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">
                Reset Password
              </button>
            </div>

            <p className="text-center mt-3">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary fw-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
