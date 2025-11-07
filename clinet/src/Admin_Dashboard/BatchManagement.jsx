import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";


const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [activeBatches, setActiveBatches] = useState([]);
  const [upcomingBatches, setUpcomingBatches] = useState([]);
  const [completedBatches, setCompletedBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("primary"); // bootstrap types: primary, success, danger, warning

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

  // ====== ALERT ======
  const showAlert = (text, type = "primary") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ====== fetch ======
  const fetchBatches = async () => {
    try {
      const [allRes, activeRes, upcomingRes, completedRes] = await Promise.all([
        axios.get(`${BATCH_API}/all`),
        axios.get(`${BATCH_API}/active`),
        axios.get(`${BATCH_API}/upcoming`),
        axios.get(`${BATCH_API}/completed`),
      ]);
      setBatches(allRes.data || []);
      setActiveBatches(activeRes.data || []);
      setUpcomingBatches(upcomingRes.data || []);
      setCompletedBatches(completedRes.data || []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      showAlert("Failed to load batches", "danger");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSE_API);
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      showAlert("Failed to load courses", "danger");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // ====== time helpers ======
  const formatTo12Hour = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // generate time slots (00:00 to 23:30) stepping 30 minutes
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let min of [0, 30]) {
        const hh = String(h).padStart(2, "0");
        const mm = String(min).padStart(2, "0");
        slots.push(`${hh}:${mm}`); // value in 24h format
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // display time as user-friendly without seconds (use formatTo12Hour)
  const displayTimeOption = (hhmm) => formatTo12Hour(hhmm);

  // ====== handlers ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Batch name is required";
    if (!formData.courseName) newErrors.courseName = "Associated course is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // unique check
    const duplicate = batches.find(
      (b) =>
        b.name?.trim().toLowerCase() === formData.name?.trim().toLowerCase() &&
        b.courseName === formData.courseName &&
        b.id !== editingBatchId
    );
    if (duplicate) newErrors.name = "Batch with this name already exists for the selected course";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = { ...formData };
      if (editingBatchId) {
        await axios.put(`${BATCH_API}/update/${editingBatchId}`, payload);
        showAlert("Batch updated successfully!", "success");
      } else {
        await axios.post(`${BATCH_API}/create`, payload);
        showAlert("Batch created successfully!", "success");
      }
      resetForm();
      fetchBatches();
    } catch (err) {
      console.error("Error saving batch:", err);
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error || "Operation failed!";
      showAlert(serverMsg, "danger");
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
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await axios.delete(`${BATCH_API}/delete/${id}`);
      showAlert("Batch deleted successfully!", "warning");
      fetchBatches();
    } catch (err) {
      console.error("Error deleting batch:", err);
      showAlert("Delete failed!", "danger");
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
    setShowForm(false);
  };

  return (
    <div className="container py-3">
      <h3 className="fw-bold mb-4">Batch Management</h3>

      {/* ALERT */}
      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      {/* STATS CARDS */}
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

      {/* Create New Batch button */}
      {!showForm && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
             Create New Batch
          </button>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">{editingBatchId ? "Edit Batch" : "Create New Batch"}</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Batch Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Associated Course *</label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className={`form-select ${errors.courseName ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.courseId || c.id} value={c.courseName}>
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
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={`form-control ${errors.size ? "is-invalid" : ""}`}
                  />
                  {errors.size && <div className="invalid-feedback">{errors.size}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                  />
                  {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                  />
                  {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">Start Time *</label>
                  <select
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`form-select ${errors.startTime ? "is-invalid" : ""}`}
                  >
                    <option value="">Select</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {displayTimeOption(t)}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">End Time *</label>
                  <select
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`form-select ${errors.endTime ? "is-invalid" : ""}`}
                  >
                    <option value="">Select</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {displayTimeOption(t)}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
                </div>
              </div>

              {/* Fee & CTC */}
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <label className="form-label">Total Fee</label>
                  <input
                    type="number"
                    name="totalFee"
                    value={formData.totalFee}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Overall CTC</label>
                  <input
                    type="text"
                    name="overallCTC"
                    value={formData.overallCTC}
                    readOnly
                    className="form-control"
                  />
                </div>
              </div>

              {/* Single Installment */}
              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <label className="form-label">Single Installment Fee</label>
                  <input
                    type="number"
                    name="singleInstallment"
                    value={formData.singleInstallment}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">CTC % (Single)</label>
                  <input
                    type="text"
                    name="ctcSingle"
                    value={formData.ctcSingle}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Dual */}
              <div className="row g-3 mt-2">
                <div className="col-md-4">
                  <label className="form-label">First Installment</label>
                  <input
                    type="number"
                    name="firstInstallment"
                    value={formData.firstInstallment}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Second Installment</label>
                  <input
                    type="number"
                    name="secondInstallment"
                    value={formData.secondInstallment}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">CTC % (Dual)</label>
                  <input
                    type="text"
                    name="ctcDual"
                    value={formData.ctcDual}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button type="submit" className={`btn ${editingBatchId ? "btn-warning" : "btn-primary"}`}>
                  {editingBatchId ? "Update Batch" : "Create Batch"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
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
            {/* ✅ Removed Total Fee */}
            {/* ✅ Removed CTC Installments */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.courseName || "—"}</td>
              <td>{b.startDate || "—"}</td>
              <td>{b.endDate || "—"}</td>
              <td>{b.size || "—"}</td>
              <td>
                {formatTo12Hour(b.startTime)} - {formatTo12Hour(b.endTime)}
              </td>

              {/* ✅ Removed these:
                <td>{b.totalFee || "—"}</td>
                <td> ... installments ... </td>
              */}

              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(b)}>
                     <FaEdit />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                  <FaTrash />
                </button>
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
