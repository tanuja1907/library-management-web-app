package com.example.LibraryManagementSystem.dto;

import com.example.LibraryManagementSystem.entity.Patron;
import lombok.Data;

import java.util.List;

@Data
public class BorrowedBookResponseDTO {
    private int bookId;
    private String title;
    private int copiesAvailable;
    private List<PatronInfo> patron;

    public BorrowedBookResponseDTO(int bookId, String title, int copiesAvailable, List<PatronInfo> patron) {
        this.bookId = bookId;
        this.title = title;
        this.copiesAvailable = copiesAvailable;
        this.patron = patron;
    }

    public static class PatronInfo {
        private int patronId;
        private String name;

        public PatronInfo(int patronId, String patronName) {
            this.patronId = patronId;
            this.name = patronName;
        }

        public int getPatronId() {
            return patronId;
        }

        public void setPatronId(int patronId) {
            this.patronId = patronId;
        }

        public String getName() {
            return name;
        }

        public void setPatronName(String name) {
            this.name = name;
        }

    }
}

