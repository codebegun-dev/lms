package com.mockInterview.entity;



import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "role_module_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleModulePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private com.mockInterview.entity.Module module;

    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
