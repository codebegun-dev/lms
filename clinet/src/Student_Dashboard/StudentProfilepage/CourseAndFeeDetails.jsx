// StudentProfilepage/CourseAndFeeDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaEdit, FaSave, FaTimes, FaLock, 
  FaInfoCircle, FaGraduationCap, FaRupeeSign 
} from "react-icons/fa";

const API_BASE = "http://localhost:8080";

const CourseAndFeeDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    batchId: "",
    batchName: "",
    startDate: "",
    totalFee: 0,
    paidFee: 0,
    balanceFee: 0
  });

  const [originalData, setOriginalData] = useState({});

  // Check user role and fetch initial data
  useEffect(() => {
    fetchUserRole();
    fetchCoursesAndBatches();
    fetchStudentCourseAndFeeData();
  }, []);

  useEffect(() => {
    // Calculate completion percentage
    const completion = calculateCompletion();
    if (onCompletionChange) {
      onCompletionChange(completion);
    }
  }, [formData]);

  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 5; // courseName, batchName, startDate, totalFee, paidFee
    
    if (formData.courseName) completedFields++;
    if (formData.batchName) completedFields++;
    if (formData.startDate) completedFields++;
    if (formData.totalFee > 0) completedFields++;
    if (formData.paidFee >= 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const fetchUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user?.role?.name || user?.role || "";
      setCurrentUserRole(role.toUpperCase());
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  // Fetch available courses and batches from API
  const fetchCoursesAndBatches = async () => {
    try {
      // Fetch courses
      const coursesRes = await axios.get(`${API_BASE}/api/courses/all`);
      setCourses(coursesRes.data || []);

      // Fetch batches
      const batchesRes = await axios.get(`${API_BASE}/api/batches/all`);
      setBatches(batchesRes.data || []);
    } catch (err) {
      console.error("Error fetching courses/batches:", err);
    }
  };

  // Fetch student's current course and fee data
  const fetchStudentCourseAndFeeData = async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.userId || user?.id;
      
      // Try to fetch student's course details
      let courseData = {};
      let feeData = {};
      
      try {
        // Fetch course details
        const courseRes = await axios.get(`${API_BASE}/api/student/course-details/${userId}`);
        courseData = courseRes.data || {};
        
        // Fetch fee details
        const feeRes = await axios.get(`${API_BASE}/api/student/fee-details/${userId}`);
        feeData = feeRes.data || {};
      } catch (err) {
        console.log("No course/fee details found, using default");
      }

      // Set data
      const defaultData = {
        courseId: courseData.courseId || "",
        courseName: courseData.courseName || "Full Stack Java",
        batchId: courseData.batchId || "",
        batchName: courseData.batchName || "Batch A-2025",
        startDate: courseData.startDate || "2025-02-15",
        totalFee: feeData.totalFee || 50000,
        paidFee: feeData.paidFee || 25000,
        balanceFee: feeData.balanceFee || 25000
      };

      setFormData(defaultData);
      setOriginalData(defaultData);
      
    } catch (err) {
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter batches by selected course
  const getBatchesForCourse = () => {
    if (!formData.courseId && !formData.courseName) return batches;
    
    return batches.filter(batch => {
      if (formData.courseId) {
        return batch.courseId === formData.courseId;
      }
      return batch.courseName === formData.courseName;
    });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === "courseId" || field === "courseName") {
        updated.batchId = "";
        updated.batchName = "";
        
        if (field === "courseId" && value) {
          const selectedCourse = courses.find(c => c.courseId === value);
          if (selectedCourse) {
            updated.courseName = selectedCourse.courseName;
          }
        }
      }
      
      if (field === "batchId" && value) {
        const selectedBatch = batches.find(b => b.id === value);
        if (selectedBatch) {
          updated.batchName = selectedBatch.name;
        }
      }
      
      if (field === "totalFee" || field === "paidFee") {
        const total = field === "totalFee" ? (parseInt(value) || 0) : prev.totalFee;
        const paid = field === "paidFee" ? (parseInt(value) || 0) : prev.paidFee;
        updated.balanceFee = Math.max(0, total - paid);
      }
      
      return updated;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!isAdminOrMasterAdmin()) return;
    
    setSaving(true);
    
    try {
      if (formData.paidFee > formData.totalFee) {
        alert("Paid fee cannot exceed total fee!");
        return;
      }
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.userId || user?.id;
      
      const coursePayload = {
        userId,
        courseId: formData.courseId,
        courseName: formData.courseName,
        batchId: formData.batchId,
        batchName: formData.batchName,
        startDate: formData.startDate
      };
      
      const feePayload = {
        userId,
        totalFee: formData.totalFee,
        paidFee: formData.paidFee,
        balanceFee: formData.balanceFee
      };
      
      // Save course details
      await axios.put(`${API_BASE}/api/student/course-details/update`, coursePayload);
      
      // Save fee details
      await axios.put(`${API_BASE}/api/student/fee-details/update`, feePayload);
      
      setOriginalData(formData);
      setIsEditing(false);
      
      alert("Course and Fee details updated successfully!");
      
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  // Check if user can edit
  const isAdminOrMasterAdmin = () => {
    return currentUserRole === "ADMIN" || currentUserRole === "MASTER_ADMIN";
  };

  // Calculate progress percentage
  const progressPercentage = formData.totalFee > 0 
    ? ((formData.paidFee / formData.totalFee) * 100).toFixed(0)
    : "0";

  if (loading) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading course and fee details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      {/* Header */}
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0 d-flex align-items-center">
            <FaGraduationCap className="me-2 text-primary" />
            Course & Fee Details
          </h5>
          {!isAdminOrMasterAdmin() && (
            <span className="badge bg-secondary">
              <FaLock size={10} className="me-1" />
              Read Only
            </span>
          )}
        </div>
        
        {/* Edit/Save/Cancel buttons for Admins */}
        {isAdminOrMasterAdmin() && (
          <div>
            {!isEditing ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(true)}
                title="Edit Course & Fee Details"
              >
                <FaEdit className="me-1" />
                Edit
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FaTimes className="me-1" />
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-1" />
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="row">
          {/* Course Details Section */}
          <div className="col-md-6 border-end pe-md-4">
            <h6 className="fw-bold mb-3 text-primary">
              <FaGraduationCap className="me-2" />
              Course Details
            </h6>
            
            <div className="row g-3">
              {/* Course Selection */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Course *
                </label>
                {isEditing && isAdminOrMasterAdmin() ? (
                  <select
                    className="form-select"
                    value={formData.courseId || formData.courseName}
                    onChange={(e) => {
                      if (e.target.value.startsWith("id:")) {
                        handleInputChange("courseId", e.target.value.replace("id:", ""));
                      } else {
                        handleInputChange("courseName", e.target.value);
                      }
                    }}
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option 
                        key={course.courseId || course.id} 
                        value={course.courseId ? `id:${course.courseId}` : course.courseName}
                      >
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2 bg-light rounded border">
                    {formData.courseName || <span className="text-muted">Not assigned</span>}
                  </div>
                )}
              </div>

              {/* Batch Selection */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Batch *
                </label>
                {isEditing && isAdminOrMasterAdmin() ? (
                  <select
                    className="form-select"
                    value={formData.batchId}
                    onChange={(e) => handleInputChange("batchId", e.target.value)}
                    disabled={!formData.courseId && !formData.courseName}
                  >
                    <option value="">Select Batch</option>
                    {getBatchesForCourse().map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({batch.startDate})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2 bg-light rounded border">
                    {formData.batchName || <span className="text-muted">Not assigned</span>}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Course Start Date
                </label>
                {isEditing && isAdminOrMasterAdmin() ? (
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                ) : (
                  <div className="p-2 bg-light rounded border">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fee Details Section */}
          <div className="col-md-6 ps-md-4">
            <h6 className="fw-bold mb-3 text-primary">
              <FaRupeeSign className="me-2" />
              Fee Details
            </h6>
            
            <div className="row g-3">
              {/* Total Fee */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Total Fee
                </label>
                {isEditing && isAdminOrMasterAdmin() ? (
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.totalFee}
                      onChange={(e) => handleInputChange("totalFee", e.target.value)}
                      min="0"
                      step="1000"
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-light rounded border fw-bold text-primary">
                    ₹ {formData.totalFee.toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              {/* Paid Fee */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Paid Amount
                </label>
                {isEditing && isAdminOrMasterAdmin() ? (
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.paidFee}
                      onChange={(e) => handleInputChange("paidFee", e.target.value)}
                      min="0"
                      max={formData.totalFee}
                      step="1000"
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-light rounded border fw-bold text-success">
                    ₹ {formData.paidFee.toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              {/* Balance Fee */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary">
                  Balance Amount
                </label>
                <div className="p-2 bg-light rounded border fw-bold text-danger">
                  ₹ {formData.balanceFee.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between mb-2 fw-semibold text-secondary">
                  <span>Payment Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
                  <div
                    className="progress-bar progress-bar-striped bg-success"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info/Alert Section */}
        <div className={`alert ${isEditing ? 'alert-info' : 'alert-warning'} mt-4 mb-0 border-0 rounded-3`}>
          <div className="d-flex align-items-start">
            <FaInfoCircle className="me-2 mt-1" />
            <div>
              <strong>
                {isEditing 
                  ? "You are editing course and fee details" 
                  : isAdminOrMasterAdmin()
                    ? "As an administrator, you can edit course and fee details"
                    : "Read-Only Section"
                }
              </strong>
              <p className="mb-0 mt-1 small">
                {isEditing 
                  ? "Changes will update the student's enrollment and fee records."
                  : "Course and fee details are managed by the administration. Contact accounts department for any queries."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAndFeeDetails;