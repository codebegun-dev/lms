#!/usr/bin/env python3
import speech_recognition as sr
import sys
import os
from pydub import AudioSegment
import tempfile

def convert_audio_to_wav(input_path, output_path):
    """
    Convert any audio format to WAV using pydub
    """
    try:
        print(f"Converting {input_path} to WAV...")
        
        # Load audio file
        audio = AudioSegment.from_file(input_path)
        
        # Convert to required format for speech recognition
        audio = audio.set_channels(1)  # mono
        audio = audio.set_frame_rate(16000)  # 16kHz
        audio = audio.set_sample_width(2)  # 16-bit
        
        # Export as WAV
        audio.export(output_path, format="wav")
        print(f"Conversion successful: {output_path}")
        return True
        
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return False

def transcribe_audio(audio_path):
    """
    Transcribe audio with multiple fallback methods
    """
    try:
        print(f"Processing: {audio_path}")
        
        recognizer = sr.Recognizer()
        temp_wav_path = None
        
        # Always convert to WAV first for better compatibility
        if not audio_path.lower().endswith('.wav'):
            temp_wav_path = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
            if not convert_audio_to_wav(audio_path, temp_wav_path):
                return "Error: Audio conversion failed"
            audio_path = temp_wav_path
        
        # Read the audio file
        with sr.AudioFile(audio_path) as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=1.0)
            
            print("Reading audio data...")
            audio_data = recognizer.record(source)
            
            print("Transcribing...")
            
            # Try Google Speech Recognition (requires internet but more accurate)
            try:
                print("Trying Google Speech Recognition...")
                text = recognizer.recognize_google(audio_data)
                print("Google recognition successful!")
                return text
            except sr.UnknownValueError:
                print("Google could not understand audio")
            except sr.RequestError as e:
                print(f"Google service error: {e}")
            
            # Fallback to Sphinx (offline)
            try:
                print("Trying PocketSphinx (offline)...")
                text = recognizer.recognize_sphinx(audio_data)
                if text and len(text.strip()) > 0:
                    print("Sphinx recognition successful!")
                    return text
                else:
                    print("Sphinx returned empty result")
            except Exception as e:
                print(f"Sphinx error: {e}")
            
            return "Could not transcribe audio - no speech detected or audio quality is poor"
            
    except Exception as e:
        return f"Transcription error: {str(e)}"
    finally:
        # Clean up temporary file
        if temp_wav_path and os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe_improved.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File not found - {audio_file}")
        sys.exit(1)
    
    result = transcribe_audio(audio_file)
    print("=== TRANSCRIPTION RESULT ===")
    print(result)