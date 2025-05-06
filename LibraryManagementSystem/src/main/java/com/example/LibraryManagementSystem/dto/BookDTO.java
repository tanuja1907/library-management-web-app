package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class BookDTO {
    private int id;
    private String title;
    private String author;
    private int availableCopies;

    public BookDTO(int id, String title, String author, int availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.availableCopies = availableCopies;
    }
}
