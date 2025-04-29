package com.example.LibraryManagementSystem.controller;


import com.example.LibraryManagementSystem.dto.PatronDTO;
import com.example.LibraryManagementSystem.entity.Patron;
import com.example.LibraryManagementSystem.service.PatronService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<Object> getAllPatrons() {
        List<Patron> patrons=patronService.getAllPatrons();
        if(patrons==null || patrons.isEmpty()){
            return ResponseEntity.ok("No patron added yet");
        }
        return ResponseEntity.ok(patrons);
    }

    @DeleteMapping("/{patronId}")
    public ResponseEntity<String> deletePatronById(@PathVariable int patronId){
        boolean patron=patronService.deletePatronById(patronId);
        if(patron){
            return ResponseEntity.ok("Patron Deleted successfully");
        }else{
            return ResponseEntity.ok("Patron borrow book ,cannot be deleted");
        }
    }

    @GetMapping("/{patronId}")
    public ResponseEntity<Object> getPatronById(@PathVariable int patronId){
        Patron patron =patronService.getPatronById(patronId);
        if(patron!=null){
            return ResponseEntity.ok(patron);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("Error!!!","Patron with id:"+patronId+" not found"));
        }

    }

    @GetMapping("/search")
    public  ResponseEntity<Object> searchPatron(@RequestParam String pattern){
        List<Patron> patrons=patronService.searchPatron(pattern);
        if(patrons==null || patrons.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Such Patrons Found");
        }
        return ResponseEntity.ok(patrons);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updatePatronById(@PathVariable int id, @RequestBody PatronDTO patronDTO){
        PatronDTO update=patronService.updatePatron(id,patronDTO);

            return ResponseEntity.ok("Patron updated Successfully");

    }
}
