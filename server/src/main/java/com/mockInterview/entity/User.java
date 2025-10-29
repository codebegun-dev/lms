package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @NotNull
    @Size(min = 3, max = 30)
    private String firstName;

    @NotNull
    @Size(min = 3, max = 30)
    private String lastName;

    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
    private String email;

    @NotNull
    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @NotNull
    @Size(min = 8, message = "Password must be at least 8 characters")
	@Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$", 
	message = "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long")
	private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String resetToken;
    
    public String getName() {
        return firstName + " " + lastName;
    }

}
