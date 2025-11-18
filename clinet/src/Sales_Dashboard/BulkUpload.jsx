import React, { useState } from "react";
import axios from "axios";

function BulkUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = ["xlsx", "xls"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        setError("Please select a valid Excel file (.xlsx or .xls)");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/saleCourse/student/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(
        `Upload completed! Success: ${res.data.successCount}, Failed: ${res.data.failedCount}`
      );
      if (res.data.failedRows.length > 0) {
        console.table(res.data.failedRows);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed!");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4">
            {/* Header */}
            <div className="card-header bg-primary text-white border-0 py-3">
              <div className="text-center">
                <h4 className="fw-bold mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="me-2" style={{ verticalAlign: "middle" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Bulk Upload Students
                </h4>
                <p className="mb-0 small opacity-75">Upload multiple student records via Excel file</p>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Alert Messages */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-3" role="alert">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-danger rounded-circle p-1 me-2">
                      !
                    </span>
                    <strong className="small">{error}</strong>
                  </div>
                  <button type="button" className="btn-close btn-sm" onClick={() => setError("")}></button>
                </div>
              )}

              {message && (
                <div className="alert alert-success alert-dismissible fade show shadow-sm mb-3" role="alert">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success rounded-circle p-1 me-2">
                      ✓
                    </span>
                    <strong className="small">{message}</strong>
                  </div>
                  <button type="button" className="btn-close btn-sm" onClick={() => setMessage("")}></button>
                </div>
              )}

              {/* Upload Instructions */}
              <div className="alert alert-info border-0 shadow-sm mb-4">
                <div className="d-flex align-items-start">
                  <span className="badge bg-info rounded-circle p-2 me-3">
                    ℹ️
                  </span>
                  <div>
                    <strong className="d-block mb-1">Upload Instructions</strong>
                    <ul className="mb-0 ps-3 small">
                      <li>Only Excel files (.xlsx, .xls) are accepted</li>
                      <li>Ensure your file has the correct column headers</li>
                      <li>Maximum file size: 300MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2" style={{ verticalAlign: "middle" }}>
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="form-control border-2"
                  disabled={uploading}
                />
                {file && (
                  <div className="mt-2">
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1" style={{ verticalAlign: "middle" }}>
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {file.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="d-grid">
                <button
                  className="btn btn-primary fw-bold py-2 shadow-sm"
                  onClick={handleUpload}
                  disabled={uploading || !file}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2" style={{ verticalAlign: "middle" }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload File
                    </>
                  )}
                </button>
              </div>

              {/* Download Template Section */}
              <div className="mt-4 pt-3 border-top">
                <div className="text-center">
                  <p className="text-muted small mb-2">Need a template?</p>
                  <button className="btn btn-outline-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1" style={{ verticalAlign: "middle" }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download Sample Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUpload;