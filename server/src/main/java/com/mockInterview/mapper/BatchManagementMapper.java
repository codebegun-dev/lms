package com.mockInterview.mapper;

import com.mockInterview.entity.BatchManagement;
import com.mockInterview.entity.CourseManagement;
import com.mockInterview.responseDtos.BatchManagementDto;

public class BatchManagementMapper {

    public static BatchManagement fromDto(BatchManagementDto dto, CourseManagement course) {
        BatchManagement batch = new BatchManagement();
        batch.setName(dto.getName());
        batch.setCourse(course);
        batch.setSize(dto.getSize());
        batch.setStartDate(dto.getStartDate());
        batch.setEndDate(dto.getEndDate());
        batch.setStartTime(dto.getStartTime());
        batch.setEndTime(dto.getEndTime());
        batch.setTotalFee(dto.getTotalFee());
        batch.setOverallCTC(dto.getOverallCTC());
        batch.setSingleInstallment(dto.getSingleInstallment());
        batch.setCtcSingle(dto.getCtcSingle());
        batch.setFirstInstallment(dto.getFirstInstallment());
        batch.setSecondInstallment(dto.getSecondInstallment());
        batch.setCtcDual(dto.getCtcDual());

        batch.setStatus("PENDING"); // default PENDING

        return batch;
    }

    public static BatchManagementDto toDto(BatchManagement batch) {
        BatchManagementDto dto = new BatchManagementDto();
        dto.setId(batch.getId());
        dto.setName(batch.getName());
        dto.setCourseName(batch.getCourse() != null ? batch.getCourse().getCourseName() : null);
        dto.setSize(batch.getSize());
        dto.setStartDate(batch.getStartDate());
        dto.setEndDate(batch.getEndDate());
        dto.setStartTime(batch.getStartTime());
        dto.setEndTime(batch.getEndTime());
        dto.setTotalFee(batch.getTotalFee());
        dto.setOverallCTC(batch.getOverallCTC());
        dto.setSingleInstallment(batch.getSingleInstallment());
        dto.setCtcSingle(batch.getCtcSingle());
        dto.setFirstInstallment(batch.getFirstInstallment());
        dto.setSecondInstallment(batch.getSecondInstallment());
        dto.setCtcDual(batch.getCtcDual());
        // Status is not sent in DTO
        return dto;
    }
}
