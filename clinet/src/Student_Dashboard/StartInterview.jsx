import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const StartInterview = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [mainTimer, setMainTimer] = useState(600);
  const [questionTimer, setQuestionTimer] = useState(120);
  const [question, setQuestion] = useState(
    "Please select a category and start the interview."
  );
  const [answer, setAnswer] = useState(""); // ✅ for displaying transcribed answer
  const [interviewId, setInterviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const studentId = 1;

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const mainTimerRef = useRef(null);
  const questionTimerRef = useRef(null);

  // ---------- Fetch Categories ----------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ---------- Camera Controls ----------
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopAllTimers();
      stopSpeechRecognition();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraOn ? { width: 480, height: 360 } : false,
        audio: micOn,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera/Mic access denied:", err);
    }
  };

  const stopCamera = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const toggleCamera = async () => {
    setCameraOn((prev) => !prev);
    stopCamera();
    await startCamera();
  };

  const toggleMic = async () => {
    const newMicState = !micOn;
    setMicOn(newMicState);
    stopCamera();
    await startCamera();

    // ✅ Start or stop voice transcription based on mic state
    if (newMicState) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  };

  // ---------- Voice Recognition ----------
  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setAnswer(transcript.trim());
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
    };

    recognition.onend = () => {
      if (micOn) recognition.start(); // Restart if mic is still on
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  // ---------- Timer Helpers ----------
  const startMainTimer = () => {
    clearInterval(mainTimerRef.current);
    mainTimerRef.current = setInterval(() => {
      setMainTimer((prev) => {
        if (prev <= 1) {
          stopInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startQuestionTimer = () => {
    clearInterval(questionTimerRef.current);
    setQuestionTimer(120);
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion(); // Auto next
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseMainTimer = () => clearInterval(mainTimerRef.current);
  const resumeMainTimer = () => startMainTimer();
  const stopAllTimers = () => {
    clearInterval(mainTimerRef.current);
    clearInterval(questionTimerRef.current);
  };

  // ---------- API Calls ----------
  const handleStartInterview = async () => {
    if (!selectedCategoryId) {
      alert("Please select a category before starting!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/interviews/start",
        {
          studentId,
          categoryId: selectedCategoryId,
        }
      );

      setInterviewId(response.data.interviewId);
      setQuestion(response.data.questions?.[0]?.title || "No question found.");
      setIsInterviewStarted(true);
      setAnswer("");
      startMainTimer();
      startQuestionTimer();

      if (micOn) startSpeechRecognition();
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!interviewId) return alert("Interview not started yet.");

    try {
      pauseMainTimer();
      const res = await axios.get(
        `http://localhost:8080/api/interviews/${interviewId}/next-question`
      );

      if (res.data && res.data.title) {
        setQuestion(res.data.title);
        setAnswer("");
        startQuestionTimer();
        resumeMainTimer();
      } else {
        alert("No more questions available.");
        stopInterview();
      }
    } catch (err) {
      console.error("Error fetching next question:", err);
    }
  };

  const stopInterview = () => {
    stopAllTimers();
    stopSpeechRecognition();
    alert("Interview ended!");
    navigate("/dashboard");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ---------- UI ----------
  return (
    <div className="container-fluid vh-100 bg-dark text-white p-4 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h4 className="fw-bold text-info">
          {isInterviewStarted ? "Interview in Progress" : "Start Your Interview"}
        </h4>
        <h6 className="mb-0 text-warning d-flex align-items-center gap-2">
          <FiClock /> {formatTime(mainTimer)}
        </h6>
      </div>

      {/* Category Dropdown */}
      {!isInterviewStarted && (
        <div className="mb-3">
          <label className="form-label text-info">Select Category:</label>
          <select
            className="form-select w-50"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name?.charAt(0).toUpperCase() + cat.name?.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Camera + Question Section */}
      <div className="row flex-grow-1">
        {/* Video Section */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-100 rounded-3 shadow"
            style={{
              transform: "scaleX(-1)",
              height: "340px",
              objectFit: "cover",
            }}
          ></video>

          <div className="d-flex gap-3 mt-3">
            <button
              className={`btn ${cameraOn ? "btn-danger" : "btn-success"} px-4`}
              onClick={toggleCamera}
            >
              {cameraOn ? <FaVideoSlash /> : <FaVideo />}{" "}
              {cameraOn ? "Camera Off" : "Camera On"}
            </button>
            <button
              className={`btn ${micOn ? "btn-danger" : "btn-success"} px-4`}
              onClick={toggleMic}
            >
              {micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}{" "}
              {micOn ? "Mic Off" : "Mic On"}
            </button>
          </div>
        </div>

        {/* Question & Answer Section */}
        <div className="col-md-6">
          <div className="bg-secondary bg-opacity-25 p-4 rounded-4 shadow-lg h-100">
            <h6 className="mb-3 text-info d-flex justify-content-between">
              <span>Question</span>
              {isInterviewStarted && (
                <small className="text-warning">
                  Time Left: {formatTime(questionTimer)}
                </small>
              )}
            </h6>

            {/* Question Box */}
            <div
              className="border rounded-4 p-3 bg-dark bg-opacity-50 mb-3"
              style={{ minHeight: "100px" }}
            >
              {question}
            </div>

            {/* ✅ Answer Box (transcript) */}
            <h6 className="text-info mb-2">Your Answer (Transcription):</h6>
            <div
              className="border rounded-4 p-3 bg-dark bg-opacity-50 mb-4"
              style={{ minHeight: "100px", whiteSpace: "pre-wrap" }}
            >
              {answer || "Speak into the microphone..."}
            </div>

            {isInterviewStarted ? (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-warning fw-semibold"
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
                <button
                  className="btn btn-danger fw-semibold"
                  onClick={stopInterview}
                >
                  End Interview
                </button>
              </div>
            ) : (
              <button
                className="btn btn-success fw-semibold px-4"
                onClick={handleStartInterview}
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
