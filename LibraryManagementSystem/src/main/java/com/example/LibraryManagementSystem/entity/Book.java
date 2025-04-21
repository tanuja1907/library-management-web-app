package com.example.LibraryManagementSystem.entity;


public class Book {
    private int id;
    private  String title;
    private String author;
    private boolean isAvailable;
    private Integer borrowedBy;

    public Book(){

    }
    public Book(String title, String author) {
        this.title = title;
        this.author = author;
        this.isAvailable=true;

    }
    public Book(int id,String title, String author,boolean isAvailable,Integer borrowedBy) {
        this.id=id;
        this.title = title;
        this.author = author;
        this.isAvailable=isAvailable;
        this.borrowedBy=borrowedBy;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public boolean isAvailable(){
        return isAvailable;
    }

    public void borrow(Integer patronID){
        isAvailable=false;
        borrowedBy=patronID;
    }
    public void returnBook(){
        isAvailable=true;
        borrowedBy=null;
    }

    public int getId() {
        return id;
    }

    public Integer  getBorrowedBy() {
        return borrowedBy;
    }
    public void setId(int id) {
        this.id = id;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public void setBorrowedBy(Integer borrowedBy) {
        this.borrowedBy = borrowedBy;
    }
}
