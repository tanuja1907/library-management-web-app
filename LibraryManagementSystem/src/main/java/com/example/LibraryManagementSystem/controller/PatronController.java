package com.example.LibraryManagementSystem.controller;


import com.example.LibraryManagementSystem.entity.Patron;
import com.example.LibraryManagementSystem.service.PatronService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patron")
public class PatronController {


    @Autowired
    private PatronService patronService;

    @PostMapping
    public ResponseEntity<Patron> addPatron(@RequestBody Patron patron) {
        return ResponseEntity.ok(patronService.addPatron(patron));
    }

    @GetMapping
    public ResponseEntity<List<Patron>> getAllPatrons() {
        return ResponseEntity.ok(patronService.getAllPatrons());
    }

    @DeleteMapping("/{patronId}")
    public ResponseEntity<String> deletePatronById(@PathVariable int patronId){
        boolean patron=patronService.deletePatronById(patronId);
        if(patron){
            return ResponseEntity.ok("Patron Deleted successfully");
        }else{
            return ResponseEntity.ok("Patron id doesn't exist");
        }
    }
}
