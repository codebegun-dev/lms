package com.mockInterview.aiEngine;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;

import java.nio.file.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Component
public class WhisperBootstrapService {

    // ✅ Base project whisper folder
    private final String BASE_DIR  = System.getProperty("user.dir") + File.separator + "whisper";
    private final String BIN_DIR   = BASE_DIR + File.separator + "bin";
    private final String MODEL_DIR = BASE_DIR + File.separator + "models";
    private final String AUDIO_DIR = BASE_DIR + File.separator + "audio";

    // ✅ FFmpeg folder inside whisper
    private final String FFMPEG_DIR = BASE_DIR + File.separator + "ffmpeg" + File.separator + "bin";
    private final String FFMPEG_EXE = FFMPEG_DIR + File.separator + (isWindows() ? "ffmpeg.exe" : "ffmpeg");

    // ✅ Model
    private final String MODEL_URL =
            "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";
    private final String MODEL_NAME = "ggml-base.en.bin";

    // ✅ Latest binaries (fixed URL)
    private final String WIN_ZIP_URL =
    	    "https://github.com/ggml-org/whisper.cpp/releases/download/v1.8.1/whisper-bin-x64.zip";
 private final String LINUX_BIN_URL =
            "https://github.com/ggerganov/whisper.cpp/releases/latest/download/whisper-linux-x64";
    private final String MAC_BIN_URL =
            "https://github.com/ggerganov/whisper.cpp/releases/latest/download/whisper-macos-universal";

    // ✅ FFmpeg for Windows
    private final String FFMPEG_WIN_ZIP_URL =
            "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";

    @PostConstruct
    public void init() {
        System.out.println("\n🚀 Whisper + FFmpeg Auto Setup Starting...");

        try { Files.createDirectories(Path.of(BIN_DIR));   } catch(Exception ignored) {}
        try { Files.createDirectories(Path.of(MODEL_DIR)); } catch(Exception ignored) {}
        try { Files.createDirectories(Path.of(AUDIO_DIR)); } catch(Exception ignored) {}
        try { Files.createDirectories(Path.of(FFMPEG_DIR));} catch(Exception ignored) {}

        try { downloadModel(); } catch(Exception e){ System.out.println("⚠️ Model error: " + e.getMessage()); }
        try { setupBinary();  } catch(Exception e){ System.out.println("⚠️ Whisper binary error: " + e.getMessage()); }
        try { setupFFmpeg();  } catch(Exception e){ System.out.println("⚠️ FFmpeg error: " + e.getMessage()); }

        verifyInstallation();

        System.out.println("✅ Whisper & FFmpeg Ready at → " + BASE_DIR);
    }

    // ✅ Whisper model download
    private void downloadModel() throws Exception {
        File modelFile = new File(MODEL_DIR, MODEL_NAME);
        if(modelFile.exists()) {
            System.out.println("✔️ Whisper model exists");
            return;
        }
        System.out.println("⬇️ Downloading Whisper model...");
        downloadFileWithRetry(MODEL_URL, modelFile, 3);
        System.out.println("✅ Whisper model downloaded");
    }

