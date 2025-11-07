import React, { useState, useEffect } from "react";
import axios from "axios";

const Projects = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const roles = [
    "Team Lead",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Database Administrator",
    "DevOps Engineer",
    "Quality Assurance",
    "Business Analyst",
    "Other"
  ];

  // ✅ Fetch projects
  useEffect(() => {
    if (!userId) return;
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/student/projects/${userId}`);
      setProjects(res.data.length ? res.data : [
        { id: 0, projectTitle: "", usedTechnologies: "", role: "", description: "", userId }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle field change
  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  // ✅ Add project UI
  const addProject = () => {
    setProjects([
      ...projects,
      { id: 0, projectTitle: "", usedTechnologies: "", role: "", description: "", userId }
    ]);
  };

  // ✅ Save/Update project list
  const handleSave = async () => {
    try {
      for (const project of projects) {
        await axios.post(`http://localhost:8080/api/student/projects`, {
          ...project,
          userId
        });
      }
      setIsEditing(false);
      fetchProjects();
      alert("Projects saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save projects ❌");
    }
  };

  // ✅ Remove project
  const removeProject = async (index, projectId) => {
    if (projectId > 0) {
      await axios.delete(`http://localhost:8080/api/student/projects/${projectId}`);
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  // ✅ Calculate section completion
  useEffect(() => {
    let total = 0, filled = 0;
    projects.forEach(p => {
      const fields = [p.projectTitle, p.usedTechnologies, p.role, p.description];
      total += fields.length;
      filled += fields.filter(f => f && f.trim() !== "").length;
    });
    const percent = total ? Math.round((filled / total) * 100) : 0;
    onCompletionChange && onCompletionChange(percent);
  }, [projects]);

  const countWords = (text = "") => text.trim().split(/\s+/).filter(w => w).length;

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between">
        <h5>Projects</h5>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div>
            <button className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        {projects.map((project, index) => (
          <div key={index} className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h6>Project {index + 1}</h6>
                {isEditing && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeProject(index, project.id)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={project.projectTitle}
                    onChange={(e) => handleChange(index, "projectTitle", e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Used Technologies *</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={project.usedTechnologies}
                    onChange={(e) =>
                      handleChange(index, "usedTechnologies", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Role *</label>
                  <select
                    className="form-select"
                    disabled={!isEditing}
                    value={project.role}
                    onChange={(e) => handleChange(index, "role", e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Description * <small>(max 300 words)</small>
                  </label>
                  <textarea
                    className="form-control"
                    disabled={!isEditing}
                    rows={4}
                    value={project.description}
                    onChange={(e) => {
                      const words = countWords(e.target.value);
                      if (words <= 300) handleChange(index, "description", e.target.value);
                    }}
                  />
                  <small>{countWords(project.description)} / 300 words</small>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <button className="btn btn-primary w-100" onClick={addProject}>
            + Add Another Project
          </button>
        )}
      </div>
    </div>
  );
};

export default Projects;

