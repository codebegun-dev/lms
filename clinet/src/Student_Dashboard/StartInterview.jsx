

// StartInterview.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

export default function StartInterview() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedInterviewId = location.state?.interviewId ?? null;
  const passedCategoryId = location.state?.categoryId ?? null;
  const passedCategoryName = location.state?.categoryName ?? "";

  const [interviewId, setInterviewId] = useState(passedInterviewId);
  const [categoryName, setCategoryName] = useState(passedCategoryName);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mainTimer, setMainTimer] = useState(600);
  const [questionTimer, setQuestionTimer] = useState(120);
  const [question, setQuestion] = useState("Click Start to load the first question.");
  const [transcript, setTranscript] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const audioRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const mainTimerRef = useRef(null);
  const questionTimerRef = useRef(null);

  const safeAttachStreamToVideo = (stream) => {
    mediaStreamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const safeClearVideoSrc = () => {
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micOn,
      });
      safeAttachStreamToVideo(stream);
      setCameraOn(true);
    } catch (err) {
      console.error("startCamera error:", err);
      alert("Please allow camera/microphone access.");
    }
  };

  const stopCamera = () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      safeClearVideoSrc();
      setCameraOn(false);
    } catch (err) {
      console.warn("stopCamera error:", err);
    }
  };

  const toggleCamera = async () => {
    if (cameraOn) stopCamera();
    else await startCamera();
  };

  const toggleMic = () => {
    setMicOn((prev) => {
      const next = !prev;
      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = next));
        }
      } catch (e) {}
      return next;
    });
  };

  const startSpeechRecognition = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let finalTranscript = "";

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcriptPiece + " ";
          else interim += transcriptPiece;
        }
        setTranscript(finalTranscript + interim);
      };

      recognition.onerror = (e) => console.error("Speech recognition error:", e);
      recognition.onend = () => {
        if (isRecording && micOn) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("startSpeechRecognition error:", err);
    }
  };

  const stopSpeechRecognition = () => {
    try {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    } catch (err) {}
  };

  const startTimers = () => {
    mainTimerRef.current = setInterval(() => {
      setMainTimer((prev) => {
        if (prev <= 1) {
          handleEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setQuestionTimer(120);
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimers = () => {
    clearInterval(mainTimerRef.current);
    clearInterval(questionTimerRef.current);
  };

  const startRecording = async () => {
    try {
      if (!mediaStreamRef.current) {
        await startCamera();
      }
      const stream = mediaStreamRef.current;
      if (!stream) throw new Error("No stream available");

      mediaChunksRef.current = [];
      audioChunksRef.current = [];

      const mediaRec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      mediaRec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) mediaChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = mediaRec;
      mediaRec.start();

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioRec = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
      audioRec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      audioRecorderRef.current = audioRec;
      audioRec.start();

      setIsRecording(true);
      startSpeechRecognition();
      startTimers();
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Cannot start recording — please allow camera/mic and try again.");
    }
  };

  const stopRecorderAndGetBlob = (recRef, chunksRef, mimeType) => {
    return new Promise((resolve) => {
      try {
        const rec = recRef.current;
        if (!rec) return resolve(null);
        if (rec.state === "inactive") {
          if (!chunksRef.current || !chunksRef.current.length) return resolve(null);
          return resolve(new Blob(chunksRef.current, { type: mimeType }));
        }
        rec.onstop = () => {
          const blob = chunksRef.current.length
            ? new Blob(chunksRef.current, { type: mimeType })
            : null;
          resolve(blob);
        };
        rec.stop();
      } catch (e) {
        console.warn("stopRecorderAndGetBlob err", e);
        resolve(null);
      }
    });
  };

  const stopRecordingInternal = async () => {
    try {
      stopTimers();
      stopSpeechRecognition();

      const videoBlob = await stopRecorderAndGetBlob(
        mediaRecorderRef,
        mediaChunksRef,
        "video/webm"
      );
      const audioBlob = await stopRecorderAndGetBlob(
        audioRecorderRef,
        audioChunksRef,
        "audio/webm"
      );

      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      } catch (e) {}

      safeClearVideoSrc();
      setIsRecording(false);
      return { videoBlob, audioBlob };
    } catch (err) {
      console.error("stopRecordingInternal", err);
      return { videoBlob: null, audioBlob: null };
    }
  };

  const uploadFiles = async (videoBlob, audioBlob) => {
    if (!videoBlob && !audioBlob) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("interviewId", interviewId);
      if (videoBlob) formData.append("videoFile", videoBlob, "interview_video.webm");
      if (audioBlob) formData.append("audioFile", audioBlob, "interview_audio.webm");

      const res = await axios.post("http://localhost:8080/api/interviews/end", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("upload response", res.data);
      return res.data;
    } catch (err) {
      console.error("uploadFiles error", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!interviewId) return alert("Interview not started yet.");
    try {
      setLoadingQuestion(true);
      const res = await axios.get(
        `http://localhost:8080/api/interviews/${interviewId}/next-question`
      );
      const newQ = res.data?.title || res.data?.question || res.data;
      if (newQ) {
        setQuestion(newQ);
        setQuestionTimer(120);
      } else {
        alert("No more questions");
      }
    } catch (err) {
      console.error("handleNextQuestion err", err);
      alert("Failed to load question.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleStart = async () => {
    try {
      setQuestion("Loading your first question...");

      let activeInterviewId = interviewId;

      if (!activeInterviewId) {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const requestDto = { studentId: user.userId || 1, categoryId: passedCategoryId };

        const res = await axios.post("http://localhost:8080/api/interviews/start", requestDto);
        activeInterviewId = res.data?.interview?.interviewId;
        setInterviewId(activeInterviewId);

        const firstQ =
          res.data?.firstQuestion?.title ||
          res.data?.firstQuestion ||
          "First question not provided";
        setQuestion(firstQ);
      } else {
        const res = await axios.get(
          `http://localhost:8080/api/interviews/${activeInterviewId}/next-question`
        );
        const firstQ = res.data?.title || res.data?.question || res.data;
        setQuestion(firstQ || "First question not available.");
      }

      await startRecording();
      setShowNextButton(true);
    } catch (err) {
      console.error("start interview api error", err);
      alert("Unable to start interview on server");
      setQuestion("Error loading first question.");
    }
  };

  const handleEnd = async () => {
    try {
      const { videoBlob, audioBlob } = await stopRecordingInternal();
      await uploadFiles(videoBlob, audioBlob);
      alert("Interview ended and uploaded");
      navigate("/student-dashboard");
    } catch (err) {
      console.error("handleEnd err", err);
      alert("Error ending interview");
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ✅ Camera auto starts here
  useEffect(() => {
    startCamera();

    if (passedCategoryName) setCategoryName(passedCategoryName);
    return () => {
      stopTimers();
      stopSpeechRecognition();
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")
          mediaRecorderRef.current.stop();
        if (audioRecorderRef.current && audioRecorderRef.current.state !== "inactive")
          audioRecorderRef.current.stop();
      } catch (e) {}
      try {
        if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
    };
  }, []);

  return (
    <div className="container-fluid vh-100 bg-light p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">{categoryName || "Interview"}</h4>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="text-muted small">Time Left</div>
            <div style={{ fontFamily: "monospace" }}>{formatTime(mainTimer)}</div>
          </div>
          <div>
            <button className="btn btn-danger" onClick={handleEnd} disabled={isUploading}>
              {isUploading ? "Uploading..." : "End"}
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Left: camera */}
        <div className="col-md-5">
          <div className="card p-3 h-100">
            <h6 className="fw-semibold">Camera</h6>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-100 rounded mb-2"
              style={{ height: 300, background: "#000" }}
            />
            <div className="d-flex gap-2">
              <button
                className={`btn ${cameraOn ? "btn-danger" : "btn-success"}`}
                onClick={toggleCamera}
              >
                {cameraOn ? <FaVideoSlash /> : <FaVideo />}{" "}
                {cameraOn ? "Camera Off" : "Camera On"}
              </button>

              <button
                className={`btn ${micOn ? "btn-danger" : "btn-success"}`}
                onClick={toggleMic}
              >
                {micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}{" "}
                {micOn ? "Mic Off" : "Mic On"}
              </button>
            </div>
            <div className="mt-3 text-muted small">
              Please allow camera & microphone access when prompted.
            </div>
          </div>
        </div>

        {/* Right: question + transcript */}
        <div className="col-md-7">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="mb-0">Question</h6>
              <div className="text-end">
                <small className="text-muted">Question time</small>
                <div className="fw-bold">{formatTime(questionTimer)}</div>
              </div>
            </div>

            <div className="border rounded p-3 mb-3" style={{ minHeight: 150 }}>
              {question}
            </div>
          </div>

          <div className="card p-3">
            <h6>Voice → Text (Transcription)</h6>
            <div
              className="border rounded p-3"
              style={{ minHeight: 120, whiteSpace: "pre-wrap" }}
            >
              {transcript || "Speak into the microphone..."}
            </div>
            <div className="my-2">
              <div className="d-flex gap-2">
                {showNextButton && (
                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    disabled={loadingQuestion}
                  >
                    Next Question
                  </button>
                )}

                {/* ✅ Removed STOP button, now only Start Interview */}
                {!isRecording && (
                  <button className="btn btn-success" onClick={handleStart}>
                    Start Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
