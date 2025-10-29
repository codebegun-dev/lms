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
import java.util.Optional;

@Service
public class BatchManagementServiceImpl implements BatchManagementService {

    @Autowired
    private BatchManagementRepository batchRepo;

    @Autowired
    private CourseManagementRepository courseRepo;

   @Override
    public BatchManagementDto createBatch(BatchManagementDto batchDto) {
        // Check if batch name already exists
        if (batchRepo.existsByName(batchDto.getName())) {
            throw new DuplicateFieldException("already exists!");
        }

        Optional<CourseManagement> optionalCourse = courseRepo.findByCourseName(batchDto.getCourseName());

        if (!optionalCourse.isPresent()) {
            throw new ResourceNotFoundException("Course not found with name: " + batchDto.getCourseName());
        }
 
        CourseManagement course = optionalCourse.get();

        BatchManagement batch = BatchManagementMapper.fromDto(batchDto, course);
        batch.setStatus("PENDING"); // default status
        batchRepo.save(batch);

        BatchManagementDto savedDto = BatchManagementMapper.toDto(batch);
        savedDto.setCourseName(course.getCourseName());
        return savedDto;
    }


    @Override
    public BatchManagementDto getBatchById(Long batchId) {
        Optional<BatchManagement> batchOpt = batchRepo.findById(batchId);
        if (batchOpt.isEmpty()) {
            throw new RuntimeException("Batch not found with ID: " + batchId);
        }
        BatchManagement batch = batchOpt.get();
        BatchManagementDto dto = BatchManagementMapper.toDto(batch);
        if (batch.getCourse() != null) {
            dto.setCourseName(batch.getCourse().getCourseName());
        }
        return dto;
    }

    @Override
    public List<BatchManagementDto> getAllBatches() {
        List<BatchManagement> batches = batchRepo.findAll();
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement batch : batches) {
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
    	// Find batch by ID
    	Optional<BatchManagement> batchOpt = batchRepo.findById(batchId);
    	if (!batchOpt.isPresent()) {
    	    throw new RuntimeException("Batch not found with ID: " + batchId);
    	}
    	BatchManagement batch = batchOpt.get();

    	// Find course by name
    	Optional<CourseManagement> courseOpt = courseRepo.findByCourseName(batchDto.getCourseName());
    	if (!courseOpt.isPresent()) {
    	    throw new RuntimeException("Course not found with name: " + batchDto.getCourseName());
    	}
    	CourseManagement course = courseOpt.get();


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

        // Status is NOT updated manually here; scheduler will handle transitions
        batchRepo.save(batch);

        BatchManagementDto updatedDto = BatchManagementMapper.toDto(batch);
        updatedDto.setCourseName(course.getCourseName());
        return updatedDto;
    }

    @Override
    public void deleteBatch(Long batchId) {
        if (!batchRepo.existsById(batchId)) {
            throw new RuntimeException("Batch not found with ID: " + batchId);
        }
        batchRepo.deleteById(batchId);
    }

    @Override
    public List<BatchManagementDto> getBatchesByStatus(String status) {
        List<BatchManagement> batches = batchRepo.findByStatus(status);
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batches) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) dto.setCourseName(b.getCourse().getCourseName());
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<BatchManagementDto> getUpcomingBatches() {
        LocalDate today = LocalDate.now();
        List<BatchManagement> batches = batchRepo.findByStatusAndStartDateGreaterThanEqual("PENDING", today);
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batches) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) dto.setCourseName(b.getCourse().getCourseName());
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<BatchManagementDto> getActiveBatches() {
        LocalDate today = LocalDate.now();
        List<BatchManagement> batches = batchRepo
                .findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual("ACTIVE", today, today);
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batches) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) dto.setCourseName(b.getCourse().getCourseName());
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<BatchManagementDto> getCompletedBatches() {
        LocalDate today = LocalDate.now();
        List<BatchManagement> batches = batchRepo.findByStatusAndEndDateLessThanEqual("COMPLETED", today);
        List<BatchManagementDto> dtos = new ArrayList<>();
        for (BatchManagement b : batches) {
            BatchManagementDto dto = BatchManagementMapper.toDto(b);
            if (b.getCourse() != null) dto.setCourseName(b.getCourse().getCourseName());
            dtos.add(dto);
        }
        return dtos;
    }
}
