// QuizPreview.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { QUESTION_TYPES } from "./Utils/QuestionTypes";

export default function QuizPreview({ form, onClose }) {
  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{form.title || "Preview: Untitled"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {form.description && (
          <p className="text-muted mb-2">{form.description}</p>
        )}

        <h5>Question</h5>
        <p>{form.question}</p>

        {(form.type === QUESTION_TYPES.SINGLE ||
          form.type === QUESTION_TYPES.MULTIPLE) && (
          <div>
            {(form.options || []).map((o) => (
              <label
                key={o.id}
                className="d-flex align-items-center mb-1"
              >
                <input
                  type={
                    form.type === QUESTION_TYPES.SINGLE ? "radio" : "checkbox"
                  }
                  name="previewOption"
                  disabled
                  className="me-2"
                />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        )}

        {form.type === QUESTION_TYPES.MANUAL && (
          <input
            className="form-control"
            placeholder="Type your answer here (preview only)"
            disabled
          />
        )}

        {form.type === QUESTION_TYPES.CODING && (
          <div className="mt-2">
            <h6>Problem</h6>
            <pre
              className="bg-light p-2 rounded"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {(form.coding && form.coding.description) || form.question}
            </pre>

            <div className="row mt-2">
              <div className="col-md-6">
                <strong>Sample Input</strong>
                <div className="border rounded p-2">
                  {(form.coding && form.coding.sampleInput) || "—"}
                </div>
              </div>
              <div className="col-md-6">
                <strong>Sample Output</strong>
                <div className="border rounded p-2">
                  {(form.coding && form.coding.sampleOutput) || "—"}
                </div>
              </div>
            </div>

            <div className="mt-2 small text-muted">
              Hidden test cases:{" "}
              {(form.coding &&
                form.coding.testCases &&
                form.coding.testCases.length) ||
                0}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="me-auto">
          <strong>Marks:</strong> +{form.positiveMarks} / -{form.negativeMarks}{" "}
          {form.mandatory ? "(mandatory)" : ""}
        </div>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
