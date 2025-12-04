// Parts/OptionsBuilder.jsx
import React from "react";
import { Button, Form } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { QUESTION_TYPES } from "../Utils/QuestionTypes";

export default function OptionsBuilder({ form, setForm, errors = {} }) {
  const addOption = () => {
    const newOpt = { id: Date.now().toString(), text: "" };
    setForm((p) => ({ ...p, options: [...(p.options || []), newOpt] }));
  };

  const updateOptionText = (id, text) => {
    setForm((p) => ({
      ...p,
      options: (p.options || []).map((o) =>
        o.id === id ? { ...o, text } : o
      ),
    }));
  };

  const deleteOption = (id) => {
    setForm((p) => {
      const opts = (p.options || []).filter((o) => o.id !== id);
      const correct = (p.correctAnswers || []).filter((c) => c !== id);
      return { ...p, options: opts, correctAnswers: correct };
    });
  };

  const toggleCorrect = (id) => {
    if (form.type === QUESTION_TYPES.SINGLE) {
      setForm((p) => ({ ...p, correctAnswers: [id] }));
    } else {
      setForm((p) => {
        const existing = p.correctAnswers || [];
        if (existing.includes(id)) {
          return { ...p, correctAnswers: existing.filter((c) => c !== id) };
        }
        return { ...p, correctAnswers: [...existing, id] };
      });
    }
  };

  return (
    <div className="mt-3">
      <h5>Options</h5>

      {(errors.options || errors.correctAnswers) && (
        <div className="text-danger small mb-2">
          {errors.options || errors.correctAnswers}
        </div>
      )}

      {(form.options || []).map((opt, idx) => {
        const isChecked = (form.correctAnswers || []).includes(opt.id);

        return (
          <div
            key={opt.id}
            className="d-flex align-items-center mb-2"
          >
            {form.type === QUESTION_TYPES.SINGLE ? (
              <Form.Check
                type="radio"
                className="me-2"
                checked={isChecked}
                onChange={() => toggleCorrect(opt.id)}
              />
            ) : (
              <Form.Check
                type="checkbox"
                className="me-2"
                checked={isChecked}
                onChange={() => toggleCorrect(opt.id)}
              />
            )}

            <Form.Control
              className="me-2"
              placeholder={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => updateOptionText(opt.id, e.target.value)}
            />

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteOption(opt.id)}
            >
              <BiTrash />
            </Button>
          </div>
        );
      })}

      <Button
        variant="outline-primary"
        size="sm"
        className="mt-2"
        onClick={addOption}
      >
        + Add Option
      </Button>
    </div>
  );
}
