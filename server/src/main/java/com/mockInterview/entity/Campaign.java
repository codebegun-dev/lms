package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    @Column(nullable = false, unique = true)
    private String campaignName;

    
}
