package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import com.example.LibraryManagementSystem.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;



@SuppressWarnings("ALL")
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book){
        return  ResponseEntity.ok(bookService.addBook(book));
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }


    @PostMapping("/{bookId}/borrow/{patronId}")
    public ResponseEntity<String> boorowBook(@PathVariable int bookId,@PathVariable int patronId) throws ResourceNotFoundException {
        if(bookService.borrowBook(patronId,bookId)){
            return ResponseEntity.ok("Book Borrowed Successfully");
        }else{
            throw new ResourceNotFoundException("Borrowing failed");
        }
    }

    @PostMapping("/{bookId}/return/{patronId}")
    public ResponseEntity<String> returnBook(@PathVariable int bookId,@PathVariable int patronId) throws ResourceNotFoundException {
        if(bookService.returnBook(patronId,bookId)){
            return ResponseEntity.ok("Book returned Successfully");
        }else{
            throw new ResourceNotFoundException("Returning failed");
        }
    }

    @GetMapping("/patron/{patronId}")
    public ResponseEntity<List<Book>> getBookByPatron(@PathVariable  int patronId){
        return ResponseEntity.ok(bookService.getBooksByPatron(patronId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBook(@RequestParam String term){
        return ResponseEntity.ok(bookService.searchBooks(term));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<String> deleteBook(@PathVariable int bookId){
        boolean book= bookService.deleteBook(bookId);
        if(book) {
            return ResponseEntity.ok("Book Deleted Successfully");
        }else {
            return ResponseEntity.ok("Book Id doesn't exist");
        }
    }

    @GetMapping("/borrowedBooks")
    public ResponseEntity<List<LinkedHashMap<String, Object>>> getAllBorrowedBooks(){
        return ResponseEntity.ok(bookService.booksBorrowedByPatron());
    }
}
