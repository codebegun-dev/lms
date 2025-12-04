// MarksSection.jsx
import React from "react";

export default function MarksSection({ form, setForm, errors = {} }) {
  return (
    <div className="marks-section">
      <h4>Marks</h4>

      <div className="marks-row">
        <label>
          Positive Marks
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.positiveMarks}
            onChange={(e) => setForm((p) => ({ ...p, positiveMarks: e.target.value }))}
          />
        </label>

        <label>
          Negative Marks
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.negativeMarks}
            onChange={(e) => setForm((p) => ({ ...p, negativeMarks: e.target.value }))}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Mandatory?
          <input
            type="checkbox"
            checked={!!form.mandatory}
            onChange={(e) => setForm((p) => ({ ...p, mandatory: e.target.checked }))}
          />
        </label>
      </div>

      {errors.positiveMarks && <div className="field-error">{errors.positiveMarks}</div>}
      {errors.negativeMarks && <div className="field-error">{errors.negativeMarks}</div>}
    </div>
  );
}
