package com.mockInterview.service;



import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class FlaskStarter {

    public static void startFlaskServer() {
        try {
            System.out.println("🚀 Starting Flask server...");

            // Adjust the Python path (STS runs from project root)
            ProcessBuilder pb = new ProcessBuilder(
                "python",
                "src/main/python/interview_api_real.py"
            );
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // Print Flask logs in a background thread
            new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[FLASK] " + line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();

            // Wait a bit for Flask to start
            Thread.sleep(5000);

            System.out.println("✅ Flask server is running on http://127.0.0.1:8000");

        } catch (Exception e) {
            System.err.println("❌ Failed to start Flask: " + e.getMessage());
        }
    }
}
