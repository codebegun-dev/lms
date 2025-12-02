import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/sources';

const CreateSource = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ sourceId: null, sourceName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch all sources
  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setSources(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sources:', error);
      setError('Failed to fetch sources');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSources();
  }, []);

  // CREATE Source
  const createSource = async (e) => {
    e.preventDefault();

    if (!formData.sourceName.trim()) {
      setError('Please enter a source name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, { 
        sourceName: formData.sourceName 
      });
      setSources([...sources, response.data]);
      setFormData({ sourceId: null, sourceName: '' });
      setShowForm(false);
      setError('');
      alert('Source created successfully!');
    } catch (error) {
      console.error('Error creating source:', error);
      setError('Failed to create source');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Source
  const updateSource = async (e) => {
    e.preventDefault();

    if (!formData.sourceName.trim()) {
      setError('Please enter a source name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/${formData.sourceId}`, { 
        sourceName: formData.sourceName 
      });
      setSources(sources.map(s => s.sourceId === formData.sourceId ? response.data : s));
      setFormData({ sourceId: null, sourceName: '' });
      setIsEditing(false);
      setShowForm(false);
      setError('');
      alert('Source updated successfully!');
    } catch (error) {
      console.error('Error updating source:', error);
      setError('Failed to update source');
    } finally {
      setLoading(false);
    }
  };

  // DELETE Source
  const deleteSource = async (sourceId) => {
    if (!window.confirm('Are you sure you want to delete this source?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${sourceId}`);
      setSources(sources.filter(s => s.sourceId !== sourceId));
      setError('');
      alert('Source deleted successfully!');
    } catch (error) {
      console.error('Error deleting source:', error);
      setError('Failed to delete source');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (source) => {
    setFormData({ 
      sourceId: source.sourceId, 
      sourceName: source.sourceName 
    });
    setIsEditing(true);
    setShowForm(true);
    setError('');
  };

  // Handle Cancel
  const handleCancel = () => {
    setFormData({ sourceId: null, sourceName: '' });
    setIsEditing(false);
    setShowForm(false);
    setError('');
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    if (isEditing) {
      updateSource(e);
    } else {
      createSource(e);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">Source Management</h2>
            {!showForm && (
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setShowForm(true)}
              >
                Create Source
              </button>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Create/Edit Form */}
          {showForm && (
            <div className="card shadow mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{isEditing ? 'Edit Source' : 'Create New Source'}</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="sourceName" className="form-label fw-semibold">
                    Source Name
                  </label>
                  <input
                    type="text"
                    id="sourceName"
                    value={formData.sourceName}
                    onChange={(e) => {
                      setFormData({ ...formData, sourceName: e.target.value });
                      setError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Enter source name"
                    className="form-control form-control-lg"
                    disabled={loading}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>{isEditing ? 'Update Source' : 'Create Source'}</>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline-secondary btn-lg"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sources List */}
          <div className="card shadow">
            <div className="card-header bg-light">
              <h5 className="mb-0">All Sources</h5>
            </div>
            <div className="card-body">
              {loading && sources.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading sources...</p>
                </div>
              ) : sources.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mt-3 text-muted">No sources found. Create your first source!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Source ID</th>
                        <th scope="col">Source Name</th>
                        <th scope="col" className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sources.map((source, index) => (
                        <tr key={source.sourceId}>
                          <th scope="row">{index + 1}</th>
                          <td>{source.sourceId}</td>
                          <td className="fw-semibold">{source.sourceName}</td>
                          <td className="text-end">
                            <div className="btn-group" role="group">
                              <button
                                onClick={() => handleEdit(source)}
                                className="btn btn-sm btn-outline-primary"
                                disabled={loading}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteSource(source.sourceId)}
                                className="btn btn-sm btn-outline-danger"
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSource;