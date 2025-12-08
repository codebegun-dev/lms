// QuizPreview.jsx - Fixed version (students view)
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { QUESTION_TYPES } from "./Utils/QuestionTypes";

export default function QuizPreview({ form, onClose }) {
  if (!form) return null;

  return (
    <Modal show={!!form} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Student's View Preview</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="preview-content">
          <h4 className="mb-3">{form.question}</h4>
          
          {(form.type === QUESTION_TYPES.SINGLE ||
            form.type === QUESTION_TYPES.MULTIPLE) && (
            <div className="options-container">
              <p className="text-muted mb-2">
                {form.type === QUESTION_TYPES.SINGLE 
                  ? "Select the correct answer:" 
                  : "Select all correct answers:"}
              </p>
              
              {(form.options || []).map((option, index) => (
                <div key={option.id} className="form-check mb-2">
                  <input
                    type={form.type === QUESTION_TYPES.SINGLE ? "radio" : "checkbox"}
                    className="form-check-input"
                    name="studentAnswer"
                    id={`preview-option-${index}`}
                    disabled
                  />
                  <label 
                    className="form-check-label" 
                    htmlFor={`preview-option-${index}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {option.text || `Option ${index + 1}`}
                  </label>
                </div>
              ))}
            </div>
          )}

          {form.type === QUESTION_TYPES.MANUAL && (
            <div className="manual-answer-container">
              <p className="text-muted mb-2">Type your answer:</p>
              <textarea 
                className="form-control" 
                rows={4}
                placeholder="Enter your answer here..."
                disabled
              />
            </div>
          )}

          {form.type === QUESTION_TYPES.CODING && (
            <div className="coding-container">
              <p className="text-muted mb-2">Coding Problem:</p>
              <div className="bg-light p-3 rounded mb-3">
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {form.coding?.description || form.question}
                </pre>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Sample Input:</strong></p>
                  <div className="bg-dark text-white p-2 rounded">
                    <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                      {form.coding?.sampleInput || "No sample input provided"}
                    </pre>
                  </div>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Sample Output:</strong></p>
                  <div className="bg-dark text-white p-2 rounded">
                    <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                      {form.coding?.sampleOutput || "No sample output provided"}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="mb-1"><strong>Write your code:</strong></p>
                <textarea 
                  className="form-control font-monospace" 
                  rows={8}
                  placeholder={`// Write your ${form.coding?.language || 'JavaScript'} code here...`}
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div className="marks-info">
          <span className="badge bg-success me-2">
            +{form.positiveMarks || 1} marks
          </span>
          <span className="badge bg-danger me-2">
            -{form.negativeMarks || 0} marks
          </span>
          {form.mandatory && (
            <span className="badge bg-warning text-dark">
              Mandatory
            </span>
          )}
        </div>
        <Button variant="secondary" onClick={onClose}>
          Close Preview
        </Button>
      </Modal.Footer>
    </Modal>
  );
}