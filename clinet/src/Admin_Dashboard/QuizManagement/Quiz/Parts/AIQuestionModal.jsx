// AiQuestionModal.jsx - Updated version with image-like design
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function AiQuestionModal({ show, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("single");

  const questionTypes = [
    { value: "single", label: "Single Choice" },
    { value: "multiple", label: "Multiple Choice" },
    { value: "manual", label: "Manual Answer" },
    { value: "coding", label: "Coding Question" }
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    try {
      // Parse the prompt to extract number of questions
      let count = 1; // Default to 1 if not specified
      const countMatch = prompt.match(/\b(\d+)\s+(?:questions?|q|mcqs?)\b/i);
      if (countMatch) {
        count = parseInt(countMatch[1]);
        count = Math.min(Math.max(1, count), 10); // Limit to 1-10
      }

      // Call the parent's handleAIQuestions function with selected type
      await onGenerate(prompt, count, selectedType);
      onClose();
      setPrompt("");
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
 
     
  

  const getTypeFromPrompt = (promptText) => {
    const lowerPrompt = promptText.toLowerCase();
    if (lowerPrompt.includes("multiple choice")) return "multiple";
    if (lowerPrompt.includes("single choice")) return "single";
    if (lowerPrompt.includes("coding")) return "coding";
    if (lowerPrompt.includes("manual")) return "manual";
    return "single"; // default
  };

  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    // Auto-detect type when user types
    if (newPrompt.trim().length > 20) {
      const detectedType = getTypeFromPrompt(newPrompt);
      if (detectedType && detectedType !== selectedType) {
        setSelectedType(detectedType);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-bottom pb-3">
        <Modal.Title className="fw-bold fs-4">
          <i className="bi bi-robot me-2 text-primary"></i>
          Generate Questions Using AI
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* Main Prompt Input - Like the image */}
        <div className="mb-4">
          <Form.Group>
            <Form.Label className="mb-2 fw-semibold">What would you like to generate?</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ask anything... e.g., Generate 5 multiple choice questions about JavaScript ES6 features"
              value={prompt}
              onChange={handlePromptChange}
              disabled={loading}
              className="border-2 rounded-3 p-3 fs-6"
              style={{ 
                borderColor: '#e0e0e0',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
            <Form.Text className="text-muted mt-2 d-block">
              Be specific for better results. Include topic, number of questions, and question type.
            </Form.Text>
          </Form.Group>
        </div>         

          
      </Modal.Body>

      <Modal.Footer className="border-top pt-3">
        <Button 
          variant="light" 
          onClick={onClose} 
          disabled={loading}
          className="rounded-pill px-4"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="rounded-pill px-4"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '8px 24px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-magic me-2"></i>
              Generate  
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}