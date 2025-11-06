// GenericDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const GenericDetails = ({ onCompletionChange = () => {} }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const initialForm = {
    workExperience: "",
    careerGap: "",

    // Current address
    currentState: "",
    currentDistrict: "",
    currentSubDistrict: "",
    currentVillage: "",
    currentStreet: "",
    currentPincode: "",

    // Permanent address
    permanentState: "",
    permanentDistrict: "",
    permanentSubDistrict: "",
    permanentVillage: "",
    permanentStreet: "",
    permanentPincode: "",

    // Social & files (we keep both local preview and server paths)
    githubProfile: "",
    linkedinProfile: "",
    adhaarFilePath: "", // server path or stored value
    resumeFilePath: "", // server path or stored value
    // NOTE: we won't send base64 previews to backend; uploads go through POST
  };

  const [formData, setFormData] = useState(initialForm);
  const [editingData, setEditingData] = useState(initialForm); // used while editing
  const [isEditing, setIsEditing] = useState(false);
  const [adhaarFileName, setAdhaarFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [originalData, setOriginalData] = useState(initialForm);

  // Fetch existing details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
         `http://localhost:8080/api/student-generic-details/${userId}`
        );
        if (resp.data) {
          // Map backend DTO fields to our form structure
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
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // When not editing, formData == editingData; when editing, user modifies editingData
  // keep completion updated when formData changes
  useEffect(() => {
    calculateCompletion(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateCompletion = (data = formData) => {
    const fields = Object.values(data);
    const filled = fields.filter((f) => f !== null && f !== undefined && String(f).trim() !== "").length;
    const pct = Math.round((filled / fields.length) * 100);
    onCompletionChange(pct);
  };

  // Generic change handler (for editingData)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // restrict pincode length
    if ((name === "currentPincode" || name === "permanentPincode") && value.length > 6) return;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  // Start editing
  const startEdit = () => {
    setIsEditing(true);
    setEditingData(formData);
    setAdhaarFileName("");
    setResumeFileName("");
  };

  // Cancel editing -> revert to original fetched data
  const handleCancel = () => {
    setIsEditing(false);
    setEditingData(formData);
  };

  // Save -> call PUT API with fields (map to backend expected names)
  const handleSave = async () => {
    try {
      // Map editingData to backend DTO names. If backend expects adhaarFilePath/resumeFilePath, keep names.
      const payload = {
        ...editingData,
        userId,
      };
const resp = await axios.put(
  "http://localhost:8080/api/student-generic-details/update",
  payload
);


      // backend returns updated DTO
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
        setIsEditing(false);
        alert("Saved successfully.");
      } else {
        alert("Saved (no response body).");
      }
    } catch (err) {
      console.error("Error saving details:", err);
      alert("Failed to save details.");
    }
  };

  // Upload file (Aadhaar or Resume) to server via POST endpoint
  // type: "adhaar" or "resume"
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // update local filename for UI
    if (type === "adhaar") setAdhaarFileName(file.name);
    else setResumeFileName(file.name);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const resp = await axios.post(
        `http://localhost:8080/api/student-generic-details/upload/${userId}/${type}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Backend should return updated StudentGenericDetailsDto
      if (resp.data) {
        const updated = {
          workExperience: resp.data.workExperience || editingData.workExperience || "",
          careerGap: resp.data.careerGap || editingData.careerGap || "",

          currentState: resp.data.currentState || editingData.currentState || "",
          currentDistrict: resp.data.currentDistrict || editingData.currentDistrict || "",
          currentSubDistrict: resp.data.currentSubDistrict || editingData.currentSubDistrict || "",
          currentVillage: resp.data.currentVillage || editingData.currentVillage || "",
          currentStreet: resp.data.currentStreet || editingData.currentStreet || "",
          currentPincode: resp.data.currentPincode || editingData.currentPincode || "",

          permanentState: resp.data.permanentState || editingData.permanentState || "",
          permanentDistrict: resp.data.permanentDistrict || editingData.permanentDistrict || "",
          permanentSubDistrict: resp.data.permanentSubDistrict || editingData.permanentSubDistrict || "",
          permanentVillage: resp.data.permanentVillage || editingData.permanentVillage || "",
          permanentStreet: resp.data.permanentStreet || editingData.permanentStreet || "",
          permanentPincode: resp.data.permanentPincode || editingData.permanentPincode || "",

          githubProfile: resp.data.githubProfile || editingData.githubProfile || "",
          linkedinProfile: resp.data.linkedinProfile || editingData.linkedinProfile || "",
          adhaarFilePath: resp.data.adhaarFilePath || (type === "adhaar" ? (resp.data.adhaarFilePath || "") : editingData.adhaarFilePath || ""),
          resumeFilePath: resp.data.resumeFilePath || (type === "resume" ? (resp.data.resumeFilePath || "") : editingData.resumeFilePath || ""),
        };

        // Update both editing and visible form data (the uploaded file path is now known)
        setEditingData(updated);
        setFormData(updated);
        setOriginalData(updated);
alert(`${type === "adhaar" ? "Aadhaar" : "Resume"} uploaded successfully.`);
      } else {
        alert("Upload succeeded but backend returned no data.");
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("File upload failed.");
    }
  };

  // View document: if backend provides an accessible URL use that; otherwise, open filePath as src
  const viewDocument = (type) => {
    const path = (type === "adhaar") ? formData.adhaarFilePath : formData.resumeFilePath;
    if (!path) {
alert(`${type === "adhaar" ? "Aadhaar" : "Resume"} not uploaded`);
      return;
    }
    // open in new tab; if backend returns raw file bytes via URL, this will work.
    const win = window.open();
    // If path is a direct URL, use it. Wrap in iframe for inline view.
    win.document.write(
      <div style="height:100vh;margin:0;padding:0"><iframe src="${path}" style="width:100%;height:100%;border:none"></iframe></div>
    );
  };

  // Helper to render input with label and props
  const renderInput = (label, name, placeholder = "", props = {}) => (
    <div className="col-md-4 mb-2">
      <label className="form-label fw-semibold">{label}</label>
      <input
        className="form-control"
        name={name}
        value={editingData[name] ?? ""}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">Generic Details</h5>
        {!isEditing ? (
          <div>
            <button className="btn btn-outline-primary btn-sm me-2" onClick={startEdit}>
              Edit
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn btn-secondary btn-sm me-2"
              onClick={() => {
                handleCancel();
              }}
            >
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
          {/* Work Experience & Career Gap */}
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

          {/* Current Address header */}
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
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {renderInput("District *", "currentDistrict", "Enter district")}
          {renderInput("Sub District", "currentSubDistrict", "Enter sub district")}
          {renderInput("Village/Town *", "currentVillage", "Enter village/town")}
          {renderInput("Street/Building No/Floor", "currentStreet", "Enter street/building no/floor")}
          <div className="col-md-4 mb-2">
            <label className="form-label fw-semibold">Pincode *</label>
            <input
              type="text"
              name="currentPincode"
              className="form-control"
              value={editingData.currentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </div>

          {/* Permanent Address header */}
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
<option key={`perm-${s}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {renderInput("District *", "permanentDistrict", "Enter district")}
          {renderInput("Sub District", "permanentSubDistrict", "Enter sub district")}
          {renderInput("Village/Town *", "permanentVillage", "Enter village/town")}
          {renderInput("Street/Building No/Floor", "permanentStreet", "Enter street/building no/floor")}
          <div className="col-md-4 mb-2">
            <label className="form-label fw-semibold">Pincode *</label>
            <input
              type="text"
              name="permanentPincode"
              className="form-control"
              value={editingData.permanentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </div>

          {/* Social Links */}
          <div className="col-md-6">
            <label className="form-label">GitHub Profile</label>
            <input
              type="url"
              name="githubProfile"
              className="form-control"
              value={editingData.githubProfile}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedinProfile"
              className="form-control"
              value={editingData.linkedinProfile}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Aadhaar */}
          <div className="col-md-6">
            <label className="form-label">Aadhaar Card *</label>
            {!isEditing ? (
              formData.adhaarFilePath ? (
                <div className="d-flex align-items-center">
                  <button className="btn btn-info btn-sm me-2" onClick={() => viewDocument("adhaar")}>
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
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, "adhaar")}
                />
                {adhaarFileName && (
                  <div className="mt-1">
                    <span className="text-success small">{adhaarFileName}</span>
                    {formData.adhaarFilePath && (
                      <button
                        className="btn btn-outline-info btn-sm ms-2"
                        onClick={() => viewDocument("adhaar")}
                        type="button"
                      >
                        View
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resume */}
          <div className="col-md-6">
            <label className="form-label">Resume *</label>
            {!isEditing ? (
              formData.resumeFilePath ? (
                <div className="d-flex align-items-center">
                  <button className="btn btn-info btn-sm me-2" onClick={() => viewDocument("resume")}>
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
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
                {resumeFileName && (
                  <div className="mt-1">
                    <span className="text-success small">{resumeFileName}</span>
                    {formData.resumeFilePath && (
                      <button
                        className="btn btn-outline-info btn-sm ms-2"
                        onClick={() => viewDocument("resume")}
                        type="button"
                      >
                        View
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericDetails;