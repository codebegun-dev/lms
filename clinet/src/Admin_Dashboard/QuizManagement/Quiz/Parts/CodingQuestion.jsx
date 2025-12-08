// CodingQuestion.jsx
import React from "react";
import { Button, Form } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function CodingQuestion({ form, setForm }) {
  const addTestCase = () => {
    const newCase = {
      id: Date.now(),
      input: "",
      output: "",
    };
    setForm({
      ...form,
      coding: { ...form.coding, testCases: [...form.coding.testCases, newCase] },
    });
  };

  const updateTestCase = (id, field, value) => {
    const updated = form.coding.testCases.map((tc) =>
      tc.id === id ? { ...tc, [field]: value } : tc
    );
    setForm({
      ...form,
      coding: { ...form.coding, testCases: updated },
    });
  };

  const removeTestCase = (id) => {
    setForm({
      ...form,
      coding: {
        ...form.coding,
        testCases: form.coding.testCases.filter((tc) => tc.id !== id),
      },
    });
  };

  return (
    <div className="mt-3">
      <h5>Coding Question</h5>

      {/* description */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={form.coding.description}
          onChange={(e) =>
            setForm({
              ...form,
              coding: { ...form.coding, description: e.target.value },
            })
          }
        />
      </Form.Group>

      {/* Select Language */}
      <Form.Group className="mb-3">
        <Form.Label>Language</Form.Label>
        <Form.Select
          value={form.coding.language}
          onChange={(e) =>
            setForm({
              ...form,
              coding: { ...form.coding, language: e.target.value },
            })
          }
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </Form.Select>
      </Form.Group>

      {/* Sample Input */}
      <Form.Group className="mb-3">
        <Form.Label>Sample Input</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={form.coding.sampleInput}
          onChange={(e) =>
            setForm({
              ...form,
              coding: { ...form.coding, sampleInput: e.target.value },
            })
          }
        />
      </Form.Group>

      {/* Sample Output */}
      <Form.Group className="mb-3">
        <Form.Label>Sample Output</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={form.coding.sampleOutput}
          onChange={(e) =>
            setForm({
              ...form,
              coding: { ...form.coding, sampleOutput: e.target.value },
            })
          }
        />
      </Form.Group>

      {/* Test Cases */}
      <h6 className="mt-3">Test Cases</h6>

      {form.coding.testCases.map((tc) => (
        <div key={tc.id} className="border rounded p-2 mb-2">
          <Form.Label>Input</Form.Label>
          <Form.Control
            value={tc.input}
            onChange={(e) => updateTestCase(tc.id, "input", e.target.value)}
          />

          <Form.Label className="mt-2">Output</Form.Label>
          <Form.Control
            value={tc.output}
            onChange={(e) => updateTestCase(tc.id, "output", e.target.value)}
          />

          <Button
            variant="outline-danger"
            size="sm"
            className="mt-2"
            onClick={() => removeTestCase(tc.id)}
          >
            <FaTrash /> Remove
          </Button>
        </div>
      ))}

      <Button variant="success" size="sm" onClick={addTestCase}>
        <FaPlus /> Add Test Case
      </Button>
    </div>
  );
}
