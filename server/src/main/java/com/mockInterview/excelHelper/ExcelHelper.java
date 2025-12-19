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
        List<SalesCourseManagementRequestDto> leadList = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // first sheet
            Iterator<Row> rows = sheet.iterator();

            boolean firstRow = true;
            while (rows.hasNext()) {
                Row row = rows.next();

                if (firstRow) { // skip header
                    firstRow = false;
                    continue;
                }

                SalesCourseManagementRequestDto dto = new SalesCourseManagementRequestDto();

                dto.setLeadName(getCellValueAsString(row.getCell(0)));
                dto.setPhone(getCellValueAsString(row.getCell(1)));
                dto.setEmail(getCellValueAsString(row.getCell(2)));
                dto.setGender(getCellValueAsString(row.getCell(3)));
                dto.setPassedOutYear(getCellValueAsString(row.getCell(4)));
                dto.setQualification(getCellValueAsString(row.getCell(5)));

                String courseId = getCellValueAsString(row.getCell(6));
                if (courseId != null && !courseId.isEmpty()) {
                    dto.setCourseId(Long.parseLong(courseId));
                }

                String status = getCellValueAsString(row.getCell(7));
                dto.setStatus(status != null && !status.isEmpty() ? status : "NEW");

                leadList.add(dto);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage(), e);
        }

        return leadList;
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) return cell.getDateCellValue().toString();
                double d = cell.getNumericCellValue();
                return d == (long)d ? String.valueOf((long)d) : String.valueOf(d);
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            case BLANK: return null;
            default: return null;
        }
    }
}
