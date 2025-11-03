import React, { useState, useEffect } from "react";

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
    adhaarCard: null,
    resume: null,
  });

  const [adhaarFileName, setAdhaarFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  useEffect(() => {
    calculateCompletion();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "currentPincode" || name === "permanentPincode") && value.length > 6) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "adhaar") {
          setFormData((prev) => ({ ...prev, adhaarCard: reader.result }));
          setAdhaarFileName(file.name);
        } else if (type === "resume") {
          setFormData((prev) => ({ ...prev, resume: reader.result }));
          setResumeFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((f) => f !== "" && f !== null).length;
    const percentage = Math.round((filled / fields.length) * 100);
    onCompletionChange(percentage);
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const viewDocument = (type) => {
    const doc = type === "adhaar" ? formData.adhaarCard : formData.resume;
    if (doc) {
      const win = window.open();
      win.document.write(
        `<iframe src="${doc}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    } else {
      alert(`No ${type} uploaded`);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="mb-0">Generic Details</h5>
        {!isEditing ? (
          <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
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
          <div className="col-md-6">
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

          {/* Current Address */}
          <div className="col-12 mt-3 border-bottom pb-2 fw-bold">Current Address</div>

          <div className="col-md-4">
            <label className="form-label">State *</label>
            <select
              className="form-select"
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">District *</label>
            <input
              type="text"
              className="form-control"
              name="currentDistrict"
              value={formData.currentDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter district"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub District</label>
            <input
              type="text"
              className="form-control"
              name="currentSubDistrict"
              value={formData.currentSubDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter sub district"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Village/Town *</label>
            <input
              type="text"
              className="form-control"
              name="currentVillage"
              value={formData.currentVillage}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter village/town"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Street/Building No/Floor</label>
            <input
              type="text"
              className="form-control"
              name="currentStreet"
              value={formData.currentStreet}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter street/building no/floor"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              className="form-control"
              name="currentPincode"
              value={formData.currentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
            />
          </div>

          {/* Permanent Address */}
          <div className="col-12 mt-3 border-bottom pb-2 fw-bold">Permanent Address</div>

          <div className="col-md-4">
            <label className="form-label">State *</label>
            <select
              className="form-select"
              name="permanentState"
              value={formData.permanentState}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4
          ">
            <label className="form-label">District *</label>
            <input
              type="text"
              className="form-control"
              name="permanentDistrict"
              value={formData.permanentDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter district"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub District</label>
            <input
              type="text"
              className="form-control"
              name="permanentSubDistrict"
              value={formData.permanentSubDistrict}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter sub district"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Village/Town *</label>
            <input
              type="text"
              className="form-control"
              name="permanentVillage"
              value={formData.permanentVillage}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter village/town"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Street/Building No/Floor</label>
            <input
              type="text"
              className="form-control"
              name="permanentStreet"
              value={formData.permanentStreet}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter street/building no/floor"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              className="form-control"
              name="permanentPincode"
              value={formData.permanentPincode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
            />
          </div>

          {/* GitHub and LinkedIn */}
          <div className="col-md-4">
            <label className="form-label">GitHub Profile</label>
            <input
              type="url"
              className="form-control"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="url"
              className="form-control"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Adhaar & Resume */}
          <div className="col-md-4">
            <label className="form-label">Adhaar Card *</label>
            {!isEditing ? (
              formData.adhaarCard ? (
                <button className="btn btn-info btn-sm" onClick={() => viewDocument("adhaar")}>
                  View Adhaar
                </button>
              ) : (
                <p className="text-muted fst-italic">No document uploaded</p>
              )
            ) : (
              <div>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "adhaar")}
                />
                {adhaarFileName && (
                  <div className="mt-1">
                    <span className="text-success small">{adhaarFileName}</span>
                    <button
                      className="btn btn-outline-info btn-sm ms-2"
                      onClick={() => viewDocument("adhaar")}
                      type="button"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Resume *</label>
            {!isEditing ? (
              formData.resume ? (
                <button className="btn btn-info btn-sm" onClick={() => viewDocument("resume")}>
                  View Resume
                </button>
              ) : (
                <p className="text-muted fst-italic">No document uploaded</p>
              )
            ) : (
              <div>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                />
                {resumeFileName && (
                  <div className="mt-1">
                    <span className="text-success small">{resumeFileName}</span>
                    <button
                      className="btn btn-outline-info btn-sm ms-2"
                      onClick={() => viewDocument("resume")}
                      type="button"
                    >
                      View
                    </button>
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
