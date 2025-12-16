package com.mockInterview.mapper;

import com.mockInterview.entity.BatchManagement;
import com.mockInterview.entity.CourseManagement;
import com.mockInterview.responseDtos.BatchManagementDto;

public class BatchManagementMapper {

    // ✅ Convert DTO to Entity
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

        batch.setStatus("PENDING"); // lifecycle status
        batch.setEnable(dto.getEnable() != null ? dto.getEnable() : true); // ✅ default true if null

        return batch;
    }

    // ✅ Convert Entity to DTO
    public static BatchManagementDto toDto(BatchManagement batch) {
        BatchManagementDto dto = new BatchManagementDto();
        dto.setId(batch.getId());
        dto.setName(batch.getName());
        dto.setCourseId(batch.getCourse() != null ? batch.getCourse().getCourseId() : null); // ✅ only courseId
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
        dto.setEnable(batch.getEnable()); // ✅ include enable status

        return dto;
    }
}
