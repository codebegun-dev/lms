import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [activeBatches, setActiveBatches] = useState([]);
  const [upcomingBatches, setUpcomingBatches] = useState([]);
  const [completedBatches, setCompletedBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    courseName: "",
    size: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    totalFee: "",
    overallCTC: "0%",
    singleInstallment: "",
    ctcSingle: "",
    firstInstallment: "",
    secondInstallment: "",
    ctcDual: "",
  });

  const BATCH_API = "http://localhost:8080/api/batches";
  const COURSE_API = "http://localhost:8080/api/courses/all";

  // === FETCH DATA ===
  const fetchBatches = async () => {
    try {
      const [allRes, activeRes, upcomingRes, completedRes] = await Promise.all([
        axios.get(`${BATCH_API}/all`),
        axios.get(`${BATCH_API}/active`),
        axios.get(`${BATCH_API}/upcoming`),
        axios.get(`${BATCH_API}/completed`),
      ]);

      setBatches(allRes.data);
      setActiveBatches(activeRes.data);
      setUpcomingBatches(upcomingRes.data);
      setCompletedBatches(completedRes.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSE_API);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();

    const interval = setInterval(() => {
      fetchBatches();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // === TIME HELPERS ===
  const formatTo12Hour = (time24) => {
    if (!time24) return "";
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const convertTo24Hour = (time12) => {
    if (!time12) return "";
    let [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // === HANDLERS ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Frontend required validation
    const newErrors = {};
    if (!formData.name) newErrors.name = "Batch name is required";
    if (!formData.courseName) newErrors.courseName = "Associated course is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Unique batch validation
    const duplicate = batches.find(
      (b) =>
        b.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        b.courseName === formData.courseName &&
        b.id !== editingBatchId
    );
    if (duplicate) {
      newErrors.name = "Batch with this name already exists for the selected course";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { ...formData };

      if (editingBatchId) {
        await axios.put(`${BATCH_API}/update/${editingBatchId}`, payload);
        alert("Batch updated successfully!");
      } else {
        await axios.post(`${BATCH_API}/create`, payload);
        alert("Batch created successfully!");
      }

      resetForm();
      fetchBatches();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.general) {
        setErrors({ name: err.response.data.general });
      } else {
        console.error("Error saving batch:", err);
      }
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      name: batch.name || "",
      courseName: batch.courseName || "",
      size: batch.size || "",
      startDate: batch.startDate || "",
      endDate: batch.endDate || "",
      startTime: batch.startTime || "",
      endTime: batch.endTime || "",
      totalFee: batch.totalFee || "",
      overallCTC: batch.overallCTC || "0%",
      singleInstallment: batch.singleInstallment || "",
      ctcSingle: batch.ctcSingle || "",
      firstInstallment: batch.firstInstallment || "",
      secondInstallment: batch.secondInstallment || "",
      ctcDual: batch.ctcDual || "",
    });
    setEditingBatchId(batch.id);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await axios.delete(`${BATCH_API}/delete/${id}`);
      fetchBatches();
    } catch (err) {
      console.error("Error deleting batch:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      courseName: "",
      size: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      totalFee: "",
      overallCTC: "0%",
      singleInstallment: "",
      ctcSingle: "",
      firstInstallment: "",
      secondInstallment: "",
      ctcDual: "",
    });
    setEditingBatchId(null);
    setErrors({});
  };

  return (
    <div className="container py-1">
      <h3 className="fw-bold mb-4">Batch Management</h3>

      {/* STATS */}
      <div className="row text-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="border rounded p-3 shadow-sm bg-white">
            <h5>Total Active Batches</h5>
            <p className="fs-4 fw-semibold text-primary">{activeBatches.length}</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="border rounded p-3 shadow-sm bg-white">
            <h5>Upcoming Batches</h5>
            <p className="fs-4 fw-semibold text-warning">{upcomingBatches.length}</p>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="border rounded p-3 shadow-sm bg-white">
            <h5>Completed Batches</h5>
            <p className="fs-4 fw-semibold text-success">{completedBatches.length}</p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">{editingBatchId ? "Edit Batch" : "Create New Batch"}</h5>
          <form onSubmit={handleSubmit}>
            {/* Main Batch Info */}
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Batch Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Associated Course *</label>
                <select
                  className={`form-select ${errors.courseName ? "is-invalid" : ""}`}
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseName}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
                {errors.courseName && <div className="invalid-feedback">{errors.courseName}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Batch Size *</label>
                <input
                  type="number"
                  className={`form-control ${errors.size ? "is-invalid" : ""}`}
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
                {errors.size && <div className="invalid-feedback">{errors.size}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
              </div>
              <div className="col-md-3">
                <label className="form-label">End Time *</label>
                <input
                  type="time"
                  className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
                {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
              </div>
            </div>

            {/* Total Fee & Overall CTC */}
            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Total Fee</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalFee"
                  value={formData.totalFee}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Overall CTC</label>
                <input
                  type="text"
                  className="form-control"
                  name="overallCTC"
                  value={formData.overallCTC}
                  readOnly
                />
              </div>
            </div>

            {/* Single Installment Row */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label className="form-label">Single Installment Fee</label>
                <input
                  type="number"
                  className="form-control"
                  name="singleInstallment"
                  value={formData.singleInstallment}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">CTC % (Single)</label>
                <input
                  type="text"
                  className="form-control"
                  name="ctcSingle"
                  value={formData.ctcSingle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Dual Installments Row */}
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label className="form-label">First Installment</label>
                <input
                  type="number"
                  className="form-control"
                  name="firstInstallment"
                  value={formData.firstInstallment}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Second Installment</label>
                <input
                  type="number"
                  className="form-control"
                  name="secondInstallment"
                  value={formData.secondInstallment}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">CTC % (Dual)</label>
                <input
                  type="text"
                  className="form-control"
                  name="ctcDual"
                  value={formData.ctcDual}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className={`btn ${editingBatchId ? "btn-warning" : "btn-primary"}`}
              >
                {editingBatchId ? "Update Batch" : "Create Batch"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Existing Batches</h5>
          {batches.length === 0 ? (
            <p>No batches available yet.</p>
          ) : (
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Batch Name</th>
                  <th>Course</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Batch Size</th>
                  <th>Schedule</th>
                  <th>Total Fee</th>
                  <th>CTC / Installments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.courseName || "—"}</td>
                    <td>{b.startDate}</td>
                    <td>{b.endDate || "—"}</td>
                    <td>{b.size || "—"}</td>
                    <td>
                      {formatTo12Hour(b.startTime)} - {formatTo12Hour(b.endTime)}
                    </td>
                    <td>{b.totalFee || "—"}</td>
                    <td>
                      {b.firstInstallment && b.secondInstallment ? (
                        <div>
                          <strong>Dual Installments</strong>
                          <div>{b.firstInstallment} (1st)</div>
                          <div>{b.secondInstallment} (2nd)</div>
                          <div>{b.ctcDual}</div>
                        </div>
                      ) : b.singleInstallment ? (
                        <div>
                          <strong>Single Installment</strong>
                          <div>{b.singleInstallment} (1st)</div>
                          <div>{b.ctcSingle}</div>
                        </div>
                      ) : (
                        b.overallCTC || "0%"
                      )}
                    </td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
