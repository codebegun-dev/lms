import speech_recognition as sr
import pyttsx3
import json
import random
import threading
from datetime import datetime
import time
import re
import requests
import os

class VoiceInterviewSystem:
    def __init__(self):
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        
        # Initialize text-to-speech
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 150)
        
        # Set up microphone with error handling
        try:
            self.microphone = sr.Microphone()
            print("Microphone initialized successfully")
        except Exception as e:
            print(f"Microphone warning: {e}")
            self.microphone = None
        
        # Initialize REAL AI (Google Gemini)
        self.ai_available = self._initialize_ai()
        
        # Track if we're in interview questions phase
        self.in_questions_phase = False
        
        # Question banks without keywords
        self.questions_db = {
            "python": [
                {
                    "question": "What are Python decorators and how do you use them?",
                    "retry_count": 0
                },
                {
                    "question": "Explain the difference between lists and tuples in Python.",
                    "retry_count": 0
                },
                {
                    "question": "What is the Global Interpreter Lock (GIL) in Python?",
                    "retry_count": 0
                },
                {
                    "question": "How does garbage collection work in Python?",
                    "retry_count": 0
                },
                {
                    "question": "What are Python generators and when would you use them?",
                    "retry_count": 0
                }
            ],
            "java": [
                {
                    "question": "What is the difference between abstract classes and interfaces in Java?",
                    "retry_count": 0
                },
                {
                    "question": "Explain Java's garbage collection mechanism.",
                    "retry_count": 0
                },
                {
                    "question": "What are the main principles of OOP in Java?",
                    "retry_count": 0
                },
                {
                    "question": "How does exception handling work in Java?",
                    "retry_count": 0
                },
                {
                    "question": "What is the difference between == and .equals() in Java?",
                    "retry_count": 0
                }
            ],
            "sql": [
                {
                    "question": "What is the difference between INNER JOIN and LEFT JOIN?",
                    "retry_count": 0
                },
                {
                    "question": "Explain database normalization with examples.",
                    "retry_count": 0
                },
                {
                    "question": "What are SQL indexes and when should you use them?",
                    "retry_count": 0
                },
                {
                    "question": "How do you optimize a slow SQL query?",
                    "retry_count": 0
                },
                {
                    "question": "What is the difference between WHERE and HAVING clauses?",
                    "retry_count": 0
                }
            ]
        }
        
        self.interview_data = {
            "language": "",
            "questions_answers": [],
            "timestamp": "",
            "feedback": "",
            "rating": 0,
            "detailed_feedback": []
        }

    def _initialize_ai(self):
        """Initialize Google Gemini AI"""
        try:
            import google.generativeai as genai
            
            # Get API key from environment
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                print("🔑 No Gemini API key found. Using demo mode...")
                print("   Get free API key from: https://aistudio.google.com/")
                return False
                
            genai.configure(api_key=api_key)
            self.genai_model = genai.GenerativeModel('gemini-pro')
            print("✅ REAL AI Initialized: Google Gemini Pro")
            return True
            
        except ImportError:
            print("❌ Google Generative AI not installed.")
            print("   Install with: pip install google-generativeai")
            return False
        except Exception as e:
            print(f"❌ AI initialization failed: {e}")
            return False

    def generate_ai_answer(self, question, language):
        """Generate answer using REAL Google Gemini AI"""
        if self.ai_available:
            try:
                return self._generate_gemini_answer(question, language)
            except Exception as e:
                print(f"🤖 Gemini AI Error: {e}")
                return self._generate_fallback_answer(question, language)
        else:
            return self._generate_fallback_answer(question, language)

    def _generate_gemini_answer(self, question, language):
        """Use REAL Google Gemini AI to generate answers"""
        import google.generativeai as genai
        
        prompt = f"""
        You are a technical interview coach. Provide a concise, educational answer to this programming interview question.
        
        PROGRAMMING LANGUAGE: {language}
        QUESTION: {question}
        
        Requirements:
        - Keep answer under 100 words
        - Focus on clarity and practical understanding
        - Provide a structured explanation
        - Make it educational for interview preparation
        
        Provide only the answer text.
        """
        
        response = self.genai_model.generate_content(prompt)
        answer = response.text.strip()
        
        # Clean and format the answer
        answer = self._clean_ai_answer(answer)
        print(f"🤖 REAL AI Generated: {answer}")
        return answer

    def _generate_fallback_answer(self, question, language):
        """Fallback when AI is not available"""
        return f"This {language} question requires a clear explanation of the concept with practical examples."

    def _clean_ai_answer(self, text):
        """Clean and format the AI-generated answer"""
        text = ' '.join(text.split())
        if text and text[-1] not in ['.', '!', '?']:
            text += '.'
        if len(text) > 300:
            sentences = text.split('.')
            text = '.'.join(sentences[:3]) + '.'
        return text

    def speak(self, text):
        """Convert text to speech"""
        print(f"AI: {text}")
        try:
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            print(f"TTS Error: {e}")

    def listen_quick(self, timeout=30):
        """Quick listening for language selection - NO 10-second wait"""
        if not self.microphone:
            return "Microphone not available - please check your audio settings"
            
        try:
            with self.microphone as source:
                print("\n🎤 Listening... (Speak now)")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                # Quick listening - no long pause waiting
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=15)
            
            print("🔄 Processing speech...")
            text = self.recognizer.recognize_google(audio)
            print(f"💬 You said: {text}")
            return text.lower()
            
        except sr.WaitTimeoutError:
            return "no response detected"
        except sr.UnknownValueError:
            return "could not understand audio"
        except sr.RequestError as e:
            return f"error with speech recognition service: {e}"
        except Exception as e:
            return f"microphone error: {e}"

    def listen_with_pauses(self, timeout=90):
        """Listening with 10-second pause detection - SILENT waiting"""
        if not self.microphone:
            return "Microphone not available - please check your audio settings"
            
        print("\n🎤 Listening... (Speak naturally - I'll wait silently after you finish)")
        
        full_transcript = []
        silence_start_time = None
        max_silence = 10  # Wait 10 seconds of silence
        
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            start_time = time.time()
            
            while (time.time() - start_time) < timeout:
                try:
                    # Listen in shorter chunks to detect pauses
                    audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=20)
                    
                    # If we get audio, process it
                    text = self.recognizer.recognize_google(audio)
                    if text.strip():
                        print(f"💬 {text}")
                        full_transcript.append(text)
                        silence_start_time = None  # Reset silence timer
                    
                except sr.WaitTimeoutError:
                    # No speech detected in this chunk
                    current_time = time.time()
                    if silence_start_time is None:
                        silence_start_time = current_time
                    elif current_time - silence_start_time >= max_silence:
                        # 10 seconds of silence detected - stop listening
                        print("✅ Silence detected, processing answer...")
                        break
                    
                    # SILENT waiting - no console output or speech
                    continue
                    
                except sr.UnknownValueError:
                    # Could not understand this chunk, but continue listening
                    continue
                except Exception as e:
                    print(f"Listening error: {e}")
                    break
        
        if full_transcript:
            full_answer = " ".join(full_transcript)
            print(f"📝 Full answer: {full_answer}")
            return full_answer.lower()
        else:
            return "no response detected"

    def listen(self, timeout=60):
        """Main listen method - uses appropriate listening based on phase"""
        if self.in_questions_phase:
            # Use pause detection during interview questions
            return self.listen_with_pauses(timeout)
        else:
            # Use quick listening for language selection
            return self.listen_quick(timeout)

    def select_language(self):
        """Let user select programming language via voice - NO 10-second wait"""
        languages = list(self.questions_db.keys())
        language_text = "Please select a programming language. Say Python, Java, or SQL"
        
        print(language_text)
        self.speak(language_text)
        
        max_attempts = 3
        for attempt in range(max_attempts):
            # Use quick listening (no 10-second wait)
            response = self.listen_quick(timeout=20)
            for lang in languages:
                if lang in response:
                    self.interview_data["language"] = lang
                    self.speak(f"Excellent! Starting {lang} interview. Get ready!")
                    return lang
            
            if attempt < max_attempts - 1:
                retry_text = f"Sorry, I didn't understand. Please say Python, Java, or SQL. Attempt {attempt + 1} of {max_attempts}"
                print(retry_text)
                self.speak(retry_text)
            else:
                self.speak("Defaulting to Python interview.")
                self.interview_data["language"] = "python"
                return "python"

    def analyze_answer_quality(self, question, answer):
        """Analyze the quality of a single answer without keywords"""
        
        if any(phrase in answer for phrase in ["no response", "could not understand", "error with speech", "microphone error"]):
            return 0, len(answer.split())
        
        word_count = len(answer.split())
        
        # Quality score calculation based on answer structure and content
        quality_score = 0
        
        # Word count factor (0-4 points)
        if word_count > 50:
            quality_score += 4
        elif word_count > 30:
            quality_score += 3
        elif word_count > 20:
            quality_score += 2
        elif word_count > 10:
            quality_score += 1
        
        # Structure factor (0-3 points)
        if any(phrase in answer for phrase in ['because', 'for example', 'such as', 'this means', 'in other words']):
            quality_score += 3
        elif any(phrase in answer for phrase in ['is when', 'used for', 'allows us', 'the purpose']):
            quality_score += 2
        elif any(phrase in answer for phrase in ['means that', 'allows to', 'helps to']):
            quality_score += 1
        
        # Technical depth factor (0-3 points)
        technical_terms = sum(1 for term in ['function', 'method', 'class', 'object', 'variable', 'database', 'query', 
                                           'algorithm', 'interface', 'inheritance', 'polymorphism', 'encapsulation',
                                           'decorator', 'generator', 'iterator', 'join', 'index', 'normalization'] 
                            if term in answer)
        if technical_terms >= 3:
            quality_score += 3
        elif technical_terms >= 2:
            quality_score += 2
        elif technical_terms >= 1:
            quality_score += 1
        
        return min(quality_score, 10), word_count

    def conduct_interview(self):
        """Main interview process"""
        # Phase 1: Language selection - NO 10-second wait
        language = self.select_language()
        questions = random.sample(self.questions_db[language], min(5, len(self.questions_db[language])))
        
        # Phase 2: Interview questions - START 10-second wait from here
        self.in_questions_phase = True
        
        start_text = f"Starting {language} interview with {len(questions)} questions."
        if self.ai_available:
            start_text += " REAL AI assistance is enabled!"
        else:
            start_text += " AI is in demo mode."
            
        # Important instructions about pausing (only for interview questions)
        instructions = "From now on, you can speak naturally and take pauses. I will wait silently after you finish speaking before processing your answer."
        
        print(f"\n{start_text}")
        print(f"📝 {instructions}")
        self.speak(start_text)
        self.speak(instructions)
        time.sleep(2)
        
        i = 0
        while i < len(questions):
            question_data = questions[i]
            question = question_data["question"]
            
            print(f"\n{'='*60}")
            print(f"Question {i+1}/{len(questions)}")
            print(f"Q: {question}")
            print(f"{'='*60}")
            
            self.speak(f"Question {i+1}. {question}")
            time.sleep(1)
            # Removed the speaking of waiting instructions to keep it silent
            print("💡 You can start speaking now. The system will wait silently after you finish.")
            
            # This will now use the SILENT pause detection listening
            answer = self.listen(timeout=90)
            quality_score, word_count = self.analyze_answer_quality(question, answer)
            
            if (quality_score <= 2 or 
                any(phrase in answer for phrase in ["no response", "could not understand", "error with speech"])):
                
                print("🔄 Generating REAL AI answer...")
                ai_answer = self.generate_ai_answer(question, language)
                
                feedback_msg = f"I noticed some difficulty with your response. Here's a helpful explanation: {ai_answer}. Now I'll repeat the same question. Please try to answer it based on what you learned."
                
                print(f"🤖 REAL AI Answer: {ai_answer}")
                self.speak(feedback_msg)
                time.sleep(2)
                
                question_data["retry_count"] += 1
                
                if question_data["retry_count"] >= 2:
                    move_on_msg = "Let's move to the next question."
                    self.speak(move_on_msg)
                    qa_pair = {
                        "question": question,
                        "answer": answer,
                        "question_number": i+1,
                        "quality_score": quality_score,
                        "word_count": word_count,
                        "ai_provided_answer": ai_answer,
                        "retried": True
                    }
                    self.interview_data["questions_answers"].append(qa_pair)
                    i += 1
                continue
            
            qa_pair = {
                "question": question,
                "answer": answer,
                "question_number": i+1,
                "quality_score": quality_score,
                "word_count": word_count,
                "retried": question_data["retry_count"] > 0
            }
            self.interview_data["questions_answers"].append(qa_pair)
            
            if quality_score >= 7:
                feedback = "Good answer!"
            elif quality_score >= 4:
                feedback = "Thank you. You could add more details."
            else:
                feedback = "Thank you for your answer."
            
            if i + 1 < len(questions):
                feedback += " Next question."
            else:
                feedback += " That was the last question."
            
            print(f"📊 Immediate analysis: {quality_score}/10 quality, {word_count} words")
            self.speak(feedback)
            time.sleep(1)
            i += 1
        
        # Interview questions phase ended
        self.in_questions_phase = False

    def generate_final_feedback(self):
        """Generate comprehensive final feedback"""
        total_questions = len(self.interview_data["questions_answers"])
        
        if total_questions == 0:
            return "No questions were answered.", 0
        
        total_quality = sum(qa["quality_score"] for qa in self.interview_data["questions_answers"])
        avg_quality = total_quality / total_questions
        avg_word_count = sum(qa["word_count"] for qa in self.interview_data["questions_answers"]) / total_questions
        
        poor_answers = sum(1 for qa in self.interview_data["questions_answers"] 
                          if any(phrase in qa["answer"] for phrase in ["no response", "could not understand", "error with speech"]))
        
        retried_questions = sum(1 for qa in self.interview_data["questions_answers"] if qa.get("retried", False))
        
        if poor_answers == total_questions:
            feedback = "The system had difficulty capturing your responses. Please ensure you're speaking clearly in a quiet environment."
            rating = 2
        elif avg_quality >= 8:
            feedback = "Excellent performance! You demonstrated strong understanding with detailed, well-structured answers."
            rating = random.randint(9, 10)
        elif avg_quality >= 6:
            feedback = "Good performance! You provided solid answers but could benefit from more examples and technical depth."
            rating = random.randint(7, 8)
        elif avg_quality >= 4:
            feedback = "Fair performance. You covered basic concepts but need more detailed explanations and structure."
            rating = random.randint(5, 6)
        else:
            feedback = "Needs improvement. Focus on providing more structured answers with clear explanations and examples."
            rating = random.randint(3, 4)
        
        if retried_questions > 0:
            feedback += f" Note: {retried_questions} question(s) needed repetition with AI guidance."
        if avg_word_count < 15:
            feedback += " Try to provide more detailed explanations with examples."
        
        return feedback, rating

    def generate_report(self):
        """Generate and display final report"""
        print("\n" + "="*70)
        print("🎯 AI MOCK INTERVIEW REPORT")
        print("="*70)
        print(f"Programming Language: {self.interview_data['language'].upper()}")
        print(f"Interview Date: {self.interview_data['timestamp']}")
        print(f"Total Questions: {len(self.interview_data['questions_answers'])}")
        print(f"AI Mode: {'REAL AI (Gemini)' if self.ai_available else 'Demo Mode'}")
        
        print("\n" + "-"*70)
        print("📝 DETAILED QUESTION & ANSWER ANALYSIS")
        print("-"*70)
        
        for qa in self.interview_data["questions_answers"]:
            print(f"\nQ{qa['question_number']}: {qa['question']}")
            print(f"A: {qa['answer']}")
            if qa.get('ai_provided_answer'):
                print(f"🤖 AI Provided Answer: {qa['ai_provided_answer']}")
            print(f"📊 Analysis: Score {qa['quality_score']}/10 | {qa['word_count']} words")
            if qa.get('retried'):
                print("🔄 This question was repeated with AI guidance")
            print("-" * 50)
        
        print("\n" + "⭐"*25)
        print("📊 FINAL EVALUATION")
        print("⭐"*25)
        print(f"\nOverall Rating: {self.interview_data['rating']}/10")
        print(f"\nFeedback: {self.interview_data['feedback']}")
        
        self.save_interview_data()

    def save_interview_data(self):
        """Save interview data to JSON file"""
        filename = f"interview_{self.interview_data['language']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.interview_data, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Interview data saved to: {filename}")
        except Exception as e:
            print(f"\n⚠️ Could not save file: {e}")

    def run(self):
        """Main method to run the interview system"""
        try:
            print("🎤 AI Mock Interview System Started!")
            print("🔊 Make sure your microphone is working properly.")
            print("📍 For language selection: Quick responses")
            print("⏸️  For interview questions: You can pause - I'll wait silently after you finish")
            print("⏳ Maximum answer time: 90 seconds per question")
            
            if self.ai_available:
                print("🤖 REAL AI Integration: ENABLED (Google Gemini)")
                print("   The system will generate dynamic AI answers!")
            else:
                print("🤖 REAL AI: DEMO MODE")
                print("   To enable real AI:")
                print("   1. Get free API key: https://aistudio.google.com/")
                print("   2. Install: pip install google-generativeai")
                print("   3. Set environment: GEMINI_API_KEY=your_key_here")
            
            self.conduct_interview()
            
            feedback, rating = self.generate_final_feedback()
            self.interview_data["feedback"] = feedback
            self.interview_data["rating"] = rating
            self.interview_data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            self.generate_report()
            
            final_msg = f"Interview completed. Your overall rating is {rating} out of 10. {feedback}"
            self.speak(final_msg)
            
        except KeyboardInterrupt:
            print("\n❌ Interview cancelled by user.")
        except Exception as e:
            print(f"\n❌ An error occurred: {e}")
            self.speak("Sorry, there was an error with the system.")

if __name__ == "__main__":
    print("🚀 Starting AI Mock Interview System with REAL AI...")
    time.sleep(2)
    
    interview_system = VoiceInterviewSystem()
    interview_system.run()
