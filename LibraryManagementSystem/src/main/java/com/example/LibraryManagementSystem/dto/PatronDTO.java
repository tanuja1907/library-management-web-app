package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class PatronDTO {
    private int patronId;
    private String name;

    public PatronDTO(int patronId, String name) {
        this.patronId = patronId;
        this.name = name;
    }
}
