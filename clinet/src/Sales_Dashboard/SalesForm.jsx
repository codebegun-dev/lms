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
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-sm p-4 rounded-3" style={{ width: "650px", minHeight: "450px" }}>
        <h4 className="text-center fw-bold text-primary mb-4">Student Enquiry Form</h4>

        {apiError && <div className="alert alert-danger">{apiError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>

          {/* Row 1: Name | Phone */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={`form-control form-control-lg ${errors.studentName ? "is-invalid" : ""}`}
                placeholder="Enter full name"
                style={{ width: "100%" }}
              />
              {errors.studentName && <div className="invalid-feedback">{errors.studentName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Mobile Number <span className="text-danger">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control form-control-lg ${errors.phone ? "is-invalid" : ""}`}
                placeholder="10-digit phone"
                style={{ width: "100%" }}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>

          {/* Row 2: Email | Gender */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                placeholder="example@gmail.com"
                style={{ width: "100%" }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-select form-select-lg ${errors.gender ? "is-invalid" : ""}`}
                style={{ width: "100%" }}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>
          </div>

          {/* Row 3: Passed Out Year | Qualification */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Passed Out Year</label>
              <input
                type="text"
                name="passedOutYear"
                placeholder="YYYY"
                value={formData.passedOutYear}
                onChange={handleChange}
                className={`form-control form-control-lg ${errors.passedOutYear ? "is-invalid" : ""}`}
                style={{ width: "100%" }}
              />
              {errors.passedOutYear && <div className="invalid-feedback">{errors.passedOutYear}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={`form-control form-control-lg ${errors.qualification ? "is-invalid" : ""}`}
                placeholder="Degree / Diploma"
                style={{ width: "100%" }}
              />
              {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
            </div>
          </div>

          {/* Row 4: Course Dropdown */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="form-label fw-semibold">Select Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="form-select form-select-lg"
                style={{ width: "100%" }}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-primary w-100 fw-bold py-2">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SalesForm;
