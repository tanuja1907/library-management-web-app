package com.example.LibraryManagementSystem.dto;

public class DashBoardDTO {

    private long totalBooks;
    private long borrowedBooks;
    private long availableBooks;
    private long totalPatrons;

    public DashBoardDTO(long totalBooks, long borrowedBooks, long availableBooks,long totalPatrons) {
        this.totalBooks = totalBooks;
        this.borrowedBooks = borrowedBooks;
        this.availableBooks = availableBooks;
        this.totalPatrons=totalPatrons;
    }


    public long getTotalPatrons() {
        return totalPatrons;
    }

    public void setTotalPatrons(long totalPatrons) {
        this.totalPatrons = totalPatrons;
    }

    public long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }

    public long getBorrowedBooks() { return borrowedBooks; }
    public void setBorrowedBooks(long borrowedBooks) { this.borrowedBooks = borrowedBooks; }

    public long getAvailableBooks() { return availableBooks; }
    public void setAvailableBooks(long availableBooks) { this.availableBooks = availableBooks; }
}
