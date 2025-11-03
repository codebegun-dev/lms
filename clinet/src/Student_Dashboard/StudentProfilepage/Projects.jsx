import React, { useState, useEffect } from 'react';
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setProjects(prev => [...prev, newProject]);
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
    if (typeof onCompletionChange === 'function') onCompletionChange(percentage);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally: revert to previous saved state — current implementation keeps edits.
  };

  const countWords = (text = '') =>
    text.split(/\s+/).filter(w => w !== '').length;

  return (
      
     

    <div className="card mb-4">
      
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <h5 className="mb-2 mb-md-0">Projects</h5>

        {!isEditing ? (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Edit
          </button>
        ) : (
          <div className="d-flex gap-2 w-100 justify-content-between justify-content-md-end">
            <div className="d-flex gap-2">
              <button className="btn btn-secondary" onClick={handleCancel} type="button">
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave} type="button">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        {projects.map((project, index) => (
          <div key={project.id} className="card mb-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <h6 className="mb-2 mb-md-0">Project {index + 1}</h6>
                {isEditing && projects.length > 1 && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeProject(index)}
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.projectTitle}
                    onChange={(e) => handleChange(index, 'projectTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter project title"
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Used Technologies *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.usedTechnologies}
                    onChange={(e) => handleChange(index, 'usedTechnologies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Role *</label>
                  <select
                    className="form-select"
                    value={project.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Description * <small className="text-muted">(max 300 words)</small></label>
                  <textarea
                    className="form-control"
                    value={project.description}
                    onChange={(e) => {
                      const words = e.target.value.split(/\s+/).filter(w => w !== '');
                      if (words.length <= 300) {
                        handleChange(index, 'description', e.target.value);
                      } else {
                        // optional: prevent entering more words (keeps last valid state)
                        const truncated = e.target.value.split(/\s+/).slice(0, 300).join(' ');
                        handleChange(index, 'description', truncated);
                      }
                    }}
                    disabled={!isEditing}
                    placeholder="Describe the project, your responsibilities, and achievements"
                    rows={4}
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">{countWords(project.description)} / 300 words</small>
                    {/* You can show hints or validation states here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="mt-2">
            <button className="btn btn-primary w-100" onClick={addProject} type="button">
              + Add Another Project
            </button>
          </div>
        )}
      </div>
    </div>
     
  );
};

export default Projects;
