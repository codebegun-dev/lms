import React, { useState, useEffect, useRef } from "react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const GenericDetails = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    workExperience: "",
    careerGap: "",
    currentState: "",
    permanentState: "",
    permanentDistrict: "",
    permanentSubDistrict: "",
    permanentVillage: "",
    pincode: "",
    preferredLocations: [],
    githubProfile: "",
    linkedinProfile: "",
    adhaarCard: null,
    resume: null,
  });

  const [adhaarFileName, setAdhaarFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode" && value.length > 6) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => {
      const currentLocations = prev.preferredLocations || [];
      const updated = currentLocations.includes(location)
        ? currentLocations.filter((loc) => loc !== location)
        : [...currentLocations, location];
      return { ...prev, preferredLocations: updated };
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "adhaar") {
        setFormData((prev) => ({ ...prev, adhaarCard: file }));
        setAdhaarFileName(file.name);
      } else if (type === "resume") {
        setFormData((prev) => ({ ...prev, resume: file }));
        setResumeFileName(file.name);
      }
    }
  };

  const calculateCompletion = () => {
    const fields = Object.entries(formData);
    const filled = fields.filter(([key, value]) => {
      if (key === "preferredLocations") return value.length > 0;
      return value !== "" && value !== null;
    }).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const getSelectedLocationsText = () => {
    const loc = formData.preferredLocations;
    if (loc.length === 0) return "Select Preferred Locations";
    if (loc.length <= 2) return loc.join(", ");
    return `${loc.slice(0, 2).join(", ")} +${loc.length - 2} more`;
  };

  const viewDocument = (type) => {
    if (type === "adhaar" && formData.adhaarCard) alert("Opening Adhaar...");
    else if (type === "resume" && formData.resume) alert("Opening Resume...");
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h5 className="fw-bold text-primary">Section 2: Generic Details</h5>
        {!isEditing ? (
          <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={() => setIsEditing(false)}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="row g-3">
        {/* Work Experience */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Work Experience *</label>
          <select
            className="form-select"
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select Experience</option>
            <option>Fresher</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
            <option>4 Years</option>
            <option>5+ Years</option>
          </select>
        </div>

        {/* Career Gap */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Career Gap</label>
          <select
            className="form-select"
            name="careerGap"
            value={formData.careerGap}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select Career Gap</option>
            <option>No Gap</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
            <option>3+ Years</option>
          </select>
        </div>

        {/* Current State */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Current State *</label>
          <select
            className="form-select"
            name="currentState"
            value={formData.currentState}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select State</option>
            {indianStates.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Permanent State */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Permanent State *</label>
          <select
            className="form-select"
            name="permanentState"
            value={formData.permanentState}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select State</option>
            {indianStates.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">District *</label>
          <input
            type="text"
            className="form-control"
            name="permanentDistrict"
            placeholder="Enter district"
            value={formData.permanentDistrict}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Sub District */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Sub District</label>
          <input
            type="text"
            className="form-control"
            name="permanentSubDistrict"
            placeholder="Enter sub-district"
            value={formData.permanentSubDistrict}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Village */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Village/Town *</label>
          <input
            type="text"
            className="form-control"
            name="permanentVillage"
            placeholder="Enter village/town"
            value={formData.permanentVillage}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Pincode */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Pincode *</label>
          <input
            type="text"
            className="form-control"
            name="pincode"
            placeholder="Enter 6-digit pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength="6"
            disabled={!isEditing}
          />
        </div>

        {/* Preferred Locations */}
        <div className="col-md-4" ref={dropdownRef}>
          <label className="form-label fw-semibold">Preferred Locations *</label>
          <div
            className={`form-control d-flex justify-content-between align-items-center ${!isEditing ? "bg-light" : "cursor-pointer"}`}
            onClick={() => isEditing && setShowLocationDropdown(!showLocationDropdown)}
          >
            <span className={formData.preferredLocations.length ? "" : "text-muted"}>
              {getSelectedLocationsText()}
            </span>
            <i className="bi bi-chevron-down small text-secondary"></i>
          </div>

          {showLocationDropdown && isEditing && (
            <div className="border rounded p-2 mt-1 bg-white position-absolute w-100 shadow-sm" style={{ maxHeight: "200px", overflowY: "auto", zIndex: "1000" }}>
              {indianStates.map((state) => (
                <div key={state} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.preferredLocations.includes(state)}
                    onChange={() => handleLocationChange(state)}
                  />
                  <label className="form-check-label">{state}</label>
                </div>
              ))}
              {formData.preferredLocations.length > 0 && (
                <button
                  className="btn btn-sm btn-link text-danger mt-2"
                  onClick={() => setFormData((prev) => ({ ...prev, preferredLocations: [] }))}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* GitHub */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">GitHub Profile</label>
          <input
            type="url"
            className="form-control"
            name="githubProfile"
            placeholder="https://github.com/username"
            value={formData.githubProfile}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* LinkedIn */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">LinkedIn Profile</label>
          <input
            type="url"
            className="form-control"
            name="linkedinProfile"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedinProfile}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Aadhaar */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Adhaar Card *</label>
          {!isEditing ? (
            formData.adhaarCard ? (
              <button className="btn btn-info btn-sm" onClick={() => viewDocument("adhaar")}>
                View Adhaar
              </button>
            ) : (
              <p className="text-muted fst-italic small">No document uploaded</p>
            )
          ) : (
            <>
              <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, "adhaar")} />
              {adhaarFileName && <div className="text-success small mt-1">{adhaarFileName}</div>}
            </>
          )}
        </div>

        {/* Resume */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Resume *</label>
          {!isEditing ? (
            formData.resume ? (
              <button className="btn btn-info btn-sm" onClick={() => viewDocument("resume")}>
                View Resume
              </button>
            ) : (
              <p className="text-muted fst-italic small">No document uploaded</p>
            )
          ) : (
            <>
              <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, "resume")} />
              {resumeFileName && <div className="text-success small mt-1">{resumeFileName}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericDetails;
