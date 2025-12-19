package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResponseDto {

    private int totalRows;
    private int successCount;
    private int failedCount;
    private List<RowError> errors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RowError {
        private int rowNumber;
        private String message;
    }
}
