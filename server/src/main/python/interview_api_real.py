# interview_api_real.py
from flask import Flask, request, jsonify
from threading import Thread
import time, os, glob
from voice_interview_system import VoiceInterviewSystem

app = Flask(__name__)
jobs = {}  # job_id -> filename or status

def run_interview_job(job_id, language):
    try:
        system = VoiceInterviewSystem()
        # ensure AI uses the API key env var
        system.interview_data["language"] = language
        system.run()   # runs full interactive flow (mic + tts + gemini)
        # after run(), the json will be saved by save_interview_data()
        # find latest file for this language and store in jobs
        files = sorted(glob.glob(f"interview_{language}_*.json"), reverse=True)
        if files:
            jobs[job_id] = {"status": "finished", "file": files[0]}
        else:
            jobs[job_id] = {"status": "finished", "file": None}
    except Exception as e:
        jobs[job_id] = {"status": "error", "error": str(e)}

@app.route("/start-interview", methods=["POST"])
def start_interview():
    """
    Start the interactive interview using real Gemini AI.
    Query params: mode=interactive (default), language=python|java|sql
    Call from Postman to trigger the interview on the machine running Flask.
    """
    language = request.args.get("language", request.json.get("language", "python") if request.get_json(silent=True) else "python")
    mode = request.args.get("mode", "interactive")
    if mode != "interactive":
        return jsonify({"error": "This endpoint only supports interactive mode for real AI."}), 400

    # create job id
    job_id = str(int(time.time() * 1000))
    jobs[job_id] = {"status": "running"}
    thread = Thread(target=run_interview_job, args=(job_id, language), daemon=True)
    thread.start()

    return jsonify({"message": "Interview started on server host. Use /job-status/{job_id} to poll.", "job_id": job_id}), 202

@app.route("/job-status/<job_id>", methods=["GET"])
def job_status(job_id):
    info = jobs.get(job_id)
    if not info:
        return jsonify({"error": "no such job"}), 404
    return jsonify(info)

@app.route("/report/<job_id>", methods=["GET"])
def report(job_id):
    info = jobs.get(job_id)
    if not info:
        return jsonify({"error": "no such job"}), 404
    if info.get("file"):
        with open(info["file"], 'r', encoding='utf-8') as f:
            return f.read(), 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"status": info.get("status"), "note": "No file found."}), 200

if __name__ == "__main__":
    # Verify GEMINI_API_KEY is set
    if not os.getenv("GEMINI_API_KEY"):
        print("WARNING: GEMINI_API_KEY is not set. Real AI will not work without it.")
    app.run(host="0.0.0.0", port=8000, debug=False)
