// QuestionForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { FaSave, FaTimes, FaEye } from "react-icons/fa";
import OptionsBuilder from "./Parts/OptionsBuilder";
import ManualAnswer from "./Parts/ManualAnswer";
import CodingQuestion from "./Parts/CodingQuestion";

const QUESTION_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  MANUAL: "manual",
  CODING: "coding",
};

const QuestionForm = ({ quizData, questionToEdit, onSave, onCancel, initialQuestionType, hideQuestionType = true }) => {
  const [form, setForm] = useState({
    type: initialQuestionType || QUESTION_TYPES.SINGLE,
    question: "",
    options: [],
    correctAnswers: [],
    manualAnswer: "",
    positiveMarks: 1,
    negativeMarks: 0,
    mandatory: false,
    coding: {
      description: "",
      sampleInput: "",
      sampleOutput: "",
      testCases: [],
      language: "javascript",
    },
  });

  const [errors, setErrors] = useState({});

  // Initialize form if editing
  useEffect(() => {
    if (questionToEdit) {
      setForm({
        type: questionToEdit.type,
        question: questionToEdit.question,
        options: questionToEdit.options || [],
        correctAnswers: questionToEdit.correctAnswers || [],
        manualAnswer: questionToEdit.manualAnswer || "",
        positiveMarks: questionToEdit.positiveMarks || 1,
        negativeMarks: questionToEdit.negativeMarks || 0,
        mandatory: questionToEdit.mandatory || false,
        coding: questionToEdit.coding || {
          description: "",
          sampleInput: "",
          sampleOutput: "",
          testCases: [],
          language: "javascript",
        },
      });
    } else if (initialQuestionType) {
      // Set the initial question type from props
      setForm(prev => ({ ...prev, type: initialQuestionType }));
    }
  }, [questionToEdit, initialQuestionType]);

  // Question Type change handler (only used if hideQuestionType is false)
  const handleTypeChange = (type) => {
    setForm({
      ...form,
      type,
      options: type === 'single' || type === 'multiple' ? form.options : [],
      correctAnswers: type === 'single' || type === 'multiple' ? form.correctAnswers : [],
      manualAnswer: type === 'manual' ? form.manualAnswer : "",
      coding: { 
        ...form.coding, 
        description: type === 'coding' ? form.coding.description : "" 
      },
    });
    setErrors({});
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.question.trim()) {
      newErrors.question = "Question text is required.";
    }

    if (form.type === QUESTION_TYPES.SINGLE || form.type === QUESTION_TYPES.MULTIPLE) {
      if (form.options.length < 2) {
        newErrors.options = "At least two options are required.";
      }
      if (form.correctAnswers.length === 0) {
        newErrors.correctAnswers = "Select at least one correct answer.";
      }
    } else if (form.type === QUESTION_TYPES.MANUAL) {
      if (!form.manualAnswer.trim()) {
        newErrors.manualAnswer = "Expected answer is required.";
      }
    } else if (form.type === QUESTION_TYPES.CODING) {
      if (!form.coding.description.trim()) {
        newErrors.coding = "Problem description is required.";
      }
    }

    if (form.positiveMarks <= 0) {
      newErrors.positiveMarks = "Positive marks must be greater than 0.";
    }

    if (form.negativeMarks < 0) {
      newErrors.negativeMarks = "Negative marks cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(form);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!validateForm()) {
      return;
    }
    // For now, just show an alert
    alert("Preview functionality - Coming soon!");
    // You can implement a preview modal here
  };

  // Get question type display name
  const getQuestionTypeDisplay = () => {
    switch(form.type) {
      case QUESTION_TYPES.SINGLE:
        return "Single Choice Question";
      case QUESTION_TYPES.MULTIPLE:
        return "Multiple Choice Question";
      case QUESTION_TYPES.MANUAL:
        return "Manual Answer Question";
      case QUESTION_TYPES.CODING:
        return "Coding Question";
      default:
        return "Question";
    }
  };

  return (
    <Card className="border-primary">
      <Card.Body>
        {/* Display Question Type as read-only if hidden */}
        {hideQuestionType && (
          <div className="mb-3 p-2 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Question Type:</strong> {getQuestionTypeDisplay()}
              </div>
              {!questionToEdit && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    // Option to go back and change question type
                    onCancel();
                  }}
                >
                  Change Type
                </Button>
              )}
            </div>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Question Type Selection - Only show if hideQuestionType is false */}
          {!hideQuestionType && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Question Type *</strong></Form.Label>
              <Form.Select
                value={form.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                isInvalid={!!errors.type}
              >
                <option value={QUESTION_TYPES.SINGLE}>Single Choice</option>
                <option value={QUESTION_TYPES.MULTIPLE}>Multiple Choice</option>
                <option value={QUESTION_TYPES.MANUAL}>Manual Answer</option>
                <option value={QUESTION_TYPES.CODING}>Coding Question</option>
              </Form.Select>
              {errors.type && (
                <Form.Text className="text-danger">{errors.type}</Form.Text>
              )}
            </Form.Group>
          )}

          {/* Question Text */}
          <Form.Group className="mb-3">
            <Form.Label><strong>Question Text *</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Enter your question here..."
              isInvalid={!!errors.question}
            />
            {errors.question && (
              <Form.Text className="text-danger">{errors.question}</Form.Text>
            )}
          </Form.Group>

          {/* Dynamic Sections based on Question Type */}
          {(form.type === QUESTION_TYPES.SINGLE || form.type === QUESTION_TYPES.MULTIPLE) && (
            <>
              <Form.Group className="mb-3">
                <Form.Label><strong>Options *</strong></Form.Label>
                {errors.options && (
                  <Alert variant="danger" className="py-2">{errors.options}</Alert>
                )}
                <OptionsBuilder form={form} setForm={setForm} />
              </Form.Group>
              
              {errors.correctAnswers && (
                <Alert variant="danger" className="py-2">{errors.correctAnswers}</Alert>
              )}
            </>
          )}

          {form.type === QUESTION_TYPES.MANUAL && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Expected Answer *</strong></Form.Label>
              {errors.manualAnswer && (
                <Alert variant="danger" className="py-2">{errors.manualAnswer}</Alert>
              )}
              <ManualAnswer form={form} setForm={setForm} />
            </Form.Group>
          )}

          {form.type === QUESTION_TYPES.CODING && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Coding Problem Details *</strong></Form.Label>
              {errors.coding && (
                <Alert variant="danger" className="py-2">{errors.coding}</Alert>
              )}
              <CodingQuestion form={form} setForm={setForm} />
            </Form.Group>
          )}

          {/* Marks Section */}
          <Card className="mb-3">
            <Card.Body>
              <h6 className="mb-3">Scoring</h6>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label><strong>Positive Marks *</strong></Form.Label>
                    <Form.Control
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={form.positiveMarks}
                      onChange={(e) => setForm({ ...form, positiveMarks: parseFloat(e.target.value) || 0 })}
                      isInvalid={!!errors.positiveMarks}
                    />
                    {errors.positiveMarks && (
                      <Form.Text className="text-danger">{errors.positiveMarks}</Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label><strong>Negative Marks</strong></Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.negativeMarks}
                      onChange={(e) => setForm({ ...form, negativeMarks: parseFloat(e.target.value) || 0 })}
                      isInvalid={!!errors.negativeMarks}
                    />
                    {errors.negativeMarks && (
                      <Form.Text className="text-danger">{errors.negativeMarks}</Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <Form.Group className="mb-0">
                    <Form.Check
                      type="checkbox"
                      label={<strong>Mandatory Question</strong>}
                      checked={form.mandatory}
                      onChange={(e) => setForm({ ...form, mandatory: e.target.checked })}
                    />
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between border-top pt-3">
            <Button variant="outline-secondary" onClick={onCancel}>
              <FaTimes className="me-2" />
              Cancel
            </Button>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={handlePreview}>
                <FaEye className="me-2" />
                Preview
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-2" />
                {questionToEdit ? "Update Question" : "Save Question"}
              </Button>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionForm;