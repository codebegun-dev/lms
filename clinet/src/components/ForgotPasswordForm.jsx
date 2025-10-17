import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Added

const ForgotPasswordForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userEmail = params.get("email") || "";

  const [formData, setFormData] = useState({
    email: userEmail,
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // ✅ Toggle States for Password Visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.newPassword) {
      return setError("Password is required");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
        formData.newPassword
      )
    ) {
      return setError(
        "Password must be 8-12 chars, include uppercase, lowercase, number, and special char"
      );
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    alert(`Password reset successful for ${formData.email}!`);
  };

  return (
    <div className="container mt-5">
      <div className="row shadow rounded overflow-hidden flex-column flex-md-row">

        {/* Left Image */}
        <div className="col-md-6 p-0">
          <img src={registrationImage} alt="Reset" className="img-fluid w-100 image" />
          <div className="text-center py-3 bg-light">
            <h4>Forgot Your Password?</h4>
            <p>Reset it quickly and securely</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-md-6 p-4 bg-light d-flex align-items-center flex-column">
          <div className="w-100">
            <h2 className="text-center mb-4 text-primary">Reset Password</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} readOnly />
              </div>

              {/* New Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3 eye-icon"
                   onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3 eye-icon"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100 mb-3">Reset Password</button>

              <p className="text-center">
                Remembered? <Link to="/login" className="text-primary">Back to Login</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordForm;
