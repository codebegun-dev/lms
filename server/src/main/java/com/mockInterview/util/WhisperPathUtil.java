// ✅ Updated WhisperPathUtil
package com.mockInterview.util;

import java.io.File;

public class WhisperPathUtil {

    private static final String BASE_DIR = System.getProperty("user.dir") + File.separator + "whisper";
    private static final String BIN_DIR   = BASE_DIR + File.separator + "bin";
    private static final String MODEL_DIR = BASE_DIR + File.separator + "models";
    private static final String AUDIO_DIR = BASE_DIR + File.separator + "audio";

    public static String getModelFile() {
        return MODEL_DIR + File.separator + "ggml-base.en.bin";
    }

    public static String getWhisperExecutable() {
        String exe = isWindows() ? "whisper-cli.exe" : "whisper-cli";
        String path = BIN_DIR + File.separator + exe;
        if (!new File(path).exists()) {
            throw new RuntimeException("❌ Whisper binary missing at: " + path);
        }
        return path;
    }

    // ✅ Now AUDIO_DIR is useful
    public static String getAudioDir() {
        return AUDIO_DIR;
    }

    public static boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("win");
    }
}
