// QuestionManagement.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Badge, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaQuestionCircle, FaEdit, FaTrash, FaPlus, FaRobot, FaEye, FaCheck } from "react-icons/fa";
import QuestionForm from "./QuestionForm";

const QuestionManagement = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [questionType, setQuestionType] = useState("single"); // Default to single choice
  const [showQuestionTypeSelection, setShowQuestionTypeSelection] = useState(true);

  // Fetch quiz and questions from localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const foundQuiz = quizzes.find(q => q.id === parseInt(quizId));
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setQuestions(foundQuiz.questions || []);
        
        // If there are existing questions, hide question type selection
        if (foundQuiz.questions && foundQuiz.questions.length > 0) {
          setShowQuestionTypeSelection(false);
        }
      } else {
        showAlert("Quiz not found", "danger");
        navigate("/admin-dashboard/quizzes");
      }
    }
  }, [quizId, navigate]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // Handle Add Manually button click
  const handleAddManually = () => {
    if (!questionType) {
      showAlert("Please select a question type first", "warning");
      return;
    }

    setEditingQuestion(null);
    setShowQuizForm(true);
    setShowQuestionTypeSelection(false);
  };

  // Handle AI button click
  const handleUseAI = () => {
    if (!questionType) {
      showAlert("Please select a question type first", "warning");
      return;
    }

    // Show AI modal or implement AI functionality
    showAlert("AI Question Generation - Coming Soon!", "info");
  };

  // Handle saving a question
  const handleSaveQuestion = (questionData) => {
    let updatedQuestions;
    
    if (editingQuestion) {
      // Update existing question
      updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id ? { ...questionData, id: editingQuestion.id } : q
      );
      showAlert("Question updated successfully!", "success");
    } else {
      // Add new question
      const newQuestion = {
        ...questionData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      updatedQuestions = [...questions, newQuestion];
      showAlert("Question added successfully!", "success");
    }

    setQuestions(updatedQuestions);
    
    // Update quiz in localStorage
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const updatedQuizzes = quizzes.map(q => 
        q.id === parseInt(quizId) ? { ...q, questions: updatedQuestions } : q
      );
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
    }

    // After saving, show question type selection again for adding more questions
    setShowQuizForm(false);
    setEditingQuestion(null);
    setShowQuestionTypeSelection(true);
  };

  // Handle canceling question form
  const handleCancelForm = () => {
    setShowQuizForm(false);
    setEditingQuestion(null);
    // If there are no questions, show question type selection
    if (questions.length === 0) {
      setShowQuestionTypeSelection(true);
    }
  };

  // Handle editing a question
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionType(question.type);
    setShowQuizForm(true);
    setShowQuestionTypeSelection(false);
  };

  // Handle deleting a question
  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      
      // Update quiz in localStorage
      const savedQuizzes = localStorage.getItem("quizzes");
      if (savedQuizzes) {
        const quizzes = JSON.parse(savedQuizzes);
        const updatedQuizzes = quizzes.map(q => 
          q.id === parseInt(quizId) ? { ...q, questions: updatedQuestions } : q
        );
        localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
      }
      
      showAlert("Question deleted successfully!", "success");
    }
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (parseFloat(q.positiveMarks) || 0), 0);
  };

  if (!quiz) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Alert */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ message: "", type: "" })}></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate("/admin-dashboard/quizzes")}
            className="me-3"
          >
            <FaArrowLeft className="me-2" />
            Back to Quiz List
          </Button>
          <h2 className="d-inline-block mb-0">
            <FaQuestionCircle className="me-2 text-primary" />
            {quiz.title}
          </h2>
        </div>
        <div>
          <Badge bg="info" className="me-2">
            {questions.length} Questions
          </Badge>
          <Badge bg="success">
            Total Marks: {calculateTotalMarks()}
          </Badge>
        </div>
      </div>

      {/* Quiz Info Card */}
      <Card className="mb-4 border-primary">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Quiz Details</h5>
              <p className="mb-1"><strong>Subject:</strong> {quiz.subjectName}</p>
              {quiz.subtopicName && quiz.subtopicName !== "All" && (
                <p className="mb-1"><strong>Subtopic:</strong> {quiz.subtopicName}</p>
              )}
              <p className="mb-1"><strong>Time Limit:</strong> {quiz.timeLimit} minutes</p>
              <p className="mb-1"><strong>Type:</strong> {quiz.quizType}</p>
            </Col>
            <Col md={6}>
              <h5>Security Settings</h5>
              <p className="mb-1">
                <strong>Tab Switching:</strong>{" "}
                {quiz.enableTabSwitchRestriction ? 
                  `Restricted (${quiz.maxTabSwitchAttempts} attempts)` : 
                  "Not Restricted"}
              </p>
              <p className="mb-1">
                <strong>Camera:</strong> {quiz.enableCamera ? "Enabled" : "Disabled"}
              </p>
              <p className="mb-1">
                <strong>Recording:</strong> {quiz.enableRecording ? "Enabled" : "Disabled"}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Question Management Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaQuestionCircle className="me-2" />
              Manage Questions
            </h4>
            {questions.length > 0 && !showQuizForm && (
              <Button 
                variant="success" 
                onClick={() => setShowQuestionTypeSelection(true)}
              >
                <FaPlus className="me-2" />
                Add More Questions
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Question Type Selection (Shows when adding new questions) */}
          {showQuestionTypeSelection && !showQuizForm && (
            <div className="mb-4 p-4 border rounded bg-light">
              <h5 className="mb-3">
                {questions.length === 0 ? "Add Your First Question" : "Add Another Question"}
              </h5>
              
              {/* Question Type Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold">Select Question Type</label>
                <select
                  className="form-select mb-3"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="manual">Manual Answer</option>
                  <option value="coding">Coding Question</option>
                </select>
                <div className="small text-muted">
                  {questionType === 'single' && "Select one correct answer from multiple options"}
                  {questionType === 'multiple' && "Select multiple correct answers from options"}
                  {questionType === 'manual' && "Student types their answer (short/long answer)"}
                  {questionType === 'coding' && "Student writes code to solve a programming problem"}
                </div>
              </div>

              {/* Add Manually + Use AI Buttons */}
              <div className="d-flex justify-content-center gap-3 my-4">
                <Button
                  variant="primary"
                  className="px-4 py-2 d-flex flex-column align-items-center"
                  onClick={handleAddManually}
                >
                  <FaPlus className="mb-2" size={24} />
                  Add Manually
                </Button>

                <Button
                  variant="outline-success"
                  className="px-4 py-2 d-flex flex-column align-items-center"
                  onClick={handleUseAI}
                >
                  <FaRobot className="mb-2" size={24} />
                  Use AI
                </Button>
              </div>
            </div>
          )}

          {/* Question Form (when adding/editing) */}
          {showQuizForm && (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>
                  {editingQuestion ? (
                    <>
                      <FaEdit className="me-2 text-warning" />
                      Edit Question
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2 text-primary" />
                      Add New Question
                    </>
                  )}
                </h5>
                <Button variant="outline-secondary" onClick={handleCancelForm}>
                  Cancel
                </Button>
              </div>
              
              {/* Use QuestionForm component */}
              <QuestionForm
                quizData={quiz}
                questionToEdit={editingQuestion}
                onSave={handleSaveQuestion}
                onCancel={handleCancelForm}
                initialQuestionType={questionType}
              />
            </div>
          )}

          {/* Questions List (Shows when there are questions) */}
          {questions.length > 0 && !showQuizForm && (
            <div className="questions-list">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FaCheck className="me-2 text-success" />
                  Existing Questions ({questions.length})
                </h5>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={() => setShowQuestionTypeSelection(true)}
                  >
                    <FaPlus className="me-2" />
                    Add More
                  </Button>
                </div>
              </div>
              
              {questions.map((question, index) => (
                <Card key={question.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <Badge bg="secondary" className="me-2">
                            Q{index + 1}
                          </Badge>
                          <Badge bg={
                            question.type === 'single' ? 'primary' :
                            question.type === 'multiple' ? 'success' :
                            question.type === 'manual' ? 'warning' : 'info'
                          } className="me-2 text-capitalize">
                            {question.type}
                          </Badge>
                          <Badge bg="success" className="me-2">
                            +{question.positiveMarks || 0}
                          </Badge>
                          {question.negativeMarks > 0 && (
                            <Badge bg="danger">
                              -{question.negativeMarks}
                            </Badge>
                          )}
                          {question.mandatory && (
                            <Badge bg="warning" text="dark">Mandatory</Badge>
                          )}
                        </div>
                        <h6 className="mb-2">{question.question}</h6>
                        
                        {/* Show options for multiple choice questions */}
                        {(question.type === 'single' || question.type === 'multiple') && 
                         question.options && question.options.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">Options:</small>
                            <div className="mt-1">
                              {question.options.map((opt, optIdx) => (
                                <div key={optIdx} className="form-check">
                                  <input
                                    type={question.type === 'single' ? 'radio' : 'checkbox'}
                                    className="form-check-input"
                                    checked={question.correctAnswers?.includes(opt.id)}
                                    readOnly
                                    disabled
                                  />
                                  <label className="form-check-label small">
                                    {opt.text}
                                    {question.correctAnswers?.includes(opt.id) && (
                                      <Badge bg="success" className="ms-2">
                                        Correct
                                      </Badge>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Show manual answer preview */}
                        {question.type === 'manual' && question.manualAnswer && (
                          <div className="mt-2">
                            <small className="text-muted">Expected Answer:</small>
                            <p className="small mb-0 bg-light p-2 rounded">
                              {question.manualAnswer}
                            </p>
                          </div>
                        )}
                        
                        {/* Show coding question preview */}
                        {question.type === 'coding' && question.coding && (
                          <div className="mt-2">
                            <small className="text-muted">Coding Problem:</small>
                            <pre className="small bg-light p-2 rounded mt-1">
                              {question.coding.description?.substring(0, 150)}...
                            </pre>
                            {question.coding.language && (
                              <Badge bg="info" className="mt-1">
                                {question.coding.language}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="d-flex flex-column gap-2 ms-3">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                          title="Edit Question"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          title="Delete Question"
                        >
                          <FaTrash />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            // Preview functionality
                            showAlert("Preview functionality - Coming soon!", "info");
                          }}
                          title="Preview Question"
                        >
                          <FaEye />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {questions.length === 0 && !showQuizForm && !showQuestionTypeSelection && (
            <div className="text-center py-5">
              <FaQuestionCircle className="text-muted mb-3" size={48} />
              <h5 className="text-muted">No questions added yet</h5>
              <p className="text-muted mb-4">Start by adding your first question</p>
              <Button 
                variant="primary" 
                onClick={() => setShowQuestionTypeSelection(true)}
              >
                <FaPlus className="me-2" />
                Add First Question
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Card */}
      {questions.length > 0 && (
        <Card className="border-success">
          <Card.Body>
            <div className="row text-center">
              <div className="col">
                <div className="display-6">{questions.length}</div>
                <div className="text-muted">Total Questions</div>
              </div>
              <div className="col">
                <div className="display-6">{calculateTotalMarks()}</div>
                <div className="text-muted">Current Marks</div>
              </div>
              <div className="col">
                <div className="display-6">{quiz.totalMarks}</div>
                <div className="text-muted">Quiz Total</div>
              </div>
              <div className="col">
                <div className="display-6">
                  {questions.filter(q => q.mandatory).length}
                </div>
                <div className="text-muted">Mandatory</div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate("/admin-dashboard/quizzes")}
                className="me-2"
              >
                Back to Quiz List
              </Button>
              <Button 
                variant="outline-info"
                onClick={() => showAlert("Quiz preview - Coming soon!", "info")}
              >
                Preview Quiz
              </Button>
            </div>
            <div>
              <Button variant="success" className="me-2">
                Save Quiz
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowQuestionTypeSelection(true)}
              >
                <FaPlus className="me-2" />
                Add More Questions
              </Button>
            </div>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default QuestionManagement;