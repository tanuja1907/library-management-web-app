package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.PatronDTO;
import com.example.LibraryManagementSystem.entity.Patron;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import com.example.LibraryManagementSystem.repository.PatronRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatronService {
    @Autowired
    private PatronRepository patronRepository;

    public Patron addPatron(Patron patron) {
        Optional<Patron> findPatron = patronRepository.findByName(patron.getName());
        if (findPatron.isEmpty()) {
            return patronRepository.save(patron);
        } else throw new RuntimeException("Patron already exist");
    }

    public List<Patron> getAllPatrons() {
        return patronRepository.findAll();
    }

    public boolean deletePatronById(int patronId) {
        Patron patron = patronRepository.findById(patronId).orElseThrow(() -> new ResourceNotFoundException("No patron found by id: " + patronId));
        if (patron.getBorrowedBooks() != null && !patron.getBorrowedBooks().isEmpty()) {
            throw new IllegalStateException("Cannot delete patron who has borrowed books");
        }
        patronRepository.delete(patron);
        return true;
    }

    public Patron getPatronById(int patronId) {
        Optional<Patron> findPatron = patronRepository.findById(patronId);
        if (findPatron.isPresent()) {
            return findPatron.get();
        } else {
            throw new ResourceNotFoundException("No patron found with id: " + patronId);
        }
    }

    public List<Patron> searchPatron(String searchPattern) {
        return patronRepository.findByNameContainingIgnoreCase(searchPattern);
    }

    public PatronDTO updatePatron(int id, PatronDTO patronDTO) {
        Patron patron = patronRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No patron found with id: " + id));
        if (patronRepository.existsByNameAndIdNot(patronDTO.getName(), id)) {
            throw new DuplicateEntryException("Another patron with the same name already exist");
        }
        if (patronDTO.getName() != null) patron.setName(patronDTO.getName());
        if (patronDTO.getAge() != null) patron.setAge(patronDTO.getAge());
        if (patronDTO.getProfession() != null) patron.setProfession(patronDTO.getProfession());
        patronRepository.save(patron);
        return new PatronDTO(patron.getId(), patron.getName(), patron.getAge(), patron.getProfession());
    }
}
