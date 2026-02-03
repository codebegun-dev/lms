//package com.mockInterview.requestDtos;
//
//import com.fasterxml.jackson.annotation.JsonFormat;
//import jakarta.validation.constraints.Pattern;
//import jakarta.validation.constraints.Past;
//import jakarta.validation.constraints.Size;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Data
//public class StudentPersonalInfoUpdateRequest {
//
//    // ---------- BASIC INFO (Student Profile) ----------
//    @Size(min = 3, max = 30, message = "First name must be between 3 and 30 characters")
//    private String firstName;
//
//    @Size(min = 3, max = 30, message = "Last name must be between 3 and 30 characters")
//    private String lastName;
//
//    // ---------- CONTACT INFO (User) ----------
//    @Pattern(
//        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
//        message = "Invalid email format"
//    )
//    private String email;
//
//    @Pattern(
//        regexp = "^[0-9]{10}$",
//        message = "Phone number must be 10 digits"
//    )
//    private String phone;
//
//    // ---------- PERSONAL INFO ----------
//    @Pattern(
//        regexp = "Male|Female|Other",
//        message = "Gender must be Male, Female, or Other"
//    )
//    private String gender;
//
//    @Past(message = "Date of birth must be in the past")
//    @JsonFormat(pattern = "yyyy-MM-dd")
//    private LocalDate dateOfBirth;
//
//    @Pattern(
//        regexp = "^[0-9]{10}$",
//        message = "Parent mobile number must be 10 digits"
//    )
//    private String parentMobileNumber;
//
//    @Pattern(
//        regexp = "A\\+|A\\-|B\\+|B\\-|O\\+|O\\-|AB\\+|AB\\-",
//        message = "Invalid blood group"
//    )
//    private String bloodGroup;
//}

package com.mockInterview.requestDtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentPersonalInfoUpdateRequest {

    // ---------- BASIC INFO (User) ----------

    @Size(max = 30, message = "First name cannot exceed 30 characters")
    private String firstName;

    @Size(max = 30, message = "Last name cannot exceed 30 characters")
    private String lastName;

    // ---------- CONTACT INFO (User) ----------

    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
        message = "Invalid email format"
    )
    private String email;

    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Phone number must be exactly 10 digits"
    )
    private String phone;

    // ---------- PERSONAL INFO (StudentPersonalInfo) ----------

    @Pattern(
        regexp = "Male|Female|Other",
        message = "Gender must be Male, Female, or Other"
    )
    private String gender;

    @Past(message = "Date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Parent mobile number must be exactly 10 digits"
    )
    private String parentMobileNumber;

    @Pattern(
        regexp = "A\\+|A\\-|B\\+|B\\-|O\\+|O\\-|AB\\+|AB\\-",
        message = "Invalid blood group"
    )
    private String bloodGroup;
}

