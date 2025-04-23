package com.example.LibraryManagementSystem.dto;


import lombok.Data;

@Data
public class BorrowRequestDTO {
    private int bookId;
    private int patronId;


}
