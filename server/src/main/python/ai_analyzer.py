import sys
import os
import mysql.connector
import re
import math

class MySQLAIAnalyzer:
    def __init__(self):
        self.setup_database()
    
    def setup_database(self):
        """Setup MySQL database connection"""
        try:
            self.conn = mysql.connector.connect(
                host='localhost',
                user='root',
                password='root',
                database='ai_feedback_db'
            )
            self.cursor = self.conn.cursor()
            self.create_table()
        except mysql.connector.Error as e:
            print(f"MySQL Connection Error: {e}")
            raise
    
    def create_table(self):
        """Create table in MySQL with new fields"""
        create_table_query = '''
            CREATE TABLE IF NOT EXISTS ai_feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audio_file VARCHAR(255) NOT NULL,
                extracted_text TEXT NOT NULL,
                content_type VARCHAR(100),
                key_topics TEXT,
                communication_score INT,
                round_scores TEXT,           -- NEW FIELD
                confidence_score INT,        -- NEW FIELD
                clarity_score INT,           -- NEW FIELD
                overall_rating VARCHAR(50),
                ai_feedback TEXT,            -- NEW FIELD
                improvement_suggestions TEXT,-- NEW FIELD
                analyzed_ai VARCHAR(100),    -- NEW FIELD
                content_analysis TEXT,
                ai_recommendations TEXT,
                skill_insights TEXT,
                analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '''
        self.cursor.execute(create_table_query)
        self.conn.commit()
    
    def audio_to_text(self, audio_path):
        """Convert audio to text using Whisper"""
        try:
            import whisper
            model = whisper.load_model("base")
            result = model.transcribe(audio_path)
            return result["text"].strip()
        except Exception as e:
            print(f"Audio conversion failed: {e}")
            return None

    def generate_ai_feedback(self, text):
        """
        Generate comprehensive AI feedback with new fields
        """
        if not text:
            return None
        
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        word_count = len(words)
        
        # Existing analysis
        content_type = self._ai_detect_content_type(text.lower())
        key_topics = self._ai_extract_key_topics(text, words)
        communication_score = self._ai_analyze_communication(text, words, sentences)
        content_analysis = self._ai_analyze_content(text, words, sentences)
        ai_recommendations = self._ai_generate_recommendations(text, content_type, words)
        skill_insights = self._ai_identify_skills(text, content_type)
        overall_rating = self._ai_determine_rating(communication_score)
        
        # NEW FIELDS - Enhanced analysis
        round_scores = self._calculate_round_scores(text, words, sentences)
        confidence_score = self._analyze_confidence(text, words)
        clarity_score = self._analyze_clarity(text, sentences)
        ai_feedback = self._generate_ai_feedback_summary(text, content_type, communication_score)
        improvement_suggestions = self._generate_improvement_suggestions(text, content_type, words, sentences)
        analyzed_ai = "Whisper-Enhanced Analyzer v2.0"  # NEW FIELD
        
        return {
            # Existing fields
            "content_type": content_type,
            "key_topics": key_topics,
            "communication_score": communication_score,
            "content_analysis": content_analysis,
            "ai_recommendations": ai_recommendations,
            "skill_insights": skill_insights,
            "overall_rating": overall_rating,
            
            # NEW FIELDS
            "round_scores": round_scores,
            "confidence_score": confidence_score,
            "clarity_score": clarity_score,
            "ai_feedback": ai_feedback,
            "improvement_suggestions": improvement_suggestions,
            "analyzed_ai": analyzed_ai
        }

    # NEW METHODS FOR ADDITIONAL FIELDS

    def _calculate_round_scores(self, text, words, sentences):
        """Calculate scores for different rounds/categories"""
        rounds = {
            "content_quality": self._score_content_quality(text, words),
            "language_fluency": self._score_language_fluency(text, sentences),
            "vocabulary_range": self._score_vocabulary_range(words),
            "engagement_level": self._score_engagement_level(text),
            "technical_accuracy": self._score_technical_accuracy(text)
        }
        
        # Convert to JSON string for storage
        import json
        return json.dumps(rounds)

    def _analyze_confidence(self, text, words):
        """Analyze confidence level in speech"""
        confidence_indicators = [
            len([w for w in words if w.lower() in ['i', 'we', 'our', 'my']]),  # Personal pronouns
            len([s for s in text.split('.') if len(s.strip()) > 0]),  # Complete sentences
            len(re.findall(r'\b(can|will|shall|must|should)\b', text.lower())),  # Assertive words
        ]
        
        base_score = 5
        if len(words) > 30:
            base_score += 1
        if confidence_indicators[0] > 3:  # Personal references
            base_score += 1
        if confidence_indicators[1] > 2:  # Complete sentences
            base_score += 1
        if confidence_indicators[2] > 2:  # Assertive language
            base_score += 1
            
        return min(10, base_score)

    def _analyze_clarity(self, text, sentences):
        """Analyze clarity of communication"""
        clarity_score = 6  # Base score
        
        # Sentence length analysis
        if sentences:
            avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
            if 8 <= avg_sentence_length <= 20:
                clarity_score += 2
            elif avg_sentence_length > 25:
                clarity_score -= 1
        
        # Vocabulary complexity
        complex_words = [word for word in text.split() if len(word) > 8]
        complexity_ratio = len(complex_words) / len(text.split()) if text.split() else 0
        if complexity_ratio < 0.2:  # Not too complex
            clarity_score += 1
        
        # Structure indicators
        if any(marker in text.lower() for marker in ['first', 'second', 'then', 'finally']):
            clarity_score += 1  # Good structure
            
        return min(10, clarity_score)

    def _generate_ai_feedback_summary(self, text, content_type, communication_score):
        """Generate comprehensive AI feedback summary"""
        feedback_parts = []
        
        # Content feedback
        if content_type == "Programming/Technical":
            feedback_parts.append("Strong technical content with clear domain knowledge.")
        elif content_type == "Story/Narrative":
            feedback_parts.append("Engaging narrative with good storytelling elements.")
        else:
            feedback_parts.append("Well-articulated content with clear communication.")
        
        # Score-based feedback
        if communication_score >= 8:
            feedback_parts.append("Excellent communication skills demonstrated.")
        elif communication_score >= 6:
            feedback_parts.append("Good communication with room for refinement.")
        else:
            feedback_parts.append("Basic communication achieved, focus on development.")
        
        # Length feedback
        word_count = len(text.split())
        if word_count > 100:
            feedback_parts.append("Comprehensive coverage of topics.")
        elif word_count > 50:
            feedback_parts.append("Adequate content depth maintained.")
        else:
            feedback_parts.append("Consider expanding on key points.")
        
        return " ".join(feedback_parts)

    def _generate_improvement_suggestions(self, text, content_type, words, sentences):
        """Generate specific improvement suggestions"""
        suggestions = []
        
        # Content-specific suggestions
        if content_type == "Programming/Technical":
            suggestions.extend([
                "Include more code examples or pseudocode",
                "Explain technical concepts with real-world analogies",
                "Discuss implementation challenges and solutions"
            ])
        elif content_type == "Story/Narrative":
            suggestions.extend([
                "Add more descriptive elements and sensory details",
                "Develop character motivations more deeply",
                "Vary sentence structure for better flow"
            ])
        else:
            suggestions.extend([
                "Incorporate more specific examples and data",
                "Use transitional phrases for better flow",
                "Consider audience perspective and knowledge level"
            ])
        
        # Universal suggestions based on analysis
        word_count = len(words)
        if word_count < 40:
            suggestions.append("Expand content with more detailed explanations")
        
        if sentences and len(sentences) < 3:
            suggestions.append("Develop more complete thoughts and ideas")
        
        # Vocabulary enhancement
        unique_ratio = len(set(words)) / len(words) if words else 0
        if unique_ratio < 0.5:
            suggestions.append("Use more varied vocabulary to enhance expression")
        
        return " | ".join(suggestions[:4])  # Return top 4 suggestions

    # SCORING HELPER METHODS

    def _score_content_quality(self, text, words):
        """Score content quality"""
        score = 5
        if len(words) > 50:
            score += 2
        if any(marker in text.lower() for marker in ['because', 'therefore', 'however']):
            score += 1  # Logical connectors
        return min(10, score)

    def _score_language_fluency(self, text, sentences):
        """Score language fluency"""
        score = 6
        if sentences and len(sentences) > 2:
            score += 1
        if len(re.findall(r'\b(and|but|or|because)\b', text.lower())) > 2:
            score += 1  # Good use of connectors
        return min(10, score)

    def _score_vocabulary_range(self, words):
        """Score vocabulary range"""
        if not words:
            return 5
        
        unique_words = len(set(words))
        diversity_ratio = unique_words / len(words)
        
        if diversity_ratio > 0.7:
            return 9
        elif diversity_ratio > 0.5:
            return 7
        else:
            return 5

    def _score_engagement_level(self, text):
        """Score engagement level"""
        score = 5
        engaging_elements = ['!', '?', 'amazing', 'interesting', 'important']
        if any(element in text.lower() for element in engaging_elements):
            score += 2
        if len(text) > 100:  # Substantial content
            score += 1
        return min(10, score)

    def _score_technical_accuracy(self, text):
        """Score technical accuracy (basic)"""
        score = 7  # Assume reasonable accuracy
        technical_terms = len(re.findall(r'\b(algorithm|function|variable|method|class)\b', text.lower()))
        if technical_terms > 3:
            score += 1  # Good technical depth
        return min(10, score)

    # EXISTING METHODS (keep all your existing analysis methods)
    def _ai_detect_content_type(self, text):
        programming_terms = ['python', 'javascript', 'java', 'code', 'programming', 'algorithm']
        story_terms = ['story', 'once', 'lived', 'house', 'garden', 'butterfly', 'cat']
        business_terms = ['business', 'company', 'market', 'customer', 'product']
        
        programming_count = sum(1 for term in programming_terms if term in text)
        story_count = sum(1 for term in story_terms if term in text)
        business_count = sum(1 for term in business_terms if term in text)
        
        if programming_count > 0:
            return "Programming/Technical"
        elif story_count > 0:
            return "Story/Narrative"
        elif business_count > 0:
            return "Business/Professional"
        else:
            return "General Conversation"

    def _ai_extract_key_topics(self, text, words):
        topics = []
        text_lower = text.lower()
        
        topic_categories = {
            'Technology': ['python', 'javascript', 'code', 'software', 'app'],
            'Creativity': ['story', 'creative', 'imagine', 'art', 'design'],
            'Business': ['business', 'company', 'market', 'customer'],
            'Learning': ['learn', 'study', 'education', 'knowledge'],
            'Problem Solving': ['problem', 'solve', 'solution', 'challenge']
        }
        
        for category, keywords in topic_categories.items():
            if any(keyword in text_lower for keyword in keywords):
                topics.append(category)
        
        return ", ".join(topics) if topics else "General Discussion"

    def _ai_analyze_communication(self, text, words, sentences):
        score = 5
        word_count = len(words)
        if word_count > 50:
            score += 2
        elif word_count > 20:
            score += 1
        
        if sentences:
            avg_sentence_length = word_count / len(sentences)
            if 8 <= avg_sentence_length <= 20:
                score += 2
        
        unique_words = len(set(words))
        diversity_ratio = unique_words / word_count if word_count > 0 else 0
        if diversity_ratio > 0.6:
            score += 2
        
        if '?' in text or '!' in text:
            score += 1
        
        return min(10, score)

    def _ai_analyze_content(self, text, words, sentences):
        analysis_points = []
        word_count = len(words)
        
        if word_count > 80:
            analysis_points.append("Comprehensive and detailed content")
        elif word_count > 40:
            analysis_points.append("Well-developed with good substance")
        elif word_count > 20:
            analysis_points.append("Clear and concise communication")
        else:
            analysis_points.append("Brief message - consider expanding")
        
        if len(sentences) >= 3:
            analysis_points.append("Good structural organization")
        
        return " | ".join(analysis_points)

    def _ai_generate_recommendations(self, text, content_type, words):
        recommendations = []
        
        if content_type == "Programming/Technical":
            recommendations.extend([
                "Consider sharing specific code examples",
                "Discuss real-world applications",
                "Explain technical concepts with analogies"
            ])
        elif content_type == "Story/Narrative":
            recommendations.extend([
                "Add more descriptive details",
                "Consider character development",
                "Use varied sentence structures"
            ])
        else:
            recommendations.extend([
                "Add specific examples",
                "Consider your target audience",
                "Use varied vocabulary"
            ])
        
        word_count = len(words)
        if word_count < 30:
            recommendations.append("Expand with more detailed explanations")
        
        return " | ".join(recommendations[:3])

    def _ai_identify_skills(self, text, content_type):
        skills = ["Clear Communication"]
        
        if content_type == "Programming/Technical":
            skills.append("Technical Knowledge")
        elif content_type == "Story/Narrative":
            skills.append("Creative Expression")
        elif content_type == "Business/Professional":
            skills.append("Professional Insight")
        
        return ", ".join(skills)

    def _ai_determine_rating(self, score):
        if score >= 8:
            return "Excellent"
        elif score >= 6:
            return "Good"
        else:
            return "Satisfactory"

    def save_to_mysql(self, audio_file, text, feedback):
        """Save AI feedback to MySQL database with new fields"""
        try:
            insert_query = '''
                INSERT INTO ai_feedback 
                (audio_file, extracted_text, content_type, key_topics, communication_score,
                 round_scores, confidence_score, clarity_score, overall_rating,
                 ai_feedback, improvement_suggestions, analyzed_ai,
                 content_analysis, ai_recommendations, skill_insights)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            '''
            
            self.cursor.execute(insert_query, (
                audio_file,
                text,
                feedback["content_type"],
                feedback["key_topics"],
                feedback["communication_score"],
                feedback["round_scores"],
                feedback["confidence_score"],
                feedback["clarity_score"],
                feedback["overall_rating"],
                feedback["ai_feedback"],
                feedback["improvement_suggestions"],
                feedback["analyzed_ai"],
                feedback["content_analysis"],
                feedback["ai_recommendations"],
                feedback["skill_insights"]
            ))
            
            self.conn.commit()
            return self.cursor.lastrowid
        except mysql.connector.Error as e:
            print(f"Database save error: {e}")
            return None

    def analyze_audio(self, audio_path):
        """Complete AI analysis pipeline"""
        if not os.path.exists(audio_path):
            return {"error": "Audio file not found"}
        
        # Convert audio to text
        text = self.audio_to_text(audio_path)
        if not text:
            return {"error": "Failed to extract text from audio"}
        
        # Generate AI feedback
        feedback = self.generate_ai_feedback(text)
        if not feedback:
            return {"error": "Failed to generate AI feedback"}
        
        # Save to MySQL database
        feedback_id = self.save_to_mysql(audio_path, text, feedback)
        
        if feedback_id:
            result = {
                "status": "success",
                "extracted_text": text,
                "content_type": feedback["content_type"],
                "key_topics": feedback["key_topics"],
                "communication_score": feedback["communication_score"],
                "round_scores": feedback["round_scores"],
                "confidence_score": feedback["confidence_score"],
                "clarity_score": feedback["clarity_score"],
                "overall_rating": feedback["overall_rating"],
                "ai_feedback": feedback["ai_feedback"],
                "improvement_suggestions": feedback["improvement_suggestions"],
                "analyzed_ai": feedback["analyzed_ai"],
                "content_analysis": feedback["content_analysis"],
                "ai_recommendations": feedback["ai_recommendations"],
                "skill_insights": feedback["skill_insights"],
                "record_id": feedback_id
            }
            
            # Print in format that Java can parse
            print(f"EXTRACTED_TEXT: {text}")
            print(f"CONTENT_TYPE: {feedback['content_type']}")
            print(f"KEY_TOPICS: {feedback['key_topics']}")
            print(f"COMMUNICATION_SCORE: {feedback['communication_score']}/10")
            print(f"ROUND_SCORES: {feedback['round_scores']}")
            print(f"CONFIDENCE_SCORE: {feedback['confidence_score']}/10")
            print(f"CLARITY_SCORE: {feedback['clarity_score']}/10")
            print(f"OVERALL_RATING: {feedback['overall_rating']}")
            print(f"AI_FEEDBACK: {feedback['ai_feedback']}")
            print(f"IMPROVEMENT_SUGGESTIONS: {feedback['improvement_suggestions']}")
            print(f"ANALYZED_AI: {feedback['analyzed_ai']}")
            print(f"CONTENT_ANALYSIS: {feedback['content_analysis']}")
            print(f"AI_RECOMMENDATIONS: {feedback['ai_recommendations']}")
            print(f"SKILL_INSIGHTS: {feedback['skill_insights']}")
            print(f"RECORD_ID: {feedback_id}")
            
            return result
        else:
            return {"error": "Failed to save to database"}

def main():
    if len(sys.argv) != 2:
        print("Usage: python ai_analyzer.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    analyzer = MySQLAIAnalyzer()
    result = analyzer.analyze_audio(audio_path)
    
    if "error" in result:
        print(f"ERROR: {result['error']}")
        sys.exit(1)

if __name__ == "__main__":
    main()