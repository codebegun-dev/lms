// CodingQuestion.jsx
import React from "react";

export default function CodingQuestion({ form, setForm, errors = {} }) {
  const addTestCase = () => {
    const tc = { id: Date.now().toString(), input: "", output: "" };
    setForm((p) => ({
      ...p,
      coding: {
        ...(p.coding || {}),
        testCases: [...((p.coding && p.coding.testCases) || []), tc],
      },
    }));
  };

  const updateTestCase = (id, field, value) => {
    setForm((p) => ({
      ...p,
      coding: {
        ...(p.coding || {}),
        testCases: (p.coding.testCases || []).map((tc) =>
          tc.id === id ? { ...tc, [field]: value } : tc
        ),
      },
    }));
  };

  const removeTestCase = (id) => {
    setForm((p) => ({
      ...p,
      coding: {
        ...(p.coding || {}),
        testCases: (p.coding.testCases || []).filter((tc) => tc.id !== id),
      },
    }));
  };

  return (
    <div className="coding-question">
      <h4>Coding Question</h4>
      {errors.coding && <div className="field-error">{errors.coding}</div>}

      <label>
        Description
        <textarea
          placeholder="Describe the problem, constraints, expected input/output"
          value={(form.coding && form.coding.description) || ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, coding: { ...(p.coding || {}), description: e.target.value } }))
          }
        />
      </label>

      <label>
        Sample Input
        <input
          placeholder="Sample input (text)"
          value={(form.coding && form.coding.sampleInput) || ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, coding: { ...(p.coding || {}), sampleInput: e.target.value } }))
          }
        />
      </label>

      <label>
        Sample Output
        <input
          placeholder="Sample output"
          value={(form.coding && form.coding.sampleOutput) || ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, coding: { ...(p.coding || {}), sampleOutput: e.target.value } }))
          }
        />
      </label>

      <div style={{ marginTop: 8 }}>
        <h5>Hidden Test Cases</h5>
        {(form.coding && form.coding.testCases && form.coding.testCases.length) ? (
          (form.coding.testCases || []).map((tc) => (
            <div key={tc.id} className="testcase-row">
              <input
                placeholder="Input"
                value={tc.input}
                onChange={(e) => updateTestCase(tc.id, "input", e.target.value)}
              />
              <input
                placeholder="Output"
                value={tc.output}
                onChange={(e) => updateTestCase(tc.id, "output", e.target.value)}
              />
              <button onClick={() => removeTestCase(tc.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p className="muted">No test cases yet.</p>
        )}

        <div style={{ marginTop: 6 }}>
          <button onClick={addTestCase}>+ Add Test Case</button>
        </div>
      </div>
    </div>
  );
}
