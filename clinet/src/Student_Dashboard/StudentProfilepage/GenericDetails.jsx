 // GenericDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL; 


const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const GenericDetails = ({ onCompletionChange = () => { } }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const initialForm = {
    workExperience: "",
    careerGap: "",
    currentState: "",
    currentDistrict: "",
    currentSubDistrict: "",
    currentVillage: "",
    currentStreet: "",
    currentPincode: "",
    permanentState: "",
    permanentDistrict: "",
    permanentSubDistrict: "",
    permanentVillage: "",
    permanentStreet: "",
    permanentPincode: "",
    githubProfile: "",
    linkedinProfile: "",
    adhaarFilePath: "",
    resumeFilePath: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [editingData, setEditingData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [adhaarFileName, setAdhaarFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [originalData, setOriginalData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  // ================= GET DETAILS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `${API}/api/student-generic-details/${userId}`
        );

        if (resp.data) {
          const mapped = {
            workExperience: resp.data.workExperience || "",
            careerGap: resp.data.careerGap || "",
            currentState: resp.data.currentState || "",
            currentDistrict: resp.data.currentDistrict || "",
            currentSubDistrict: resp.data.currentSubDistrict || "",
            currentVillage: resp.data.currentVillage || "",
            currentStreet: resp.data.currentStreet || "",
            currentPincode: resp.data.currentPincode || "",
            permanentState: resp.data.permanentState || "",
            permanentDistrict: resp.data.permanentDistrict || "",
            permanentSubDistrict: resp.data.permanentSubDistrict || "",
            permanentVillage: resp.data.permanentVillage || "",
            permanentStreet: resp.data.permanentStreet || "",
            permanentPincode: resp.data.permanentPincode || "",
            githubProfile: resp.data.githubProfile || "",
            linkedinProfile: resp.data.linkedinProfile || "",
            adhaarFilePath: resp.data.adhaarFilePath || "",
            resumeFilePath: resp.data.resumeFilePath || "",
          };

          setFormData(mapped);
          setEditingData(mapped);
          setOriginalData(mapped);
          calculateCompletion(mapped);
        }
      } catch (err) {
        console.error("Error fetching generic details:", err);
        alert("Failed to load your details.");
      }
    };

    fetchData();
  }, [userId]);

  // Update completion percentage
  useEffect(() => {
    calculateCompletion(formData);
  }, [formData]);

  const calculateCompletion = (data = formData) => {
    const fields = Object.values(data);
    const filled = fields.filter(
      (f) => f !== null && f !== undefined && String(f).trim() !== ""
    ).length;
    const pct = Math.round((filled / fields.length) * 100);
    onCompletionChange(pct);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "currentPincode" || name === "permanentPincode") && value.length > 6)
      return;

    setEditingData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditingData(formData);
    setAdhaarFileName("");
    setResumeFileName("");
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingData(formData);
    setErrors({});
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/;
    const linkedinRegex =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[A-Za-z0-9_-]+\/?$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    const newErrors = {};

    if (!editingData.adhaarFilePath)
      newErrors.adhaarFilePath = "Please upload Aadhaar card.";

    if (!editingData.resumeFilePath)
      newErrors.resumeFilePath = "Please upload Resume.";

    if (editingData.githubProfile && !githubRegex.test(editingData.githubProfile.trim()))
      newErrors.githubProfile = "Invalid GitHub URL.";

    if (editingData.linkedinProfile && !linkedinRegex.test(editingData.linkedinProfile.trim()))
      newErrors.linkedinProfile = "Invalid LinkedIn URL.";

    if (editingData.currentPincode && !pincodeRegex.test(editingData.currentPincode))
      newErrors.currentPincode = "Enter a valid 6-digit pincode.";

    if (editingData.permanentPincode && !pincodeRegex.test(editingData.permanentPincode))
      newErrors.permanentPincode = "Enter a valid 6-digit pincode.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE DETAILS (PUT) =================
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = { ...editingData, userId };

      const resp = await axios.put(
        `${API}/api/student-generic-details/update`,
        payload
      );

      if (resp.data) {
        const mapped = {
          ...editingData,
          adhaarFilePath: resp.data.adhaarFilePath || editingData.adhaarFilePath,
          resumeFilePath: resp.data.resumeFilePath || editingData.resumeFilePath,
        };

        setFormData(mapped);
        setEditingData(mapped);
        setOriginalData(mapped);
        setIsEditing(false);
        alert("Saved successfully.");
      }
    } catch (err) {
      console.error("Error saving details:", err);
      alert("Failed to save details.");
    }
  };

  // ================= FILE UPLOAD =================
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "adhaar") setAdhaarFileName(file.name);
    else setResumeFileName(file.name);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const resp = await axios.post(
        `${API}/api/student-generic-details/upload/${userId}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      )

      // axios.post(
      //   `http://localhost:8080/api/student-generic-details/upload/${userId}/${type}`,
      //   fd,
      //   { headers: { "Content-Type": "multipart/form-data" } }
      // );




      if (resp.data) {
        const updated = {
          ...editingData,
          adhaarFilePath:
            type === "adhaar" ? resp.data.adhaarFilePath : editingData.adhaarFilePath,
          resumeFilePath:
            type === "resume" ? resp.data.resumeFilePath : editingData.resumeFilePath,
        };

        setEditingData(updated);
        setFormData(updated);
        setOriginalData(updated);
        setErrors((prev) => ({ ...prev, [`${type}FilePath`]: "" }));

        alert(
          `${type === "adhaar" ? "Aadhaar" : "Resume"} uploaded successfully.`
        );
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("File upload failed.");
      
    }
  };

  // ================= VIEW DOCUMENT =================
  const viewDocument = (type) => {
    const corrected = type.toLowerCase(); // IMPORTANT FIX
    const url = `${API}/api/student-generic-details/${userId}/document/${corrected}`;
    window.open(url, "_blank");
  };

  const renderInput = (label, name, placeholder = "", props = {}) => (
    <div className="col-md-4 mb-2">
      <label className="form-label fw-semibold">{label}</label>
      <input
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={editingData[name] ?? ""}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder={placeholder}
        {...props}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

   return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">Generic Details</h5>
        {!isEditing ? (
          <button className="btn btn-outline-primary btn-sm me-2" onClick={startEdit}>
            Edit
          </button>
        ) : (
          <div>
            <button className="btn btn-secondary btn-sm me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="row g-3">

          {/* Work Experience */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Work Experience *</label>
            <select
              name="workExperience"
              className="form-select"
              value={editingData.workExperience}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>

          {/* Career Gap */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Career Gap</label>
            <select
              name="careerGap"
              className="form-select"
              value={editingData.careerGap}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Career Gap</option>
              <option value="No Gap">No Gap</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="3+ Years">3+ Years</option>
            </select>
          </div>

          {/* Current Address */}
          <div className="col-12 mt-3 border-bottom pb-2 fw-bold">Current Address</div>

          <div className="col-md-4">
            <label className="form-label">State *</label>
            <select
              className="form-select"
              name="currentState"
              value={editingData.currentState}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select State</option>
              {indianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {renderInput("District *", "currentDistrict")}
          {renderInput("Sub District", "currentSubDistrict")}
          {renderInput("Village/Town *", "currentVillage")}
          {renderInput("Street/Building No/Floor", "currentStreet")}
          {renderInput("Pincode *", "currentPincode", "", { maxLength: 6 })}

          {/* Permanent Address */}
          <div className="col-12 mt-3 border-bottom pb-2 fw-bold">Permanent Address</div>

          <div className="col-md-4">
            <label className="form-label">State *</label>
            <select
              className="form-select"
              name="permanentState"
              value={editingData.permanentState}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select State</option>
              {indianStates.map((s) => (
                <option key={`perm-${s}`} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {renderInput("District *", "permanentDistrict")}
          {renderInput("Sub District", "permanentSubDistrict")}
          {renderInput("Village/Town *", "permanentVillage")}
          {renderInput("Street/Building No/Floor", "permanentStreet")}
          {renderInput("Pincode *", "permanentPincode", "", { maxLength: 6 })}

          {/* Social Links */}
          {renderInput("GitHub Profile", "githubProfile", "https://github.com/username")}
          {renderInput("LinkedIn Profile", "linkedinProfile", "https://linkedin.com/in/username")}

          {/* Aadhaar Upload */}
          <div className="col-md-6">
            <label className="form-label">Aadhaar Card *</label>

            {!isEditing ? (
              formData.adhaarFilePath ? (
                <div className="d-flex align-items-center">
                  <button className="btn btn-info btn-sm me-2"
                    onClick={() => viewDocument("AADHAAR")}
                  >
                    View Aadhaar
                  </button>
                  <small className="text-muted">{formData.adhaarFilePath}</small>
                </div>
              ) : (
                <p className="text-muted fst-italic">No document uploaded</p>
              )
            ) : (
              <div>
                <input
                  type="file"
                  className={`form-control ${errors.adhaarFilePath ? "is-invalid" : ""}`}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, "adhaar")}
                />
                {errors.adhaarFilePath && <div className="invalid-feedback">{errors.adhaarFilePath}</div>}
                {adhaarFileName && <div className="mt-1 text-success">{adhaarFileName}</div>}
              </div>
            )}
          </div>

          {/* Resume Upload */}
          <div className="col-md-6">
            <label className="form-label">Resume *</label>

            {!isEditing ? (
              formData.resumeFilePath ? (
                <div className="d-flex align-items-center">
                  <button className="btn btn-info btn-sm me-2"
                    onClick={() => viewDocument("RESUME")}
                  >
                    View Resume
                  </button>
                  <small className="text-muted">{formData.resumeFilePath}</small>
                </div>
              ) : (
                <p className="text-muted fst-italic">No document uploaded</p>
              )
            ) : (
              <div>
                <input
                  type="file"
                  className={`form-control ${errors.resumeFilePath ? "is-invalid" : ""}`}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
                {errors.resumeFilePath && <div className="invalid-feedback">{errors.resumeFilePath}</div>}
                {resumeFileName && <div className="mt-1 text-success">{resumeFileName}</div>}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GenericDetails;   