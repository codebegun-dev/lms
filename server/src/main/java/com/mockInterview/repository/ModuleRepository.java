package com.mockInterview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Module;



public interface ModuleRepository extends JpaRepository<Module, Long> {

    Module findByName(String name);

    boolean existsByName(String name);
}
