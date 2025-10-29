#!/usr/bin/env python3
'''import speech_recognition as sr
import sys
import os

def transcribe_audio(audio_path):
    """
    Simple transcription using only speech_recognition
    """
    try:
        print(f"Attempting to transcribe: {audio_path}")
        
        recognizer = sr.Recognizer()
        
        # Try to read the file directly
        with sr.AudioFile(audio_path) as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("Reading audio data...")
            audio_data = recognizer.record(source)
            
            print("Transcribing with PocketSphinx...")
            text = recognizer.recognize_sphinx(audio_data)
            
            print(f"Transcription successful!")
            return text
            
    except sr.UnknownValueError:
        return "Speech could not be understood"
    except Exception as e:
        return f"Transcription error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: Please provide an audio file path")
        print("Usage: python transcribe_simple.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File not found - {audio_file}")
        sys.exit(1)
    
    result = transcribe_audio(audio_file)
    print(result)'''
    #!/usr/bin/env python3
import speech_recognition as sr
import sys
import os
from pydub import AudioSegment
import tempfile

def convert_to_wav(input_path, output_path):
    """
    Convert MP3 to WAV format using pydub
    """
    try:
        print(f"Converting {input_path} to WAV format...")
        
        # Load audio file
        audio = AudioSegment.from_file(input_path)
        
        # Convert to required format: mono, 16kHz, 16-bit
        audio = audio.set_channels(1)  # mono
        audio = audio.set_frame_rate(16000)  # 16kHz
        audio = audio.set_sample_width(2)  # 16-bit
        
        # Export as WAV
        audio.export(output_path, format="wav")
        print(f"Successfully converted to {output_path}")
        return True
        
    except Exception as e:
        print(f"Audio conversion error: {str(e)}")
        return False

def transcribe_audio(audio_path):
    """
    Transcribe audio using PocketSphinx
    """
    try:
        print(f"Attempting to transcribe: {audio_path}")
        
        recognizer = sr.Recognizer()
        temp_wav_path = None
        
        # Check if file needs conversion
        if not audio_path.lower().endswith('.wav'):
            # Create temporary WAV file
            temp_wav_path = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
            print(f"Converting to WAV: {temp_wav_path}")
            
            if convert_to_wav(audio_path, temp_wav_path):
                audio_path = temp_wav_path
            else:
                return "Error: Audio conversion failed"
        
        # Load and transcribe audio
        with sr.AudioFile(audio_path) as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("Reading audio data...")
            audio_data = recognizer.record(source)
            
            print("Transcribing with PocketSphinx...")
            text = recognizer.recognize_sphinx(audio_data)
            
            print("Transcription successful!")
            
        # Clean up temporary file
        if temp_wav_path and os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)
            
        return text if text else "No speech detected"
            
    except sr.UnknownValueError:
        error_msg = "Speech could not be understood"
        print(error_msg)
        return error_msg
        
    except Exception as e:
        error_msg = f"Transcription error: {str(e)}"
        print(error_msg)
        return error_msg

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: Please provide an audio file path")
        print("Usage: python transcribe_simple.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File not found - {audio_file}")
        sys.exit(1)
    
    result = transcribe_audio(audio_file)
    print(result)