// QuestionList.jsx
import React from "react";
import QuestionCard from "./Parts/QuestionCard";

/**
 * Props:
 * - questions: array
 * - onEdit(question)
 * - onDelete(id)
 */
export default function QuestionList({ questions = [], onEdit, onDelete }) {
  if (!questions.length) {
    return <div className="question-list empty">No questions added yet.</div>;
  }

  return (
    <div className="question-list">
      {questions.map((q) => (
        <QuestionCard key={q.id} data={q} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
