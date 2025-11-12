package com.mockInterview.requestDtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
@Data
@Getter
@Setter
public class AdminPersonalInfoUpdateRequestDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String gender;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    private String bloodGroup;
}
