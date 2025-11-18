package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPersonalInfoDto {
    private Long userId;
    private String firstName;      // From User
    private String lastName;       // From User
    private String mobileNumber; 
    private String email;        // From User
    private String gender;
    private LocalDate dateOfBirth;
    private String parentMobileNumber;
    private String bloodGroup;
    private String profilePicturePath;
}
