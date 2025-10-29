package com.mockInterview.service;


import org.springframework.stereotype.Service;
import com.mockInterview.model.AnalysisResponse;
import java.io.*;

@Service
public class AudioAnalysisServiceReal {

    public AnalysisResponse analyzeAudio(String audioFilePath) {
        try {
            // Method 1: Use relative path from project root
            String pythonScriptPath = "src/main/python/ai_analyzer.py";
            File scriptFile = new File(pythonScriptPath);
            
            // Method 2: If not found, try absolute path
            if (!scriptFile.exists()) {
                pythonScriptPath = new File(".").getAbsolutePath() + "/src/main/python/ai_analyzer.py";
                scriptFile = new File(pythonScriptPath);
            }
            
            System.out.println("Python script path: " + pythonScriptPath);
            System.out.println("Script exists: " + scriptFile.exists());
            
            if (!scriptFile.exists()) {
                AnalysisResponse response = new AnalysisResponse();
                response.setStatus("error");
                response.setMessage("Python script not found at: " + pythonScriptPath);
                return response;
            }
            
            // Prepare the Python command
            ProcessBuilder processBuilder = new ProcessBuilder("python", pythonScriptPath, audioFilePath);
            processBuilder.redirectErrorStream(true);
            
            // Start the Python process
            Process process = processBuilder.start();
            
            // Read the output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            // Wait for process to complete
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                return parsePythonOutput(output.toString());
            } else {
                AnalysisResponse response = new AnalysisResponse();
                response.setStatus("error");
                response.setMessage("Python script execution failed: " + output.toString());
                return response;
            }
            
        } catch (IOException | InterruptedException e) {
            AnalysisResponse response = new AnalysisResponse();
            response.setStatus("error");
            response.setMessage("Service error: " + e.getMessage());
            return response;
        }
    }

    private AnalysisResponse parsePythonOutput(String pythonOutput) {
        AnalysisResponse response = new AnalysisResponse();
        response.setStatus("success");
        
        try {
            String[] lines = pythonOutput.split("\n");
            
            for (String line : lines) {
                if (line.contains("EXTRACTED_TEXT:")) {
                    response.setExtractedText(line.split("EXTRACTED_TEXT:")[1].trim());
                } else if (line.contains("CONTENT_TYPE:")) {
                    response.setContentType(line.split("CONTENT_TYPE:")[1].trim());
                } else if (line.contains("KEY_TOPICS:")) {
                    response.setKeyTopics(line.split("KEY_TOPICS:")[1].trim());
                } else if (line.contains("COMMUNICATION_SCORE:")) {
                    String scoreStr = line.split("COMMUNICATION_SCORE:")[1].trim().split("/")[0];
                    response.setCommunicationScore(Integer.parseInt(scoreStr));
                } else if (line.contains("ROUND_SCORES:")) {
                    response.setRoundScores(line.split("ROUND_SCORES:")[1].trim());
                } else if (line.contains("CONFIDENCE_SCORE:")) {
                    String scoreStr = line.split("CONFIDENCE_SCORE:")[1].trim().split("/")[0];
                    response.setConfidenceScore(Integer.parseInt(scoreStr));
                } else if (line.contains("CLARITY_SCORE:")) {
                    String scoreStr = line.split("CLARITY_SCORE:")[1].trim().split("/")[0];
                    response.setClarityScore(Integer.parseInt(scoreStr));
                } else if (line.contains("OVERALL_RATING:")) {
                    response.setOverallRating(line.split("OVERALL_RATING:")[1].trim());
                } else if (line.contains("AI_FEEDBACK:")) {
                    response.setAiFeedback(line.split("AI_FEEDBACK:")[1].trim());
                } else if (line.contains("IMPROVEMENT_SUGGESTIONS:")) {
                    response.setImprovementSuggestions(line.split("IMPROVEMENT_SUGGESTIONS:")[1].trim());
                } else if (line.contains("ANALYZED_AI:")) {
                    response.setAnalyzedAi(line.split("ANALYZED_AI:")[1].trim());
                } else if (line.contains("CONTENT_ANALYSIS:")) {
                    response.setContentAnalysis(line.split("CONTENT_ANALYSIS:")[1].trim());
                } else if (line.contains("AI_RECOMMENDATIONS:")) {
                    response.setAiRecommendations(line.split("AI_RECOMMENDATIONS:")[1].trim());
                } else if (line.contains("SKILL_INSIGHTS:")) {
                    response.setSkillInsights(line.split("SKILL_INSIGHTS:")[1].trim());
                } else if (line.contains("RECORD_ID:")) {
                    response.setRecordId(Integer.parseInt(line.split("RECORD_ID:")[1].trim()));
                }
            }
            
        } catch (Exception e) {
            response.setStatus("error");
            response.setMessage("Error parsing Python output: " + e.getMessage());
        }
        
        return response;
    }
}