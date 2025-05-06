package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.Patron;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PatronRepository extends JpaRepository<Patron, Integer> {
    List<Patron> findByNameContainingIgnoreCase(String searctTerm);

    Optional<Patron> findByName(String name);

    boolean existsByNameAndIdNot(String name, int id);
}
