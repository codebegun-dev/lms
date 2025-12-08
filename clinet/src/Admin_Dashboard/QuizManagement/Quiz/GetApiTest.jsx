// GetApiTest.jsx - Enhanced with real quiz UI
import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Alert, Spinner, Accordion, Form } from "react-bootstrap";
import axios from "axios";

export default function GetApiTest() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get('http://localhost:8080/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError("Failed to load quizzes. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  // Handle quiz selection
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    // Initialize empty answers for this quiz
    const initialAnswers = {};
    quiz.questions?.forEach((q, index) => {
      if (q.type === 'single' || q.type === 'multiple') {
        initialAnswers[index] = [];
      } else if (q.type === 'manual') {
        initialAnswers[index] = '';
      }
    });
    setUserAnswers(initialAnswers);
  };

  // Handle answer selection
  const handleAnswerChange = (questionIndex, optionId, type) => {
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      
      if (type === 'single') {
        newAnswers[questionIndex] = [optionId];
      } else if (type === 'multiple') {
        const currentAnswers = newAnswers[questionIndex] || [];
        if (currentAnswers.includes(optionId)) {
          newAnswers[questionIndex] = currentAnswers.filter(id => id !== optionId);
        } else {
          newAnswers[questionIndex] = [...currentAnswers, optionId];
        }
      } else if (type === 'manual') {
        newAnswers[questionIndex] = optionId; // optionId here is the text value
      }
      
      return newAnswers;
    });
  };

  // Calculate score
  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    
    let totalScore = 0;
    
    selectedQuiz.questions?.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswers = question.correctAnswers || [];
      
      if (question.type === 'single' || question.type === 'multiple') {
        // Check if all correct answers are selected and no incorrect ones
        const isCorrect = correctAnswers.length > 0 && 
                         correctAnswers.every(ans => userAnswer?.includes(ans)) &&
                         (!userAnswer || userAnswer.length === correctAnswers.length);
        
        if (isCorrect) {
          totalScore += question.positiveMarks || 0;
        } else if (userAnswer && userAnswer.length > 0) {
          totalScore -= question.negativeMarks || 0;
        }
      }
      // For manual questions, we can't auto-check
    });
    
    return totalScore;
  };

  // Reset quiz
  const resetQuiz = () => {
    setSelectedQuiz(null);
    setUserAnswers({});
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-3">Loading quizzes from API...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Error Loading Data</Alert.Heading>
        <p>{error}</p>
        <div className="small">
          <strong>API Endpoint:</strong> http://localhost:8080/api/quizzes
        </div>
        <hr />
        <Button variant="outline-danger" onClick={fetchQuizzes}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Alert variant="info" className="m-4">
        <Alert.Heading>No Quizzes Found</Alert.Heading>
        <p>The API returned an empty array.</p>
        <Button variant="outline-info" onClick={fetchQuizzes}>
          Refresh
        </Button>
      </Alert>
    );
  }

  return (
    <div className="p-3">
      {!selectedQuiz ? (
        // Quiz Selection View
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Available Quizzes</h2>
            <Button variant="primary" onClick={fetchQuizzes}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </Button>
          </div>

          {/* Summary Card */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <div className="d-flex justify-content-around text-center">
                <div>
                  <div className="display-6">{quizzes.length}</div>
                  <div className="text-muted">Total Quizzes</div>
                </div>
                <div>
                  <div className="display-6">
                    {quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0)}
                  </div>
                  <div className="text-muted">Total Questions</div>
                </div>
                <div>
                  <div className="display-6">
                    {quizzes.reduce((sum, quiz) => sum + (quiz.marks || 0), 0)}
                  </div>
                  <div className="text-muted">Total Marks</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Quizzes List */}
          <div className="row">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{quiz.title}</h5>
                      <Badge bg={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </Card.Header>
                  
                  <Card.Body>
                    <div className="mb-3">
                      <Badge bg="info" className="me-2">
                        {quiz.questionType}
                      </Badge>
                      <Badge bg={quiz.negativeMarking ? "danger" : "success"}>
                        {quiz.negativeMarking ? "Negative" : "No Negative"}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Questions:</span>
                        <strong>{quiz.questions?.length || 0}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Marks:</span>
                        <Badge bg="success">{quiz.marks}</Badge>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Duration:</span>
                        <span>{quiz.duration}</span>
                      </div>
                    </div>

                    {/* FIXED: Show complete questions preview without truncation */}
                    <div className="mb-3">
                      <div className="text-muted small mb-2">Questions Preview:</div>
                      <div className="border rounded p-2 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {quiz.questions?.slice(0, 3).map((q, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="d-flex align-items-start">
                              <Badge bg="secondary" className="me-2 mt-1">
                                Q{idx + 1}
                              </Badge>
                              <div className="small">
                                <div className="fw-medium mb-1">{q.question}</div>
                                {/* Show options if they exist */}
                                {(q.type === 'single' || q.type === 'multiple') && q.options && q.options.length > 0 && (
                                  <div className="ps-3 mt-1">
                                    {q.options.slice(0, 2).map((opt, optIdx) => (
                                      <div key={optIdx} className="text-muted">
                                        • {opt.text}
                                      </div>
                                    ))}
                                    {q.options.length > 2 && (
                                      <div className="text-muted small">
                                        + {q.options.length - 2} more options
                                      </div>
                                    )}
                                  </div>
                                )}
                                <Badge bg="light" text="dark" className="mt-1">
                                  {q.type}
                                </Badge>
                              </div>
                            </div>
                            {idx < Math.min(quiz.questions.length - 1, 2) && <hr className="my-2" />}
                          </div>
                        ))}
                        {quiz.questions?.length > 3 && (
                          <div className="small text-muted text-center mt-2">
                            + {quiz.questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="small text-muted">
                      <div>Created: {formatDate(quiz.createdAt)}</div>
                      <div>Updated: {formatDate(quiz.updatedAt)}</div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-white">
                    <Button 
                      variant="primary" 
                      onClick={() => handleQuizSelect(quiz)}
                      className="w-100"
                    >
                      Start Quiz
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Quiz Taking View
        <div className="quiz-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Button variant="outline-secondary" onClick={resetQuiz} className="me-2">
                <i className="bi bi-arrow-left me-1"></i> Back to Quizzes
              </Button>
              <h2 className="d-inline-block mb-0">{selectedQuiz.title}</h2>
            </div>
            <div className="text-end">
              <Badge bg="success" className="me-2">
                Score: {calculateScore()} / {selectedQuiz.marks}
              </Badge>
              <Badge bg="info">{selectedQuiz.duration}</Badge>
            </div>
          </div>

          <Card className="mb-4">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Quiz Questions</h5>
                <div>
                  <Badge bg={getDifficultyColor(selectedQuiz.difficulty)} className="me-2">
                    {selectedQuiz.difficulty}
                  </Badge>
                  <Badge bg="secondary">
                    {selectedQuiz.questions?.length} Questions
                  </Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {selectedQuiz.description && (
                <Alert variant="info" className="mb-4">
                  {selectedQuiz.description}
                </Alert>
              )}

              {/* FIXED: Show questions without accordion for better visibility */}
              {selectedQuiz.questions?.map((question, index) => (
                <Card key={index} className="mb-4 border">
                  <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Badge bg="secondary" className="me-2">
                          Q{index + 1}
                        </Badge>
                        <Badge bg={question.type === 'single' ? 'primary' : 
                                 question.type === 'multiple' ? 'success' : 
                                 question.type === 'manual' ? 'warning' : 'danger'}>
                          {question.type}
                        </Badge>
                        {question.mandatory && (
                          <Badge bg="warning" text="dark" className="ms-2">Mandatory</Badge>
                        )}
                      </div>
                      <div className="text-end">
                        <Badge bg="success" className="me-2">
                          +{question.positiveMarks || 0}
                        </Badge>
                        {question.negativeMarks > 0 && (
                          <Badge bg="danger">
                            -{question.negativeMarks}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card.Header>
                  
                  <Card.Body>
                    {/* Question Text - COMPLETE without truncation */}
                    <h5 className="mb-3">{question.question}</h5>
                    
                    <div className="text-muted mb-4">
                      {question.type === 'single' && "Select one correct answer"}
                      {question.type === 'multiple' && "Select all correct answers"}
                      {question.type === 'manual' && "Type your answer"}
                      {question.type === 'coding' && "Write code to solve the problem"}
                    </div>

                    {/* Options for Single/Multiple Choice - COMPLETE options */}
                    {(question.type === 'single' || question.type === 'multiple') && question.options && (
                      <div className="options-container mb-4">
                        <h6 className="mb-3">Options:</h6>
                        <Form>
                          {question.options.map((option, optIndex) => (
                            <div key={option.id} className="mb-3">
                              <Form.Check
                                type={question.type === 'single' ? 'radio' : 'checkbox'}
                                id={`q${index}-opt${optIndex}`}
                                name={`question-${index}`}
                                label={
                                  <div>
                                    <strong>{String.fromCharCode(65 + optIndex)}. </strong>
                                    {option.text}
                                    {/* Show if this is a correct answer (for demo purposes) */}
                                    {question.correctAnswers?.includes(option.id) && (
                                      <Badge bg="success" className="ms-2">
                                        Correct Answer
                                      </Badge>
                                    )}
                                  </div>
                                }
                                checked={userAnswers[index]?.includes(option.id)}
                                onChange={() => handleAnswerChange(index, option.id, question.type)}
                                className={`p-3 border rounded ${userAnswers[index]?.includes(option.id) ? 'border-primary bg-light' : ''}`}
                              />
                            </div>
                          ))}
                        </Form>
                      </div>
                    )}

                    {/* Manual Answer Input */}
                    {question.type === 'manual' && (
                      <div className="manual-answer-container mb-4">
                        <h6 className="mb-3">Your Answer:</h6>
                        <Form>
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={userAnswers[index] || ''}
                              onChange={(e) => handleAnswerChange(index, e.target.value, 'manual')}
                              placeholder="Type your answer here..."
                            />
                          </Form.Group>
                          {/* Show expected answer for demo */}
                          {question.manualAnswer && (
                            <Alert variant="info" className="mt-3">
                              <strong>Expected Answer:</strong> {question.manualAnswer}
                            </Alert>
                          )}
                        </Form>
                      </div>
                    )}

                    {/* Coding Question */}
                    {question.type === 'coding' && question.coding && (
                      <div className="coding-container mb-4">
                        <div className="mb-3">
                          <h6>Problem Description:</h6>
                          <div className="bg-light p-3 rounded">
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                              {question.coding.description}
                            </pre>
                          </div>
                        </div>

                        {question.coding.sampleInput && (
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <h6>Sample Input:</h6>
                              <pre className="bg-dark text-white p-2 rounded">
                                {question.coding.sampleInput}
                              </pre>
                            </div>
                            <div className="col-md-6">
                              <h6>Sample Output:</h6>
                              <pre className="bg-dark text-white p-2 rounded">
                                {question.coding.sampleOutput}
                              </pre>
                            </div>
                          </div>
                        )}

                        <Form.Group>
                          <Form.Label>Write your code ({question.coding.language || 'JavaScript'}):</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={8}
                            value={userAnswers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value, 'manual')}
                            placeholder={`// Write your ${question.coding.language || 'JavaScript'} code here...`}
                            className="font-monospace"
                          />
                        </Form.Group>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}

              {/* Quiz Summary */}
              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">Quiz Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row text-center">
                    <div className="col">
                      <div className="display-6">{selectedQuiz.questions?.length || 0}</div>
                      <div className="text-muted">Total Questions</div>
                    </div>
                    <div className="col">
                      <div className="display-6">{calculateScore()}</div>
                      <div className="text-muted">Current Score</div>
                    </div>
                    <div className="col">
                      <div className="display-6">{selectedQuiz.marks}</div>
                      <div className="text-muted">Total Marks</div>
                    </div>
                    <div className="col">
                      <div className="display-6">
                        {Object.keys(userAnswers).filter(key => 
                          Array.isArray(userAnswers[key]) ? userAnswers[key].length > 0 : 
                          typeof userAnswers[key] === 'string' ? userAnswers[key].trim().length > 0 : 
                          false
                        ).length}
                      </div>
                      <div className="text-muted">Answered</div>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button variant="outline-secondary" onClick={resetQuiz}>
                    Exit Quiz
                  </Button>
                  <div>
                    <Button variant="success" className="me-2">
                      Submit Quiz
                    </Button>
                    <Button variant="outline-primary">
                      Save Progress
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}