import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = ({ onCompletionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectTitle: '',
      usedTechnologies: '',
      role: '',
      description: ''
    }
  ]);

  const roles = [
    'Team Lead',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Database Administrator',
    'DevOps Engineer',
    'Quality Assurance',
    'Business Analyst',
    'Other'
  ];

  useEffect(() => {
    calculateCompletion();
  }, [projects]);

  const handleChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const addProject = () => {
    const newProject = {
      id: projects.length + 1,
      projectTitle: '',
      usedTechnologies: '',
      role: '',
      description: ''
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    }
  };

  const calculateCompletion = () => {
    let totalFields = 0;
    let filledFields = 0;

    projects.forEach(project => {
      const fields = Object.values(project).filter((_, i) => i !== 0); // Exclude id
      totalFields += fields.length;
      filledFields += fields.filter(f => f !== '').length;
    });

    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    onCompletionChange(percentage);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>Projects</h3>
        {!isEditing ? (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="header-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="section-body">
        {projects.map((project, index) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <h4>Project {index + 1}</h4>
              {isEditing && projects.length > 1 && (
                <button 
                  className="btn-remove" 
                  onClick={() => removeProject(index)}
                  type="button"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  value={project.projectTitle}
                  onChange={(e) => handleChange(index, 'projectTitle', e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Used Technologies *</label>
                <input
                  type="text"
                  value={project.usedTechnologies}
                  onChange={(e) => handleChange(index, 'usedTechnologies', e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Role *</label>
                <select
                  value={project.role}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="form-field full-width">
                <label className="form-label">Description * (max 300 words)</label>
                <textarea
                  value={project.description}
                  onChange={(e) => {
                    const words = e.target.value.split(/\s+/).filter(w => w !== '');
                    if (words.length <= 300) {
                      handleChange(index, 'description', e.target.value);
                    }
                  }}
                  disabled={!isEditing}
                  className="form-input form-textarea"
                  placeholder="Describe the project, your responsibilities, and achievements"
                  rows="4"
                />
                <small className="word-count">
                  {project.description.split(/\s+/).filter(w => w !== '').length} / 300 words
                </small>
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <button className="btn-add-project" onClick={addProject}>
            + Add Another Project
          </button>
        )}
      </div>
    </div>
  );
};

export default Projects;
