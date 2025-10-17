import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StartInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { interviewType } = location.state || { interviewType: "Interview" };

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startCamera();

    const handleVisibilityChange = () => {
      if (document.hidden) stopRecording();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopRecording();
      stopCamera();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const startSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text);
    };

    recognitionRef.current.start();
  };

  const startTimer = () => {
    setTimeLeft(600);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
        audio: true,
      });
      mediaStreamRef.current = stream;
      videoRef.current.srcObject = stream;

      startSpeechToText();
      startTimer();

      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    clearInterval(timerRef.current);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleBack = () => {
    stopRecording();
    stopCamera();
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-dark bg-opacity-50 overflow-hidden">
      {/* Navbar Section */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-25 flex-shrink-0">
        <h5 className="text-white mb-0">{interviewType}</h5>
        <span className="text-white fw-bold">
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>

      {/* Main Section */}
      <div className="row flex-grow-1 p-3 m-0 g-3">
        {/* Left: Camera */}
        <div className="col-md-6 d-flex justify-content-center align-items-center position-relative bg-dark bg-opacity-25 rounded-3 p-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-100 h-auto rounded-3"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          ></video>


        </div>

        {/* Right: Speech-to-Text */}
        <div className="col-md-6 d-flex flex-column bg-dark bg-opacity-25 rounded-3 p-3">
          <h6 className="text-white mb-2">Speech-to-Text</h6>
          <textarea
            className="form-control flex-grow-1 bg-transparent text-white border-light rounded-3 p-2 overflow-auto"
            value={transcript}
            readOnly
            rows="10"
          ></textarea>
        </div>
      </div>

      {/* Combined Button Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div className="d-flex justify-content-center flex-grow-1">
          {!isRecording ? (
            <button className="btn btn-success px-4" onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button className="btn btn-danger px-4" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
        </div>

        <div className="me-3 ">
          <button className="btn btn-primary px-5" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

    </div>
  );
};

export default StartInterview;
