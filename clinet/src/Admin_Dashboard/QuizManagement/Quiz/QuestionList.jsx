import React from "react";
import QuestionCard from "./Parts/QuestionCard";

export default function QuestionList({ questions }) {
  if (!questions.length) {
    return <div>No questions added yet.</div>;
  }

  return (
    <>
      {questions.map((q) => (
        <QuestionCard key={q.id} data={q} />
      ))}
    </>
  );
}
