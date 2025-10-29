#!/usr/bin/env python3
import requests
import sys
import os
import time

def transcribe_with_assemblyai(audio_path):
    """
    Transcribe audio using AssemblyAI free tier (more accurate than Sphinx)
    """
    try:
        print(f"Transcribing with AssemblyAI: {audio_path}")
        
        # You can get a free API key from https://www.assemblyai.com/
        # They give you 3 hours free transcription per month
        API_KEY = "your_assemblyai_api_key_here"  # Replace with your actual key
        
        if API_KEY == "your_assemblyai_api_key_here":
            return "Please get a free API key from https://www.assemblyai.com/ and update the script"
        
        # Step 1: Upload audio file
        print("Uploading audio file...")
        with open(audio_path, 'rb') as f:
            upload_response = requests.post(
                'https://api.assemblyai.com/v2/upload',
                headers={'authorization': API_KEY},
                files={'file': f}
            )
        
        if upload_response.status_code != 200:
            return f"Upload failed: {upload_response.text}"
        
        upload_url = upload_response.json()['upload_url']
        print(f"File uploaded successfully: {upload_url}")
        
        # Step 2: Start transcription
        print("Starting transcription...")
        transcript_response = requests.post(
            'https://api.assemblyai.com/v2/transcript',
            headers={
                'authorization': API_KEY,
                'content-type': 'application/json'
            },
            json={
                'audio_url': upload_url,
                'language_detection': True
            }
        )
        
        if transcript_response.status_code != 200:
            return f"Transcription request failed: {transcript_response.text}"
        
        transcript_id = transcript_response.json()['id']
        print(f"Transcription ID: {transcript_id}")
        
        # Step 3: Poll for results
        print("Waiting for transcription to complete...")
        while True:
            polling_response = requests.get(
                f'https://api.assemblyai.com/v2/transcript/{transcript_id}',
                headers={'authorization': API_KEY}
            )
            polling_result = polling_response.json()
            
            status = polling_result['status']
            if status == 'completed':
                text = polling_result['text']
                print("Transcription completed successfully!")
                return text
            elif status == 'error':
                return f"Transcription error: {polling_result['error']}"
            else:
                print(f"Status: {status}, waiting...")
                time.sleep(3)
                
    except Exception as e:
        return f"AssemblyAI error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe_assemblyai.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File not found - {audio_file}")
        sys.exit(1)
    
    result = transcribe_with_assemblyai(audio_file)
    print(result)