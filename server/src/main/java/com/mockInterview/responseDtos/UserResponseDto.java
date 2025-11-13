package com.mockInterview.responseDtos;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor 
@NoArgsConstructor
public class UserResponseDto {
   private long userId;
   private String firstName;
   private String lastName;
   private String email;
   private String phone;
   private String role;
   private String status;
   private String profilePicturePath;
   
}