    private void setupBinary() throws Exception {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) setupWindowsBinary();
        else if (os.contains("mac")) setupUnixBinary(MAC_BIN_URL, "whisper-cli");
        else setupUnixBinary(LINUX_BIN_URL, "whisper-cli");
    }

    private void setupWindowsBinary() throws Exception {
        File exeDir = new File(BIN_DIR);
        File exe = new File(BIN_DIR, "whisper-cli.exe");
        if(exe.exists()) {
            System.out.println("✔️ whisper-cli.exe exists");
            return;
        }
        System.out.println("⬇️ Downloading Whisper (Windows)...");
        File zip = new File(BIN_DIR, "whisper-win.zip");
        downloadFileWithRetry(WIN_ZIP_URL, zip, 3);
        extractWhisperCLI(zip, exeDir); // <- pass BIN_DIR as targetDir
        zip.delete();
        System.out.println("✅ whisper-cli.exe and DLLs installed");
    }


    private void extractWhisperCLI(File zipFile, File targetDir) throws Exception {
        // Use the targetDir as the extraction folder (BIN_DIR)
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                File outFile = new File(targetDir, entry.getName()); // targetDir = BIN_DIR
                if (entry.isDirectory()) {
                    outFile.mkdirs();
                    continue;
                }
                outFile.getParentFile().mkdirs();
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    byte[] buf = new byte[4096];
                    int len;
                    while ((len = zis.read(buf)) > 0) fos.write(buf, 0, len);
                }
                outFile.setExecutable(true, false);
            }
        }
    }


    private void setupUnixBinary(String url, String fileName) throws Exception {
        File bin = new File(BIN_DIR, fileName);
        if(bin.exists()) {
            System.out.println("✔️ whisper-cli exists");
            return;
        }
        System.out.println("⬇️ Downloading Whisper...");
        downloadFileWithRetry(url, bin, 3);
        bin.setExecutable(true, false);
        System.out.println("✅ whisper-cli installed");
    }

    private void setupFFmpeg() throws Exception {
        File f = new File(FFMPEG_EXE);
        if (f.exists()) {
            System.out.println("✔️ FFmpeg already installed");
            return;
        }

        System.out.println("⬇️ Downloading FFmpeg...");

        if (isWindows()) {
            File zipFile = new File(BASE_DIR, "ffmpeg.zip");
            downloadFileWithRetry(FFMPEG_WIN_ZIP_URL, zipFile, 3);
            unzipOnlyFFmpeg(zipFile, FFMPEG_DIR);
            zipFile.delete();
            System.out.println("✅ FFmpeg installed at: " + FFMPEG_EXE);
        } else {
            System.out.println("💡 Install FFmpeg manually: sudo apt install ffmpeg OR brew install ffmpeg");
        }
    }

    private void unzipOnlyFFmpeg(File zipFile, String targetDir) throws Exception {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.getName().endsWith("ffmpeg.exe")) {
                    File outFile = new File(targetDir, "ffmpeg.exe");
                    outFile.getParentFile().mkdirs();

                    try (FileOutputStream fos = new FileOutputStream(outFile)) {
                        byte[] buffer = new byte[4096];
                        int len;
                        while ((len = zis.read(buffer)) > 0) fos.write(buffer, 0, len);
                    }

                    outFile.setExecutable(true);
                    return;
                }
            }
        }
        throw new RuntimeException("❌ ffmpeg.exe not found in ZIP!");
    }

    private void downloadFileWithRetry(String url, File target, int retries) throws IOException {
        IOException last = null;
        for(int i=1;i<=retries;i++){
            try {
                System.out.println("➡️ Attempt " + i + ": " + url);
                download(url, target);
                return;
            } catch(IOException e) {
                last = e;
                System.out.println("⚠️ Retry " + i + " failed: " + e.getMessage());
            }
        }
        throw last;
    }

    private void download(String url, File output) throws IOException {
    	HttpURLConnection conn = (HttpURLConnection) URI.create(url).toURL().openConnection();

        conn.setConnectTimeout(20000);
        conn.setReadTimeout(60000);
        conn.setInstanceFollowRedirects(true);

        int code = conn.getResponseCode();
        if(code >= 400)
            throw new IOException("HTTP " + code + " for " + url);

        try (InputStream in = conn.getInputStream(); FileOutputStream fos = new FileOutputStream(output)) {
            byte[] buffer = new byte[8192];
            int bytes;
            while ((bytes = in.read(buffer)) != -1) fos.write(buffer, 0, bytes);
        }
    }

 // ✅ Verification step
    private void verifyInstallation() {
        System.out.println("\n🔍 Verifying installation...");

        File whisperExe = getWhisperExecutablePath();
        verifyCommand(whisperExe, "🧠 whisper-cli");
        verifyCommand(new File(FFMPEG_EXE), "🎬 FFmpeg");
    }

    /** 
     * Returns the actual path of whisper-cli.exe after extraction on Windows
     */
    private File getWhisperExecutablePath() {
        if (isWindows()) {
            File releaseDir = new File(BIN_DIR, "Release");
            File exe = new File(releaseDir, "whisper-cli.exe");
            if (exe.exists()) return exe;

            // fallback: check directly in BIN_DIR
            exe = new File(BIN_DIR, "whisper-cli.exe");
            if (exe.exists()) return exe;

            return exe; // will fail verification if not found
        } else {
            return new File(BIN_DIR, "whisper-cli");
        }
    }

    private void verifyCommand(File executable, String name) {
        if (!executable.exists()) {
            System.out.println("❌ " + name + " missing: " + executable.getAbsolutePath());
            return;
        }

        try {
            ProcessBuilder pb = new ProcessBuilder(executable.getAbsolutePath(), "-version");
            pb.redirectErrorStream(true);
            Process p = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.isBlank()) {
                    System.out.println(name + " verified → " + line);
                }
            }
            p.waitFor();
        } catch (Exception e) {
            System.out.println("❌ " + name + " verification failed: " + e.getMessage());
        }
    }

    private boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("win");
    }

}
