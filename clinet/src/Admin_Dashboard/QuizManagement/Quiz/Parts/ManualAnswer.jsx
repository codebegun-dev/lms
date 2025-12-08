// ManualAnswer.jsx
import React from "react";
import { Form } from "react-bootstrap";

export default function ManualAnswer({ form, setForm }) {
  return (
    <div className="mt-3">
      <h5>Manual Answer</h5>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Enter expected answer"
        value={form.manualAnswer}
        onChange={(e) => setForm({ ...form, manualAnswer: e.target.value })}
      />
    </div>
  );
}
