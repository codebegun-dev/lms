// Parts/QuizHeader.jsx
import React from "react";
import { Form } from "react-bootstrap";
import {
  QUESTION_TYPE_OPTIONS,
  QUESTION_TYPE_DESCRIPTIONS,
} from "../Utils/QuestionTypes";

export default function QuizHeader({ form, setForm, errors = {} }) {
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      type: value,
      options:
        value === "single" || value === "multiple" ? prev.options || [] : [],
      correctAnswers: [],
      manualAnswer: "",
      coding: {
        description: "",
        sampleInput: "",
        sampleOutput: "",
        testCases: [],
        language: "javascript",
      },
    }));
  };

  return (
    <>
      <Form.Group className="mb-2">
        <Form.Label>Quiz Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter quiz title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          isInvalid={!!errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Description (optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Question Type</Form.Label>
        <Form.Select value={form.type} onChange={handleTypeChange} isInvalid={!!errors.type}>
          <option value="">-- select type --</option>
          {QUESTION_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.type}
        </Form.Control.Feedback>
        {form.type && (
          <div className="form-text">
            {QUESTION_TYPE_DESCRIPTIONS[form.type]}
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write the question shown to learners"
          value={form.question}
          onChange={(e) =>
            setForm((p) => ({ ...p, question: e.target.value }))
          }
          isInvalid={!!errors.question}
        />
        <Form.Control.Feedback type="invalid">
          {errors.question}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
}
