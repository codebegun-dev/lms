// QuizForm.jsx - Updated with API integration
import React, { useState } from "react";
import { Form, Alert, Modal, Button } from "react-bootstrap";
import OptionsBuilder from "./Parts/OptionsBuilder";
import ManualAnswer from "./Parts/ManualAnswer";
import CodingQuestion from "./Parts/CodingQuestion";
import AIQuestionModal from "./Parts/AIQuestionModal";
import QuestionCard from "./Parts/QuestionCard";
import axios from "axios";

// Define QUESTION_TYPES locally
const QUESTION_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  MANUAL: "manual",
  CODING: "coding",
};

const QUESTION_TYPE_OPTIONS = [
  { label: "Single Choice", value: QUESTION_TYPES.SINGLE },
  { label: "Multiple Choice", value: QUESTION_TYPES.MULTIPLE },
  { label: "Manual Answer", value: QUESTION_TYPES.MANUAL },
  { label: "Coding Question", value: QUESTION_TYPES.CODING },
];

// QuizValidation function
function QuizValidation(form) {
  const errors = {};

  // REQUIRED: Quiz Title
  if (!form.title || String(form.title).trim() === "") {
    errors.title = "Quiz title is required.";
  }

  // REQUIRED: Question Type
  if (!form.type) {
    errors.type = "Question type is required.";
  }

  // REQUIRED: Question Text
  if (!form.question || String(form.question).trim() === "") {
    errors.question = "Question text is required.";
  }

  // Validation based on question type
  if (form.type === QUESTION_TYPES.SINGLE || form.type === QUESTION_TYPES.MULTIPLE) {
    if (!Array.isArray(form.options) || form.options.length < 2) {
      errors.options = "At least two options are required.";
    } else {
      const emptyOpt = form.options.find(
        (o) => !o.text || String(o.text).trim() === ""
      );
      if (emptyOpt) errors.options = "All options must have text.";
    }

    if (!Array.isArray(form.correctAnswers) || form.correctAnswers.length === 0) {
      errors.correctAnswers = "Select at least one correct answer.";
    }

    if (form.type === QUESTION_TYPES.SINGLE && form.correctAnswers.length > 1) {
      errors.correctAnswers = "Only one correct answer allowed for single choice.";
    }
  } else if (form.type === QUESTION_TYPES.MANUAL) {
    if (!form.manualAnswer || String(form.manualAnswer).trim() === "") {
      errors.manualAnswer = "Manual answer cannot be empty.";
    }
  } else if (form.type === QUESTION_TYPES.CODING) {
    if (!form.coding || String(form.coding.description).trim() === "") {
      errors.coding = "Coding question description required.";
    }
  }

  // marks validation
  if (form.positiveMarks === "" || form.positiveMarks === null || Number.isNaN(Number(form.positiveMarks))) {
    errors.positiveMarks = "Positive marks are required.";
  } else if (Number(form.positiveMarks) <= 0) {
    errors.positiveMarks = "Positive marks must be greater than 0.";
  }

  if (form.negativeMarks === "" || form.negativeMarks === null || Number.isNaN(Number(form.negativeMarks))) {
    errors.negativeMarks = "Negative marks are required (0 allowed).";
  } else if (Number(form.negativeMarks) < 0) {
    errors.negativeMarks = "Negative marks cannot be negative.";
  } else if (Number(form.negativeMarks) > Number(form.positiveMarks)) {
    errors.negativeMarks = "Negative marks should not exceed positive marks.";
  }

  return errors;
}

