import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png";

function SendResetMail() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.emailOrPhone.trim()) tempErrors.emailOrPhone = "Email or Phone is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/forgot-password`,
        formData
      );

      setSuccess(response.data);
      setFormData({ emailOrPhone: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ emailOrPhone: error.response.data.message });
      } else {
        setErrors({ emailOrPhone: "Unable to connect to server" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row shadow-lg rounded-4 overflow-hidden">
        {/* Left Side: Image with title & text */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center text-center bg-light p-4">
          <img
            src={registrationImage}
            alt="Reset Password"
            className="img-fluid mb-4"
            style={{ maxHeight: "280px", objectFit: "cover" }}
          />
          <h2 className="fw-bold text-primary mb-3">Forgot Your Password?</h2>
          <p className="mb-2 text-secondary">
            Enter your registered email or phone number to receive a secure link to reset your password.
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

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email or Phone</label>
              <input
                type="text"
                className={`form-control ${errors.emailOrPhone ? "is-invalid" : ""}`}
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter your email or phone"
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">
                Send Reset Link
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
}

export default SendResetMail;
