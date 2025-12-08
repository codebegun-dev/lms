 
import React from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { FaPlus, FaTrash, FaGripVertical } from "react-icons/fa";

export default function OptionsBuilder({ form, setForm }) {
  const MAX_OPTIONS = 5;

  const addOption = () => {
    if (form.options.length >= MAX_OPTIONS) {
      alert(`Maximum ${MAX_OPTIONS} options allowed`);
      return;
    }
    
    const newOption = {
      id: Date.now(),
      text: "",
    };
    setForm({ ...form, options: [...form.options, newOption] });
  };

  const updateText = (id, value) => {
    const updated = form.options.map((o) =>
      o.id === id ? { ...o, text: value } : o
    );
    setForm({ ...form, options: updated });
  };

  const toggleCorrect = (id) => {
    if (form.type === "single") {
      setForm({ ...form, correctAnswers: [id] });
    } else {
      const exists = form.correctAnswers.includes(id);
      setForm({
        ...form,
        correctAnswers: exists
          ? form.correctAnswers.filter((x) => x !== id)
          : [...form.correctAnswers, id],
      });
    }
  };

  const removeOption = (id) => {
    setForm({
      ...form,
      options: form.options.filter((o) => o.id !== id),
      correctAnswers: form.correctAnswers.filter((ans) => ans !== id),
    });
  };

  // Drag and Drop handlers for options
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = '2px solid #007bff';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderTop = '';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = '';
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newOptions = [...form.options];
    const [draggedItem] = newOptions.splice(dragIndex, 1);
    newOptions.splice(dropIndex, 0, draggedItem);
    
    setForm({ ...form, options: newOptions });
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Options</h5>        
      </div>

      {form.options.length >= MAX_OPTIONS && (
        <Alert variant="warning" className="small p-2">
          Maximum {MAX_OPTIONS} options reached. Remove an option to add new one.
        </Alert>
      )}

      <div className="options-container">
        {form.options.map((option, index) => (
          <div
            key={option.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className="d-flex align-items-center gap-2 mb-2 border rounded p-2"
            style={{ cursor: 'move' }}
          >
            {/* Drag handle */}
            <span className="text-muted" style={{ cursor: 'grab' }}>
              <FaGripVertical />
            </span>

            {/* Correct Checkbox */}
            <Form.Check
              type={form.type === "single" ? "radio" : "checkbox"}
              checked={form.correctAnswers.includes(option.id)}
              onChange={() => toggleCorrect(option.id)}
              name={form.type === "single" ? "correctOption" : undefined}
            />

            {/* Option Input */}
            <Form.Control
              type="text"
              value={option.text}
              onChange={(e) => updateText(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-grow-1"
            />

            {/* Delete button */}
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => removeOption(option.id)}
              disabled={form.options.length <= 2}
              title={form.options.length <= 2 ? "Need at least 2 options" : "Remove option"}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </div>

      <Button 
        variant="success" 
        size="sm" 
        onClick={addOption}
        disabled={form.options.length >= MAX_OPTIONS}
        className="mt-2"
      >
        <FaPlus /> Add Option  
      </Button>
    </div>
  );
}