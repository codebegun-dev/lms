#!/usr/bin/env python3
import speech_recognition as sr
import sys
import os
from pydub import AudioSegment
import tempfile

def convert_to_wav(input_path, output_path):
    """
    Convert any audio file to WAV format (16kHz, mono, 16-bit)
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
    Transcribe audio using PocketSphinx (completely free & offline)
    """
    try:
        print(f"Starting transcription for: {audio_path}")
        
        recognizer = sr.Recognizer()
        
        # Check if file needs conversion
        original_path = audio_path
        temp_wav_path = None
        
        if not audio_path.lower().endswith('.wav'):
            # Create temporary WAV file
            temp_wav_path = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
            if convert_to_wav(audio_path, temp_wav_path):
                audio_path = temp_wav_path
            else:
                return "Error: Audio conversion failed"
        
        # Load and transcribe audio
        with sr.AudioFile(audio_path) as source:
            print("Adjusting for ambient noise...")
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("Recording audio data...")
            # Listen for the data (load entire audio file)
            audio_data = recognizer.record(source)
            
            print("Transcribing with PocketSphinx...")
            # Recognize using Sphinx (offline)
            text = recognizer.recognize_sphinx(audio_data)
            
            print(f"Transcription successful: {text}")
            
        # Clean up temporary file if created
        if temp_wav_path and os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)
            
        return text
            
    except sr.UnknownValueError:
        error_msg = "Speech could not be understood"
        print(error_msg)
        return error_msg
        
    except sr.RequestError as e:
        error_msg = f"Sphinx error: {str(e)}"
        print(error_msg)
        return error_msg
        
    except Exception as e:
        error_msg = f"Transcription error: {str(e)}"
        print(error_msg)
        return error_msg

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: Usage: python transcribe_offline.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File not found - {audio_file}")
        sys.exit(1)
    
    result = transcribe_audio(audio_file)
    print(result)