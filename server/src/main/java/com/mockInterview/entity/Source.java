package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sourceId;

    @Column(nullable = false, unique = true)
    private String sourceName;

   
}
