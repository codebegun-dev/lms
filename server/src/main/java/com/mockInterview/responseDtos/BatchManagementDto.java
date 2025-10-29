package com.mockInterview.responseDtos;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BatchManagementDto {

    private Long id;

    @NotBlank(message = "Batch name is required")
    private String name;

    @NotNull(message = "Associated course is required")
    @Column(nullable = false, unique = true)
    private String courseName;

    @Min(value = 1, message = "Batch size must be at least 1")
    private Integer size;

    @NotNull(message = "Start date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @NotNull(message = "Start time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @PositiveOrZero(message = "Total fee must be zero or positive")
    private Double totalFee;

    private String overallCTC = "0%";

    @PositiveOrZero(message = "Single installment must be zero or positive")
    private Double singleInstallment;

    private String ctcSingle;

    @PositiveOrZero(message = "First installment must be zero or positive")
    private Double firstInstallment;

    @PositiveOrZero(message = "Second installment must be zero or positive")
    private Double secondInstallment;

    private String ctcDual;

}
