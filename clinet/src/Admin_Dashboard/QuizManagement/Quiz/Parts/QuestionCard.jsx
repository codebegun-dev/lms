 import React from "react";
import { Card } from "react-bootstrap";

export default function QuestionCard({ data, index }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="p-3">
        {/* Question header with marks on right */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                 style={{ width: '36px', height: '36px' }}>
              <span className="text-dark fw-bold">{index + 1}</span>
            </div>
            <h6 className="mb-0">{data.question || "No question text"}</h6>
          </div>
          
          {/* Marks displayed on the right side */}
          <div className="ms-3 text-nowrap">
            <span className="badge bg-success me-1">+{data.positiveMarks || 0}</span>
            {data.negativeMarks > 0 && (
              <span className="badge bg-danger">-{data.negativeMarks}</span>
            )}
          </div>
        </div>
        
        
        
        {/* Show options for multiple choice questions */}
        {data.type === "single" && data.options && data.options.length > 0 ? (
          <div className="mb-3">
             {data.options.slice(0, 3).map((option, idx) => (
              <div key={option.id || idx} className="form-check mb-2">
                <input
                  type="radio"
className="form-check-input border-black ms-3 me-1"
                  name={`preview-${index}`}
                  id={`preview-${index}-radio-${idx}`}
                  disabled
                  style={{ cursor: 'default' }}
                />
                <label 
                  className="form-check-label small" 
                  htmlFor={`preview-${index}-radio-${idx}`}
                  style={{ cursor: 'default' }}
                >
                  {option.text || `Option ${idx + 1}`}
                </label>
              </div>
            ))}
            {data.options.length > 3 && (
              <div className="form-check mb-2">
                <input
                  type="radio"
className="form-check-input border-black"

                  name={`preview-${index}`}
                  disabled
                  style={{ cursor: 'default' }}
                />
                <label className="form-check-label small text-muted">
                  ... and {data.options.length - 3} more
                </label>
              </div>
            )}
          </div>
        ) : data.type === "multiple" && data.options && data.options.length > 0 ? (
          <div className="mb-3">
             {data.options.slice(0, 3).map((option, idx) => (
              <div key={option.id || idx} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input border-black ms-3 me-1"
                  name={`preview-${index}`}
                  id={`preview-${index}-checkbox-${idx}`}
                  disabled
                  style={{ cursor: 'default' }}
                />
                <label 
                  className="form-check-label small" 
                  htmlFor={`preview-${index}-checkbox-${idx}`}
                  style={{ cursor: 'default' }}
                >
                  {option.text || `Option ${idx + 1}`}
                </label>
              </div>
            ))}
            {data.options.length > 3 && (
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input border-black"
                  name={`preview-${index}`}
                  disabled
                  style={{ cursor: 'default' }}
                />
                <label className="form-check-label small text-muted">
                  ... and {data.options.length - 3} more
                </label>
              </div>
            )}
          </div>
        ) : (data.type === "single" || data.type === "multiple") && (!data.options || data.options.length === 0) ? (
          <div className="mb-3">
            <small className="text-muted d-block">No options defined</small>
          </div>
        ) : null}
        
        {/* Manual answer question */}
        {data.type === "manual" && (
          <div className="mb-3">
             <div className="border rounded p-2 bg-light">
              <div className="small text-muted">Answer field will appear here</div>
            </div>
            {/* {data.manualAnswer && (
              <div className="mt-2 small">
                <span className="text-muted">Expected: </span>
                <span className="fst-italic">{data.manualAnswer}</span>
              </div>
            )} */}
          </div>
        )}
        
        {/* Coding question */}
        {data.type === "coding" && (
          <div className="mb-3">
             <div className="border rounded p-2 bg-light">
              <div className="small text-muted">Code editor will appear here</div>
            </div>
            {data.coding?.language && (
              <div className="mt-2">
                <span className="badge bg-info">{data.coding.language}</span>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}