// Preview Modal Component
function PreviewModal({ show, onClose, form }) {
  if (!form) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Question Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="preview-content">
          <h5 className="mb-3">{form.question || "No question text"}</h5>

          {/* Single Choice */}
          {form.type === QUESTION_TYPES.SINGLE && (
            <div>
              <p className="mb-2"><strong>Select one answer:</strong></p>
              {form.options?.map((option, index) => (
                <div key={option.id} className="form-check mb-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="previewAnswer"
                    id={`preview-radio-${index}`}
                    disabled
                  />
                  <label className="form-check-label" htmlFor={`preview-radio-${index}`}>
                    {option.text || `Option ${index + 1}`}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Multiple Choice */}
          {form.type === QUESTION_TYPES.MULTIPLE && (
            <div>
              <p className="mb-2"><strong>Select all that apply:</strong></p>
              {form.options?.map((option, index) => (
                <div key={option.id} className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="previewAnswer"
                    id={`preview-check-${index}`}
                    disabled
                  />
                  <label className="form-check-label" htmlFor={`preview-check-${index}`}>
                    {option.text || `Option ${index + 1}`}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Manual Answer */}
          {form.type === QUESTION_TYPES.MANUAL && (
            <div>
              <p className="mb-2"><strong>Type your answer:</strong></p>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter your answer here..."
                disabled
              />
            </div>
          )}

          {/* Coding Question */}
          {form.type === QUESTION_TYPES.CODING && (
            <div>
              <p className="mb-2"><strong>Problem Statement:</strong></p>
              <div className="bg-light p-3 rounded mb-3">
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {form.coding?.description || form.question || "No description"}
                </pre>
              </div>

              {form.coding?.sampleInput && (
                <div className="mb-3">
                  <p className="mb-1"><strong>Sample Input:</strong></p>
                  <pre className="bg-dark text-white p-2 rounded">
                    {form.coding.sampleInput}
                  </pre>
                </div>
              )}

              {form.coding?.sampleOutput && (
                <div className="mb-3">
                  <p className="mb-1"><strong>Sample Output:</strong></p>
                  <pre className="bg-dark text-white p-2 rounded">
                    {form.coding.sampleOutput}
                  </pre>
                </div>
              )}

              <div className="mb-3">
                <p className="mb-1"><strong>Write your code:</strong></p>
                <textarea
                  className="form-control font-monospace"
                  rows={8}
                  placeholder={`// Write your ${form.coding?.language || 'JavaScript'} code here...`}
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function QuizForm() {
  const emptyForm = {
    title: "",
    description: "",
    type: "",
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
  };

  const [form, setForm] = useState(emptyForm);
  const [questions, setQuestions] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showQuestionUI, setShowQuestionUI] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Question Type change handler
  const handleTypeChange = (type) => {
    setForm({
      ...form,
      type,
      options: [],
      correctAnswers: [],
      manualAnswer: "",
      coding: { ...emptyForm.coding },
    });
    setErrors({});
  };

  // Handle Save Question with validation
  const handleSave = () => {
    const validationErrors = QuizValidation(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const newQuestion = {
      ...form,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setForm({ ...emptyForm, title: form.title, description: form.description });
    setShowQuestionUI(false);
    setErrors({});
  };

  // Handle AI generated questions
  const handleAIQuestions = async (prompt, count, questionType) => {
    try {
      console.log("Generating AI questions with prompt:", prompt, "count:", count, "type:", questionType);

      const typeToUse = questionType || form.type || QUESTION_TYPES.SINGLE;

      const mockGeneratedQuestions = Array.from({ length: Math.min(count, 10) }, (_, i) => {
        const baseQuestion = {
          id: Date.now() + i,
          title: form.title,
          description: form.description,
          type: typeToUse,
          question: `${prompt.split(' ').slice(0, 5).join(' ')} - Question ${i + 1}`,
          positiveMarks: form.positiveMarks || 1,
          negativeMarks: form.negativeMarks || 0,
          mandatory: false,
          timestamp: new Date().toISOString()
        };

        if (typeToUse === QUESTION_TYPES.SINGLE || typeToUse === QUESTION_TYPES.MULTIPLE) {
          return {
            ...baseQuestion,
            options: [
              { id: Date.now() + i * 10 + 1, text: "Option A" },
              { id: Date.now() + i * 10 + 2, text: "Option B" },
              { id: Date.now() + i * 10 + 3, text: "Option C" },
              { id: Date.now() + i * 10 + 4, text: "Option D" }
            ],
            correctAnswers: typeToUse === QUESTION_TYPES.SINGLE ?
              [Date.now() + i * 10 + 1] :
              [Date.now() + i * 10 + 1, Date.now() + i * 10 + 2]
          };
        } else if (typeToUse === QUESTION_TYPES.MANUAL) {
          return {
            ...baseQuestion,
            manualAnswer: "This is a sample answer generated by AI."
          };
        } else if (typeToUse === QUESTION_TYPES.CODING) {
          return {
            ...baseQuestion,
            coding: {
              description: `${prompt.split(' ').slice(0, 5).join(' ')} - Coding Problem ${i + 1}`,
              sampleInput: "Sample input",
              sampleOutput: "Sample output",
              testCases: [{ id: Date.now() + i * 10 + 1, input: "test", output: "result" }],
              language: "javascript"
            }
          };
        }

        return baseQuestion;
      });

      setQuestions((prev) => [...prev, ...mockGeneratedQuestions]);
      alert(`Successfully generated ${mockGeneratedQuestions.length} questions!`);
    } catch (error) {
      console.error("Error generating AI questions:", error);
      alert("Failed to generate questions. Please try again.");
    }
  };

  // Delete question
  const handleDeleteQuestion = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  // Edit question
  const handleEditQuestion = (question) => {
    setForm(question);
    setShowQuestionUI(true);
    setErrors({});
    setQuestions(questions.filter(q => q.id !== question.id));
  };

  // Prepare quiz data for API
  const prepareQuizData = () => {
    const totalMarks = questions.reduce((sum, q) => sum + (parseFloat(q.positiveMarks) || 0), 0);
    const hasNegativeMarking = questions.some(q => q.negativeMarks > 0);
    
    // Determine the main question type (use most frequent type or first question's type)
    const typeCounts = {};
    questions.forEach(q => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });
    const mainQuestionType = Object.keys(typeCounts).length > 0 
      ? Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b)
      : questions[0]?.type || "single";

    // Prepare questions array for backend
    const formattedQuestions = questions.map(q => {
      const baseQuestion = {
        question: q.question,
        type: q.type,
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks,
        mandatory: q.mandatory,
        timestamp: q.timestamp
      };

      if (q.type === QUESTION_TYPES.SINGLE || q.type === QUESTION_TYPES.MULTIPLE) {
        return {
          ...baseQuestion,
          options: q.options,
          correctAnswers: q.correctAnswers
        };
      } else if (q.type === QUESTION_TYPES.MANUAL) {
        return {
          ...baseQuestion,
          manualAnswer: q.manualAnswer
        };
      } else if (q.type === QUESTION_TYPES.CODING) {
        return {
          ...baseQuestion,
          coding: q.coding
        };
      }

      return baseQuestion;
    });

    return {
      title: form.title,
      description: form.description || "",
      difficulty: "Medium",  
      duration: "30m",  
      marks: totalMarks,
      negativeMarking: hasNegativeMarking,
      questionType: mainQuestionType,
      questions: formattedQuestions
    };
  };

  // Save quiz to backend API

const saveQuizToBackend = async () => {
  try {
    setLoading(true);
    
    const quizData = prepareQuizData();
    
    console.log("Sending quiz data to backend:", quizData);
    
    // ✅ Use the correct backend URL (default Spring Boot port is 8080)
    const response = await axios.post('http://localhost:8080/api/quizzes', quizData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("Quiz saved successfully:", response.data);
    
    alert( " saved successfully ");
    
    // Reset form after successful save
    setForm(emptyForm);
    setQuestions([]);
    setShowQuestionUI(false);
    setErrors({});
    
  } catch (error) {
    console.error("Error saving quiz:", error);
    
    let errorMessage = "Failed to save quiz. Please try again.";
    
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", error.response.data);
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
      errorMessage = "No response from server. Please check if backend is running on port 8080.";
    } else {
      console.error("Error message:", error.message);
      errorMessage = `Network error: ${error.message}`;
    }
    
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // End Quiz - with validation and API call
  const handleEndQuiz = async () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Quiz title is required.";
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save quiz to backend
    await saveQuizToBackend();
  };

  // Handle Add Manually button click
  const handleAddManually = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Quiz title is required.";
    }
    
    if (!form.type) {
      newErrors.type = "Question type is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowQuestionUI(true);
    setErrors({});
  };

  // Handle AI button click
  const handleUseAI = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Quiz title is required.";
    }
    
    if (!form.type) {
      newErrors.type = "Question type is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowAiModal(true);
  };

  return (
    <div className="p-3">
      {/* QUIZ HEADER */}
      <div className="border rounded p-3 mb-3 bg-light">
        <h4>Create Quiz</h4>

        {errors.title && (
          <Alert variant="danger" className="p-2">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.title}
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label>
            <strong>Quiz Title</strong> <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter quiz title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (errors.title) {
                setErrors({...errors, title: null});
              }
            }}
            isInvalid={!!errors.title}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><strong>Description</strong> (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Enter quiz description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        {/* QUESTION TYPE SELECTION */}
        {errors.type && (
          <Alert variant="danger" className="p-2">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.type}
          </Alert>
        )}
        
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>Question Type</strong> <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            value={form.type}
            onChange={(e) => {
              handleTypeChange(e.target.value);
              if (errors.type) {
                setErrors({...errors, type: null});
              }
            }}
            className="mb-2"
            isInvalid={!!errors.type}
          >
            <option value="">Select question type</option>
            {QUESTION_TYPE_OPTIONS.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {/* BUTTONS: ADD MANUALLY + AI */}
      <div className="d-flex justify-content-center gap-3 my-3">
        <button
          className="btn btn-outline-primary"
          onClick={handleAddManually}
        >
          Add Manually
        </button>

        <button
          className="btn btn-outline-success"
          onClick={handleUseAI}
        >
          Use AI
        </button>
      </div>

      {/* QUESTION BUILDER UI */}
      {showQuestionUI && (
        <div className="mt-3 border rounded p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Create Question</h5>
            <span className="text-danger">* Required fields</span>
          </div>

          {/* Question Input */}
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Question Text</strong> <span className="text-danger">*</span>
            </Form.Label>
            {errors.question && (
              <Alert variant="danger" className="p-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errors.question}
              </Alert>
            )}
            <Form.Control
              as="textarea"
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Enter your question here..."
              isInvalid={!!errors.question}
            />
          </Form.Group>

          {/* Dynamic Sections based on Question Type */}
          {form.type === QUESTION_TYPES.SINGLE || form.type === QUESTION_TYPES.MULTIPLE ? (
            <>
              {errors.options && (
                <Alert variant="danger" className="p-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.options}
                </Alert>
              )}
              {errors.correctAnswers && (
                <Alert variant="danger" className="p-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.correctAnswers}
                </Alert>
              )}
              <OptionsBuilder form={form} setForm={setForm} />
            </>
          ) : null}

          {form.type === QUESTION_TYPES.MANUAL ? (
            <>
              {errors.manualAnswer && (
                <Alert variant="danger" className="p-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.manualAnswer}
                </Alert>
              )}
              <ManualAnswer form={form} setForm={setForm} />
            </>
          ) : null}

          {form.type === QUESTION_TYPES.CODING ? (
            <>
              {errors.coding && (
                <Alert variant="danger" className="p-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.coding}
                </Alert>
              )}
              <CodingQuestion form={form} setForm={setForm} />
            </>
          ) : null}

          {/* Marks Section */}
          <div className="row mt-4">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <strong>Positive Marks</strong> <span className="text-danger">*</span>
                </Form.Label>
                {errors.positiveMarks && (
                  <Alert variant="danger" className="p-1 mb-1">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.positiveMarks}
                  </Alert>
                )}
                <Form.Control
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.positiveMarks}
                  onChange={(e) =>
                    setForm({ ...form, positiveMarks: Number(e.target.value) })
                  }
                  isInvalid={!!errors.positiveMarks}
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  <strong>Negative Marks</strong> <span className="text-danger">*</span>
                </Form.Label>
                {errors.negativeMarks && (
                  <Alert variant="danger" className="p-1 mb-1">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.negativeMarks}
                  </Alert>
                )}
                <Form.Control
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.negativeMarks}
                  onChange={(e) =>
                    setForm({ ...form, negativeMarks: Number(e.target.value) })
                  }
                  isInvalid={!!errors.negativeMarks}
                />
              </Form.Group>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <Form.Check
                type="checkbox"
                label={<strong>Mandatory Question</strong>}
                checked={form.mandatory}
                onChange={(e) =>
                  setForm({ ...form, mandatory: e.target.checked })
                }
                className="mb-0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top">
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPreviewModal(true)}
              >
                Preview
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Question
              </button>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => {
                setForm({ ...emptyForm, title: form.title, description: form.description });
                setShowQuestionUI(false);
                setErrors({});
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* AI MODAL */}
      <AIQuestionModal
        show={showAiModal}
        onClose={() => {
          setShowAiModal(false);
        }}
        onGenerate={handleAIQuestions}
      />

      {/* PREVIEW MODAL */}
      <PreviewModal
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        form={form}
      />

      {/* ADDED QUESTIONS LIST */}
      {questions.length > 0 && (
        <div className="mt-4">
          <h4>Added Questions ({questions.length})</h4>
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={question.id} className="mb-3">
                <QuestionCard data={question} index={index} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* END QUIZ BUTTON */}
      {questions.length > 0 && (
        <div className="mt-4 border-top pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5>Quiz Summary</h5>
              <p className="text-muted mb-0">
                Total Questions: <strong>{questions.length}</strong> |
                Total Marks: <strong className="text-success">
                  {questions.reduce((sum, q) => sum + (parseFloat(q.positiveMarks) || 0), 0)}
                </strong>
              </p>
            </div>
            <button
              className="btn btn-lg btn-success px-4"
              onClick={handleEndQuiz}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                'Save & End Quiz'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}