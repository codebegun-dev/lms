import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/campaigns';

const CreateCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ campaignId: null, campaignName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setCampaigns(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // CREATE Campaign
  const createCampaign = async (e) => {
    e.preventDefault();

    if (!formData.campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, { 
        campaignName: formData.campaignName 
      });
      setCampaigns([...campaigns, response.data]);
      setFormData({ campaignId: null, campaignName: '' });
      setShowForm(false);
      setError('');
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE Campaign
  const updateCampaign = async (e) => {
    e.preventDefault();

    if (!formData.campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/${formData.campaignId}`, { 
        campaignName: formData.campaignName 
      });
      setCampaigns(campaigns.map(c => c.campaignId === formData.campaignId ? response.data : c));
      setFormData({ campaignId: null, campaignName: '' });
      setIsEditing(false);
      setShowForm(false);
      setError('');
      alert('Campaign updated successfully!');
    } catch (error) {
      console.error('Error updating campaign:', error);
      setError('Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  // DELETE Campaign
  const deleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${campaignId}`);
      setCampaigns(campaigns.filter(c => c.campaignId !== campaignId));
      setError('');
      alert('Campaign deleted successfully!');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (campaign) => {
    setFormData({ 
      campaignId: campaign.campaignId, 
      campaignName: campaign.campaignName 
    });
    setIsEditing(true);
    setShowForm(true);
    setError('');
  };

  // Handle Cancel
  const handleCancel = () => {
    setFormData({ campaignId: null, campaignName: '' });
    setIsEditing(false);
    setShowForm(false);
    setError('');
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    if (isEditing) {
      updateCampaign(e);
    } else {
      createCampaign(e);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">Campaign Management</h2>
            {!showForm && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowForm(true)}
              >
                Create Campaign
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
                <h5 className="mb-0">{isEditing ? 'Edit Campaign' : 'Create New Campaign'}</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="campaignName" className="form-label fw-semibold">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="campaignName"
                    value={formData.campaignName}
                    onChange={(e) => {
                      setFormData({ ...formData, campaignName: e.target.value });
                      setError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Enter campaign name"
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
                      <>{isEditing ? 'Update Campaign' : 'Create Campaign'}</>
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

          {/* Campaigns List */}
          <div className="card shadow">
            <div className="card-header bg-light">
              <h5 className="mb-0">All Campaigns</h5>
            </div>
            <div className="card-body">
              {loading && campaigns.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mt-3 text-muted">No campaigns found. Create your first campaign!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Campaign ID</th>
                        <th scope="col">Campaign Name</th>
                        <th scope="col" className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign, index) => (
                        <tr key={campaign.campaignId}>
                          <th scope="row">{index + 1}</th>
                          <td>{campaign.campaignId}</td>
                          <td className="fw-semibold">{campaign.campaignName}</td>
                          <td className="text-end">
                            <div className="btn-group" role="group">
                              <button
                                onClick={() => handleEdit(campaign)}
                                className="btn btn-sm btn-outline-primary"
                                disabled={loading}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCampaign(campaign.campaignId)}
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

export default CreateCampaign;