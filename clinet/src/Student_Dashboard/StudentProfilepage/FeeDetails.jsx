import React from "react";

const FeeDetails = () => {
  const feeData = {
    totalFee: 50000,
    paidFee: 25000,
    balanceFee: 25000,
  };

  const progressPercentage = ((feeData.paidFee / feeData.totalFee) * 100).toFixed(0);

  return (
    <div className="card shadow-sm mb-4">
      {/* Header */}
      <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center">
        <h5 className="mb-0">Section 8: Fee Details</h5>
       </div>

      {/* Body */}
      <div className="card-body">
        {/* Fee Summary */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="border-start border-4 border-primary bg-light p-3 rounded">
              <label className="fw-semibold text-secondary small d-block mb-1">
                Total Fee
              </label>
              <div className="fs-4 fw-bold text-primary">
                ₹ {feeData.totalFee.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border-start border-4 border-success bg-light p-3 rounded">
              <label className="fw-semibold text-secondary small d-block mb-1">
                Paid Fee
              </label>
              <div className="fs-4 fw-bold text-success">
                ₹ {feeData.paidFee.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border-start border-4 border-danger bg-light p-3 rounded">
              <label className="fw-semibold text-secondary small d-block mb-1">
                Balance Fee
              </label>
              <div className="fs-4 fw-bold text-danger">
                ₹ {feeData.balanceFee.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2 fw-semibold text-secondary">
            <span>Payment Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="progress" style={{ height: "24px", borderRadius: "12px" }}>
            <div
              className="progress-bar progress-bar-striped bg-success"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Note Section */}
        <div className="alert alert-warning border-start border-4 border-warning rounded-3 mb-0">
          <strong>Note:</strong> Fee details are managed by the administration. For any queries,
          please contact the accounts department.
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
