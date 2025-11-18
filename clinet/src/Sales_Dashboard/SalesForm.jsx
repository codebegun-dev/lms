import React, { useState, useEffect } from "react";
import axios from "axios";

function SalesForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    gender: "",
    passedOutYear: "",
    qualification: "",
    courseId: "",
    status: "INITIAL"
  });

  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/courses/all");
        if (Array.isArray(res.data)) setCourses(res.data);
      } catch {
        setApiError("Failed to load courses!");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/saleCourse/student", formData);
      setSuccessMsg("Enquiry submitted successfully!");
      setErrors({});
      setApiError("");
      setFormData({
        studentName: "",
        phone: "",
        email: "",
        gender: "",
        passedOutYear: "",
        qualification: "",
        courseId: "",
        status: "INITIAL"
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong!";
      const lower = msg.toLowerCase();
      if (lower.includes("email")) setErrors({ email: msg });
      else if (lower.includes("phone")) setErrors({ phone: msg });
      else if (lower.includes("name")) setErrors({ studentName: msg });
      else setApiError(msg);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card border-0 shadow-lg rounded-4">
            {/* Card Header */}
            <div className="card-header bg-primary text-white border-0 rounded-top-4 py-3">
              <div className="text-center">
                <h4 className="fw-bold mb-1">Student Enquiry Form</h4>
                <p className="mb-0 opacity-75 small">Fill in the details to submit your enquiry</p>
              </div>
            </div>

            <div className="card-body p-3 p-md-4">
              {/* Alert Messages */}
              {apiError && (
                <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-3" role="alert">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-danger me-2 rounded-circle p-1">
                      !
                    </span>
                    <strong className="small">{apiError}</strong>
                  </div>
                  <button type="button" className="btn-close btn-sm" onClick={() => setApiError("")}></button>
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success alert-dismissible fade show shadow-sm mb-3" role="alert">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2 rounded-circle p-1">
                      ✓
                    </span>
                    <strong className="small">{successMsg}</strong>
                  </div>
                  <button type="button" className="btn-close btn-sm" onClick={() => setSuccessMsg("")}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Row 1: Name | Phone */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className={`form-control border-2 ${errors.studentName ? "is-invalid border-danger" : ""}`}
                      placeholder="Enter full name"
                    />
                    {errors.studentName && (
                      <div className="invalid-feedback small">{errors.studentName}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-control border-2 ${errors.phone ? "is-invalid border-danger" : ""}`}
                      placeholder="10-digit phone"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback small">{errors.phone}</div>
                    )}
                  </div>
                </div>

                {/* Row 2: Email | Gender */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control border-2 ${errors.email ? "is-invalid border-danger" : ""}`}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback small">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`form-select border-2 ${errors.gender ? "is-invalid border-danger" : ""}`}
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    {errors.gender && (
                      <div className="invalid-feedback small">{errors.gender}</div>
                    )}
                  </div>
                </div>

                {/* Row 3: Passed Out Year | Qualification */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Passed Out Year</label>
                    <input
                      type="text"
                      name="passedOutYear"
                      placeholder="YYYY"
                      value={formData.passedOutYear}
                      onChange={handleChange}
                      className={`form-control border-2 ${errors.passedOutYear ? "is-invalid border-danger" : ""}`}
                    />
                    {errors.passedOutYear && (
                      <div className="invalid-feedback small">{errors.passedOutYear}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className={`form-control border-2 ${errors.qualification ? "is-invalid border-danger" : ""}`}
                      placeholder="Degree / Diploma"
                    />
                    {errors.qualification && (
                      <div className="invalid-feedback small">{errors.qualification}</div>
                    )}
                  </div>
                </div>

                {/* Row 4: Course Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Select Course</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className="form-select border-2"
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary fw-bold py-2 rounded-3 shadow-sm"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>

            {/* Card Footer */}
            <div className="card-footer bg-light border-0 rounded-bottom-4 py-2">
              <p className="text-center text-muted small mb-0">
                <span className="badge bg-info text-dark me-1">ℹ️</span>
                Fields marked with <span className="text-danger fw-bold">*</span> are required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesForm;