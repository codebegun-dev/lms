// QuizForm.jsx
import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FiEye, FiSave, FiRotateCcw } from "react-icons/fi";

import QuizHeader from "./Parts/QuizHeader";
import OptionsBuilder from "./Parts/OptionsBuilder";
import ManualAnswer from "./Parts/ManualAnswer";
import CodingQuestion from "./Parts/CodingQuestion";
import MarksSection from "./Parts/MarksSection";
import QuizPreview from "./QuizPreview";
import QuestionList from "./QuestionList";

import { QUESTION_TYPES } from "./Utils/QuestionTypes";
import { QuizValidation } from "./Utils/QuizValidation";

export default function QuizForm() {
  const emptyForm = {
    id: null,
    title: "",
    description: "",
    question: "",
    type: "",
    options: [],
    correctAnswers: [],
    manualAnswer: "",
    coding: {
      description: "",
      sampleInput: "",
      sampleOutput: "",
      testCases: [],
      language: "javascript",
    },
    positiveMarks: "",
    negativeMarks: "",
    mandatory: false,
    tags: [],
    difficulty: "medium",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handlePreview = () => {
    const v = QuizValidation(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setShowPreview(true);
  };

  const handleSave = () => {
    const v = QuizValidation(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});

    const saved = { ...form };
    saved.positiveMarks = Number(saved.positiveMarks);
    saved.negativeMarks = Number(saved.negativeMarks);

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? { ...saved, id: editingId } : q))
      );
      setEditingId(null);
    } else {
      saved.id = Date.now().toString();
      setQuestions((prev) => [saved, ...prev]);
    }

    setForm(emptyForm);
  };

  const handleEdit = (question) => {
    setForm({ ...question });
    setEditingId(question.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this question?")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  return (
    <Container fluid className="py-3">
      <Row>
        <Col lg={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                {editingId ? "Edit Question" : "Create Quiz Question"}
              </Card.Title>

              <QuizHeader form={form} setForm={setForm} errors={errors} />

              {(form.type === QUESTION_TYPES.SINGLE ||
                form.type === QUESTION_TYPES.MULTIPLE) && (
                <OptionsBuilder form={form} setForm={setForm} errors={errors} />
              )}

              {form.type === QUESTION_TYPES.MANUAL && (
                <ManualAnswer form={form} setForm={setForm} errors={errors} />
              )}

              {form.type === QUESTION_TYPES.CODING && (
                <CodingQuestion form={form} setForm={setForm} errors={errors} />
              )}

              <MarksSection form={form} setForm={setForm} errors={errors} />

              <div className="d-flex gap-2 mt-3">
                <Button variant="secondary" onClick={handlePreview}>
                  <FiEye className="me-1" />
                  Preview
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <FiSave className="me-1" />
                  {editingId ? "Update Question" : "Save Question"}
                </Button>
                <Button variant="outline-secondary" onClick={handleReset}>
                  <FiRotateCcw className="me-1" />
                  Reset
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>Questions ({questions.length})</Card.Header>
            <Card.Body style={{ maxHeight: 500, overflowY: "auto" }}>
              <QuestionList
                questions={questions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showPreview && (
        <QuizPreview form={form} onClose={() => setShowPreview(false)} />
      )}
    </Container>
  );
}
