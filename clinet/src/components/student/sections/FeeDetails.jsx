import React from 'react';
import './FeeDetails.css';

const FeeDetails = () => {
  // This data would typically come from backend/admin
  const feeData = {
    totalFee: 50000,
    paidFee: 25000,
    balanceFee: 25000
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>Fee Details</h3>
      </div>

      <div className="section-body">
        <div className="fee-details-grid">
          <div className="fee-item">
            <label className="fee-label">Total Fee</label>
            <div className="fee-value total-fee">₹ {feeData.totalFee.toLocaleString('en-IN')}</div>
          </div>

          <div className="fee-item">
            <label className="fee-label">Paid Fee</label>
            <div className="fee-value paid-fee">₹ {feeData.paidFee.toLocaleString('en-IN')}</div>
          </div>

          <div className="fee-item">
            <label className="fee-label">Balance Fee</label>
            <div className="fee-value balance-fee">₹ {feeData.balanceFee.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="fee-progress">
          <div className="progress-label">
            <span>Payment Progress</span>
            <span>{((feeData.paidFee / feeData.totalFee) * 100).toFixed(0)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(feeData.paidFee / feeData.totalFee) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="fee-note">
          <strong>Note:</strong> Fee details are managed by the administration. 
          For any queries, please contact the accounts department.
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;