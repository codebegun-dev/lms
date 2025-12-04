// ManualAnswer.jsx
import React from "react";

export default function ManualAnswer({ form, setForm, errors = {} }) {
  return (
    <div className="manual-answer">
      <h4>Manual Answer</h4>
      <div>
        <label>
          Correct Answer (for validation / preview)
          <textarea
            placeholder="Type the exact correct answer or a canonical answer"
            value={form.manualAnswer}
            onChange={(e) => setForm((p) => ({ ...p, manualAnswer: e.target.value }))}
          />
        </label>
        {errors.manualAnswer && <div className="field-error">{errors.manualAnswer}</div>}
      </div>

      <small>
        During preview, a text input will be shown to demonstrate how learners enter the answer.
      </small>
    </div>
  );
}
