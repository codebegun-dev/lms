// QuestionCard.jsx - Cleaner version
import React from "react";
import { Card } from "react-bootstrap";

export default function QuestionCard({ data, index }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-start">
          <div className="me-3">
            <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '36px', height: '36px' }}>
              <strong className="text-dark">{index + 1}</strong>
            </div>
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-2">{data.question || "No question text"}</h6>
            
            {/* Show options for multiple choice questions */}
            {data.type === "single" || data.type === "multiple" ? (
              <div className="mb-2">
                <small className="text-muted d-block mb-1">Options:</small>
                <ul className="list-unstyled mb-0">
                  {data.options?.slice(0, 3).map((opt, idx) => (
                    <li key={opt.id || idx} className="small mb-1">
                      • {opt.text || `Option ${idx + 1}`}
                    </li>
                  ))}
                  {data.options && data.options.length > 3 && (
                    <li className="small text-muted">... and {data.options.length - 3} more</li>
                  )}
                </ul>
              </div>
            ) : data.type === "manual" ? (
              <small className="text-muted d-block mb-2">Manual answer type</small>
            ) : data.type === "coding" ? (
              <small className="text-muted d-block mb-2">Coding question</small>
            ) : null}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}