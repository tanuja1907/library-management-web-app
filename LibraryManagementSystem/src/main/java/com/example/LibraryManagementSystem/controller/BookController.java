package com.example.LibraryManagementSystem.controller;
//import java.time.LocalDateTime;
import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import com.example.LibraryManagementSystem.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@SuppressWarnings("ALL")
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) throws DuplicateEntryException {
        return  ResponseEntity.ok(bookService.addBook(book));
    }

    @GetMapping
    public ResponseEntity<Object> getAllBooks() {
        List<Book> books=bookService.getAllBooks();
        if(books==null || books.isEmpty()){
            return ResponseEntity.ok("No Books Found");
        }
        return ResponseEntity.ok(books);
    }


    @PostMapping("/{bookId}/borrow/{patronId}")
    public ResponseEntity<String> boorowBook(@PathVariable int bookId,@PathVariable int patronId) throws ResourceNotFoundException {
        if(bookService.borrowBook(patronId,bookId)){
            return ResponseEntity.ok("Book Borrowed Successfully");
        }else{
            throw new ResourceNotFoundException("Borrowing failed!!! ,either book is already borrowed or invalid id");
        }
    }

    @PostMapping("/{bookId}/return/{patronId}")
    public ResponseEntity<String> returnBook(@PathVariable int bookId,@PathVariable int patronId) throws ResourceNotFoundException {
        if(bookService.returnBook(patronId,bookId)){
            return ResponseEntity.ok("Book returned Successfully");
        }else{
            throw new ResourceNotFoundException("Returning failed!!! ,either book is not borrowed or invalid id");
        }
    }

    @GetMapping("/patron/{patronId}")
    public ResponseEntity<Object> getBookByPatron(@PathVariable  int patronId){
        List<Book> books=bookService.getBooksByPatron(patronId);
        if(books==null || books.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Book Found for this patron");
        }
        return ResponseEntity.ok(bookService.getBooksByPatron(patronId));
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchBook(@RequestParam String term){
        List<Book> books=bookService.searchBooks(term);
        if(books==null || books.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Book Found");
        }
        return ResponseEntity.ok(books);
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
    public ResponseEntity<Object> getAllBorrowedBooks(){
        List<LinkedHashMap<String,Object>> books=bookService.booksBorrowedByPatron();
        if(books==null || books.isEmpty()){
            return ResponseEntity.ok("No books are currently borrowed");
        }
        return ResponseEntity.ok(bookService.booksBorrowedByPatron());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updateBook(@PathVariable int id,@RequestBody Book book){
        boolean update= bookService.updateBook(id,book);
        if(update){
            return ResponseEntity.ok("Update book successfully");

        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message","Book not updated.Either book not found or already exist!",
                    "status",400
            ));
        }
    }
}
