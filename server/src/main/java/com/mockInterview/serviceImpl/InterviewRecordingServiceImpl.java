package com.mockInterview.serviceImpl;

import com.mockInterview.entity.InterviewRecording;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.InterviewRecordingRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.responseDtos.InterviewRecordingResponseDto;
import com.mockInterview.service.InterviewRecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewRecordingServiceImpl implements InterviewRecordingService {

    @Autowired
    private InterviewRecordingRepository recordingRepository;

    @Autowired
    private StudentInterviewRepository interviewRepository;

   

    private final String uploadDir = System.getProperty("user.dir") + File.separator + 
            "uploads" + File.separator + "interview_files" + File.separator;

@Override
@Transactional
public InterviewRecordingResponseDto saveRecording(Long interviewId,
                              MultipartFile videoAudioFile,
                              MultipartFile audioFile,
                              MultipartFile textFile) {

// ------------------- Check mandatory files -------------------
if (videoAudioFile == null || videoAudioFile.isEmpty() ||
audioFile == null || audioFile.isEmpty() ||
textFile == null || textFile.isEmpty()) {
throw new RuntimeException("All files (video/audio, audio, text) must be uploaded.");
}

Optional<StudentInterview> optInterview = interviewRepository.findById(interviewId);
if (!optInterview.isPresent()) {
throw new ResourceNotFoundException("Interview not found with ID: " + interviewId);
}
StudentInterview interview = optInterview.get();

// Temporary file holders
File tempVideo = null, tempAudio = null, tempText = null;

try {
// ------------------- Ensure directory exists -------------------
File dir = new File(uploadDir);
if (!dir.exists() && !dir.mkdirs()) {
throw new RuntimeException("Could not create upload directory: " + uploadDir);
}

// ------------------- Save temporary files -------------------
tempVideo = File.createTempFile("video_audio_" + interviewId + "_", ".tmp");
videoAudioFile.transferTo(tempVideo);

tempAudio = File.createTempFile("audio_" + interviewId + "_", ".tmp");
audioFile.transferTo(tempAudio);

tempText = File.createTempFile("text_" + interviewId + "_", ".tmp");
textFile.transferTo(tempText);

// ------------------- Move to final location -------------------
String videoPath = uploadDir + "video_audio_" + interviewId + "_" + 
      Paths.get(videoAudioFile.getOriginalFilename()).getFileName().toString();
String audioPath = uploadDir + "audio_" + interviewId + "_" + 
      Paths.get(audioFile.getOriginalFilename()).getFileName().toString();
String textPath = uploadDir + "text_" + interviewId + "_" + 
     Paths.get(textFile.getOriginalFilename()).getFileName().toString();

// Move files atomically
tempVideo.renameTo(new File(videoPath));
tempAudio.renameTo(new File(audioPath));
tempText.renameTo(new File(textPath));

// ------------------- Save record in DB -------------------
InterviewRecording recording = new InterviewRecording();
recording.setInterview(interview);
recording.setUserId(interview.getStudent().getUserId());
recording.setVideoAudioFilePath(videoPath);
recording.setAudioFilePath(audioPath);
recording.setTextFilePath(textPath);
recording.setUploadedAt(LocalDateTime.now());

InterviewRecording saved = recordingRepository.save(recording);

// ------------------- Convert to DTO -------------------
InterviewRecordingResponseDto dto = new InterviewRecordingResponseDto();
dto.setRecordingId(saved.getId());
dto.setInterviewId(saved.getInterview().getId());
dto.setUserId(saved.getUserId());
dto.setVideoFilePath(saved.getVideoAudioFilePath());
dto.setAudioFilePath(saved.getAudioFilePath());
dto.setTextFilePath(saved.getTextFilePath());
dto.setUploadedAt(saved.getUploadedAt());

return dto;

} catch (IOException e) {
// Cleanup any temp files if something fails
if (tempVideo != null && tempVideo.exists()) tempVideo.delete();
if (tempAudio != null && tempAudio.exists()) tempAudio.delete();
if (tempText != null && tempText.exists()) tempText.delete();

throw new RuntimeException("Failed to save interview recording files: " + e.getMessage(), e);
}
}
    @Override
    public List<InterviewRecordingResponseDto> getRecordingsByInterview(Long interviewId) {
        List<InterviewRecording> recordings = recordingRepository.findByInterviewId(interviewId);

        if (recordings.isEmpty()) {
            throw new ResourceNotFoundException("No recordings found for interview ID: " + interviewId);
        }

        return mapToDtoList(recordings);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewRecordingResponseDto> getRecordingsByUser(Long userId) {
        List<InterviewRecording> recordings = recordingRepository.findByUserId(userId);

        if (recordings.isEmpty()) {
            throw new ResourceNotFoundException("No recordings found for user ID: " + userId);
        }

        return mapToDtoList(recordings);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewRecordingResponseDto> getRecordingsByInterviewAndUser(Long interviewId, Long userId) {
        List<InterviewRecording> recordings = recordingRepository.findByInterviewIdAndUserId(interviewId, userId);

        if (recordings.isEmpty()) {
            throw new ResourceNotFoundException(
                "No recordings found for interview ID: " + interviewId + " and user ID: " + userId
            );
        }

        return mapToDtoList(recordings);
    }

    private List<InterviewRecordingResponseDto> mapToDtoList(List<InterviewRecording> recordings) {
        List<InterviewRecordingResponseDto> result = new ArrayList<>();
        for (InterviewRecording r : recordings) {
            InterviewRecordingResponseDto dto = new InterviewRecordingResponseDto();
            dto.setRecordingId(r.getId());
            dto.setUserId(r.getUserId());
            dto.setInterviewId(r.getInterview().getId());
            dto.setVideoFilePath(r.getVideoAudioFilePath());
            dto.setAudioFilePath(r.getAudioFilePath());
            dto.setTextFilePath(r.getTextFilePath());
            dto.setUploadedAt(r.getUploadedAt());
            result.add(dto);
        }
        return result;
    }

   

}
