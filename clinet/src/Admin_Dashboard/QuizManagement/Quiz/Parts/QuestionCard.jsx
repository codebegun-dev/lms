// QuestionCard.jsx
import React from "react";

export default function QuestionCard({ data, onEdit, onDelete }) {
  // small summary view of a question
  return (
    <div className="question-card">
      <div className="question-card-header">
        <strong>{data.title || "Untitled"}</strong>
        <div className="card-actions">
          <button onClick={() => onEdit && onEdit(data)}>Edit</button>
          <button onClick={() => onDelete && onDelete(data.id)}>Delete</button>
        </div>
      </div>

      <div className="question-card-body">
        <p className="question-text">{data.question}</p>

        {data.type === "manual" && (
          <div className="meta">Manual answer: {data.manualAnswer || "—"}</div>
        )}

        {data.type === "coding" && (
          <div className="meta">
            Coding — test cases: {(data.coding && data.coding.testCases && data.coding.testCases.length) || 0}
          </div>
        )}

        {["single", "multiple"].includes(data.type) && (
          <ul className="options-summary">
            {(data.options || []).map((o) => (
              <li key={o.id}>
                {o.text}
                {data.correctAnswers && data.correctAnswers.includes(o.id) ? " ✅" : ""}
              </li>
            ))}
          </ul>
        )}

        <div className="meta">
          Marks: +{data.positiveMarks} / -{data.negativeMarks} {data.mandatory ? "(mandatory)" : ""}
        </div>
      </div>
    </div>
  );
}
