package com.mockInterview.excelHelper;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {

    public static List<SalesCourseManagementRequestDto> parseExcelFile(MultipartFile file) {
        List<SalesCourseManagementRequestDto> studentList = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // first sheet
            Iterator<Row> rows = sheet.iterator();

            boolean firstRow = true;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header row
                if (firstRow) {
                    firstRow = false;
                    continue;
                }

                SalesCourseManagementRequestDto dto = new SalesCourseManagementRequestDto();

                dto.setStudentName(getCellValueAsString(currentRow.getCell(0)));
                dto.setPhone(getCellValueAsString(currentRow.getCell(1)));
                dto.setEmail(getCellValueAsString(currentRow.getCell(2)));
                dto.setGender(getCellValueAsString(currentRow.getCell(3)));
                dto.setPassedOutYear(getCellValueAsString(currentRow.getCell(4)));
                dto.setQualification(getCellValueAsString(currentRow.getCell(5)));

                String courseId = getCellValueAsString(currentRow.getCell(6));
                if (courseId != null && !courseId.isEmpty()) {
                    dto.setCourseId(Long.parseLong(courseId));
                }

                String status = getCellValueAsString(currentRow.getCell(7));
                if (status != null && !status.isEmpty()) {
                    dto.setStatus(status);
                } else {
                    dto.setStatus("NEW"); // default value
                }

                studentList.add(dto); 
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }

        return studentList;
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    double d = cell.getNumericCellValue();
                    if (d == (long) d) {
                        return String.valueOf((long) d);
                    } else {
                        return String.valueOf(d);
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return null;
            default:
                return null;
        }
    }
}
