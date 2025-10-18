
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
  const videoRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const audioChunksRef = useRef([]);
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
      // Video stream
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
        audio: false,
      });
      mediaStreamRef.current = videoStream;
      videoRef.current.srcObject = videoStream;

      // Audio stream
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      startSpeechToText();
      startTimer();

      // Video Recorder
      videoChunksRef.current = [];
      videoRecorderRef.current = new MediaRecorder(videoStream, { mimeType: "video/webm" });
      videoRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };
      videoRecorderRef.current.start();

      // Audio Recorder
      audioChunksRef.current = [];
      audioRecorderRef.current = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
      audioRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      audioRecorderRef.current.start();

    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);

    videoRecorderRef.current?.stop();
    audioRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    clearInterval(timerRef.current);

    // Delay to ensure recording finished before downloading
    setTimeout(downloadFiles, 1000);
  };

  const downloadFiles = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const userId = "101"; // Replace with dynamic userId if needed
    const userName = "Vineela"; // Replace with dynamic userName if needed

    // Download Video
    const videoBlob = new Blob(videoChunksRef.current, { type: "video/webm" });
    const videoUrl = URL.createObjectURL(videoBlob);
    const aVideo = document.createElement("a");
    aVideo.href = videoUrl;
    aVideo.download = `${userId}_${timestamp}_${userName}_video.webm`;
    aVideo.click();

    // Download Audio
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const aAudio = document.createElement("a");
    aAudio.href = audioUrl;
    aAudio.download = `${userId}_${timestamp}_${userName}_audio.webm`;
    aAudio.click();

    // Download Transcript
    const transcriptBlob = new Blob([transcript], { type: "text/plain" });
    const transcriptUrl = URL.createObjectURL(transcriptBlob);
    const aText = document.createElement("a");
    aText.href = transcriptUrl;
    aText.download = `${userId}_${timestamp}_${userName}_transcript.txt`;
    aText.click();
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
      {/* Navbar */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-25 flex-shrink-0">
        <h5 className="text-white mb-0">{interviewType}</h5>
        <span className="text-white fw-bold">
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>

      {/* Main Section */}
      <div className="row flex-grow-1 p-3 m-0 g-3">
        {/* Camera */}
        <div className="col-md-6 d-flex justify-content-center align-items-center position-relative bg-dark bg-opacity-25 rounded-3 p-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-100 h-auto rounded-3"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          ></video>
        </div>

        {/* Speech-to-Text */}
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

      {/* Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div className="d-flex justify-content-center flex-grow-1">
          {!isRecording ? (
            <button className="btn btn-success px-4" onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button className="btn btn-danger px-4" onClick={stopRecording}>
              Stop & Download
            </button>
          )}
        </div>

        <div className="me-3">
          <button className="btn btn-primary px-5" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
