package com.mockInterview.serviceImpl;

import com.mockInterview.entity.BatchManagement;
import com.mockInterview.entity.CourseManagement;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.BatchManagementMapper;
import com.mockInterview.repository.BatchManagementRepository;
import com.mockInterview.repository.CourseManagementRepository;
import com.mockInterview.responseDtos.BatchManagementDto;
import com.mockInterview.service.BatchManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class BatchManagementServiceImpl implements BatchManagementService {

    @Autowired
    private BatchManagementRepository batchRepo;

    @Autowired
    private CourseManagementRepository courseRepo;

    @Override
    public BatchManagementDto createBatch(BatchManagementDto batchDto) {

        if (batchRepo.existsByName(batchDto.getName())) {
            throw new DuplicateFieldException("Batch name already exists!");
        }

        CourseManagement course = courseRepo.findByCourseName(batchDto.getCourseName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with name: " + batchDto.getCourseName()));

        BatchManagement batch = BatchManagementMapper.fromDto(batchDto, course);
        batch.setStatus("PENDING");

        batchRepo.save(batch);

        BatchManagementDto dto = BatchManagementMapper.toDto(batch);
        dto.setCourseName(course.getCourseName());
        return dto;
    }

    @Override
    public BatchManagementDto getBatchById(Long batchId) {
        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));

        BatchManagementDto dto = BatchManagementMapper.toDto(batch);
        if (batch.getCourse() != null) {
            dto.setCourseName(batch.getCourse().getCourseName());
        }
        return dto;
    }

    @Override
    public List<BatchManagementDto> getAllBatches() {
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement batch : batchRepo.findAll()) {
            BatchManagementDto dto = BatchManagementMapper.toDto(batch);
            if (batch.getCourse() != null) {
                dto.setCourseName(batch.getCourse().getCourseName());
            }
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public BatchManagementDto updateBatch(Long batchId, BatchManagementDto batchDto) {

        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));

        // Duplicate name check (if name changed)
        if (!batch.getName().equals(batchDto.getName())
                && batchRepo.existsByName(batchDto.getName())) {
            throw new DuplicateFieldException("Batch name already exists!");
        }

        CourseManagement course = courseRepo.findByCourseName(batchDto.getCourseName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with name: " + batchDto.getCourseName()));

        batch.setName(batchDto.getName());
        batch.setCourse(course);
        batch.setSize(batchDto.getSize());
        batch.setStartDate(batchDto.getStartDate());
        batch.setStartTime(batchDto.getStartTime());
        batch.setEndDate(batchDto.getEndDate());
        batch.setEndTime(batchDto.getEndTime());
        batch.setTotalFee(batchDto.getTotalFee());
        batch.setOverallCTC(batchDto.getOverallCTC());
        batch.setSingleInstallment(batchDto.getSingleInstallment());
        batch.setCtcSingle(batchDto.getCtcSingle());
        batch.setFirstInstallment(batchDto.getFirstInstallment());
        batch.setSecondInstallment(batchDto.getSecondInstallment());
        batch.setCtcDual(batchDto.getCtcDual());

        batchRepo.save(batch);

        BatchManagementDto dto = BatchManagementMapper.toDto(batch);
        dto.setCourseName(course.getCourseName());
        return dto;
    }

    @Override
    public void deleteBatch(Long batchId) {
        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));
        batchRepo.delete(batch);
    }

    @Override
    public List<BatchManagementDto> getBatchesByStatus(String status) {
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batchRepo.findByStatus(status)) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) {
                dto.setCourseName(b.getCourse().getCourseName());
            }
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<BatchManagementDto> getUpcomingBatches() {
        LocalDate today = LocalDate.now();
        return mapList(batchRepo.findByStatusAndStartDateGreaterThanEqual("PENDING", today));
    }

    @Override
    public List<BatchManagementDto> getActiveBatches() {
        LocalDate today = LocalDate.now();
        return mapList(
                batchRepo.findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        "ACTIVE", today, today));
    }

    @Override
    public List<BatchManagementDto> getCompletedBatches() {
        LocalDate today = LocalDate.now();
        return mapList(batchRepo.findByStatusAndEndDateLessThanEqual("COMPLETED", today));
    }

    // 🔹 Common mapper
    private List<BatchManagementDto> mapList(List<BatchManagement> batches) {
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batches) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) {
                dto.setCourseName(b.getCourse().getCourseName());
            }
            dtos.add(dto);
        }
        return dtos;
    }
}
