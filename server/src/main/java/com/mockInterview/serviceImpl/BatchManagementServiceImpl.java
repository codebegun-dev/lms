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

        CourseManagement course = courseRepo.findById(batchDto.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with ID: " + batchDto.getCourseId()));

        if (batchRepo.existsByName(batchDto.getName())) {
            throw new DuplicateFieldException("Batch name already exists!");
        }

        BatchManagement batch = BatchManagementMapper.fromDto(batchDto, course);
        batch.setStatus("PENDING");

        batchRepo.save(batch);

        return BatchManagementMapper.toDto(batch);
    }

    @Override
    public BatchManagementDto updateBatch(Long batchId, BatchManagementDto batchDto) {

        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));
        if (!batch.getEnable()) {
            throw new IllegalStateException("Cannot update a disabled batch. Enable it first.");
        }

        if (!batch.getName().equals(batchDto.getName()) && batchRepo.existsByName(batchDto.getName())) {
            throw new DuplicateFieldException("Batch name already exists!");
        }

        CourseManagement course = courseRepo.findById(batchDto.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with ID: " + batchDto.getCourseId()));

        batch.setName(batchDto.getName());
        batch.setCourse(course);
        batch.setSize(batchDto.getSize());
        batch.setStartDate(batchDto.getStartDate());
        batch.setEndDate(batchDto.getEndDate());
        batch.setStartTime(batchDto.getStartTime());
        batch.setEndTime(batchDto.getEndTime());
        batch.setTotalFee(batchDto.getTotalFee());
        batch.setOverallCTC(batchDto.getOverallCTC());
        batch.setSingleInstallment(batchDto.getSingleInstallment());
        batch.setCtcSingle(batchDto.getCtcSingle());
        batch.setFirstInstallment(batchDto.getFirstInstallment());
        batch.setSecondInstallment(batchDto.getSecondInstallment());
        batch.setCtcDual(batchDto.getCtcDual());

        batchRepo.save(batch);

        return BatchManagementMapper.toDto(batch);
    }


    @Override
    public BatchManagementDto getBatchById(Long batchId) {
        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));

        return BatchManagementMapper.toDto(batch);
    }

    @Override
    public List<BatchManagementDto> getAllBatches() {
        List<BatchManagementDto> dtos = new ArrayList<>();

        for (BatchManagement batch : batchRepo.findAllByOrderByEnableDesc()) {
            BatchManagementDto dto = BatchManagementMapper.toDto(batch);
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<BatchManagementDto> getBatchesByStatus(String status) {
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batchRepo.findByStatus(status)) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
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
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public BatchManagementDto changeBatchEnableStatus(Long batchId, boolean enable) {
        BatchManagement batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Batch not found with ID: " + batchId));

        batch.setEnable(enable);
        batchRepo.save(batch);

        return BatchManagementMapper.toDto(batch);
    }

}
