import sys
import whisper

model = whisper.load_model("base")

audio_file = sys.argv[1]
print("Processing:", audio_file)

result = model.transcribe(audio_file)
print(result["text"])
