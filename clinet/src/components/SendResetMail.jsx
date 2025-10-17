import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import registrationImage from "../assets/registrationImage.png";
 

const SendResetMail = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email) {
      setError("Email is required");
      return;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    setError("");

    // ✅ Pass email via URL parameter
    navigate(`/forgot-password?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <div className="container mt-5">
      <div className="row shadow rounded overflow-hidden flex-column flex-md-row">
        {/* Left Image */}
        <div className="col-md-6 p-0">
          <img src={registrationImage} className="img-fluid w-100 image" alt="Reset"   />
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
                <label className="form-label">Enter Your Email</label>
                <input type="email" name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Send Reset Link
              </button>

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

export default SendResetMail;
