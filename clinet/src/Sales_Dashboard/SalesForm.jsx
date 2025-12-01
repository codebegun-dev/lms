import React, { useState, useEffect } from "react";
import axios from "axios";

function SalesForm() {
  const [formData, setFormData] = useState({
    leadName: "",
    phone: "",
    email: "",
    gender: "",
    passedOutYear: "",
    qualification: "",
    courseId: "",
    status: "NEW",
    college: "",
    city: "",
    source: "",
    campaign: ""
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
  if (!formData.leadName.trim()) newErrors.leadName = "Name is required";
  if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const loggedInUserId = localStorage.getItem("userId");

    // Prepare final request body
    const finalRequest = {
      ...formData,
      loggedInUserId: Number(loggedInUserId),
      // status: formData.status === "NEW" ? "NEW" : formData.status
    };

    // Post WITHOUT query param
    await axios.post(
      "http://localhost:8080/api/saleCourse/leads",
      finalRequest
    );

    setSuccessMsg("Enquiry submitted successfully!");
    setErrors({});
    setApiError("");

    // Reset form fields
    setFormData({
      leadName: "",
      phone: "",
      email: "",
      gender: "",
      passedOutYear: "",
      qualification: "",
      courseId: "",
      status: "NEW",
      college: "",
      city: "",
      source: "",
      campaign: ""
    });

  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong!";
    const lower = msg.toLowerCase();

    if (lower.includes("email")) setErrors({ email: msg });
    else if (lower.includes("phone")) setErrors({ phone: msg });
    else if (lower.includes("name")) setErrors({ leadName: msg });
    else setApiError(msg);
  }
};


  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow rounded-3">

            <div className="card-header bg-primary text-white py-2 rounded-top-3">
              <h5 className="text-center mb-0">Lead Enquiry Form</h5>
            </div>

            <div className="card-body p-3">

              {apiError && (
                <div className="alert alert-danger py-2">{apiError}</div>
              )}
              {successMsg && (
                <div className="alert alert-success py-2">{successMsg}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="leadName"
                      value={formData.leadName}
                      onChange={handleChange}
                      className={`form-control ${errors.leadName ? "is-invalid" : ""}`}
                    />
                    {errors.leadName && <div className="invalid-feedback">{errors.leadName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-semibold">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="small fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-semibold">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="small fw-semibold">Passed Out Year</label>
                    <input
                      type="text"
                      name="passedOutYear"
                      value={formData.passedOutYear}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="YYYY"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-semibold">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Degree/Diploma"
                    />
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="small fw-semibold">College</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="College Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="small fw-semibold">Source</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Source</option>
                      <option value="Instagram">Instagram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Refer">Refer</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="small fw-semibold">Campaign</label>
                    <select
                      name="campaign"
                      value={formData.campaign}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Campaign</option>
                      <option value="Campaign 1">General</option>
                      <option value="Campaign 2">Campaign-1</option>
                      <option value="Campaign 3">Campaign-2</option>
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="small fw-semibold">Select Course</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.courseId} value={c.courseId}>
                        {c.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-primary w-100 mt-3">Submit</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesForm;
