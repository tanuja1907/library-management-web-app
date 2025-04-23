package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class BookUpdateDTO {
     private String title;
     private String author;
     private Integer availableCopies;
}
