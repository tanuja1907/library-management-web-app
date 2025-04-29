package com.example.LibraryManagementSystem.controller;
import com.example.LibraryManagementSystem.dto.*;
import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import com.example.LibraryManagementSystem.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
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

    @GetMapping("/{bookId}")
    public ResponseEntity<Object> getBookById(@PathVariable int bookId){
        Book book=bookService.getBookById(bookId);
        if(book!=null){
            return ResponseEntity.ok(book);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Book Found");
        }
    }

    @PostMapping("/borrow")
    public ResponseEntity<String> borrowBook(@RequestBody BorrowRequestDTO borrowRequestDTO) throws ResourceNotFoundException {
        if(bookService.borrowBook(borrowRequestDTO)){
            return ResponseEntity.ok("Book Borrowed Successfully");
        }else{
            throw new ResourceNotFoundException("Borrowing failed!!! ,either book is already borrowed or invalid id");
        }
    }

    @PostMapping("/return")
    public ResponseEntity<String> returnBook(@RequestBody ReturnRequestDTO returnRequestDTO) throws ResourceNotFoundException {
        if(bookService.returnBook(returnRequestDTO)){
            return ResponseEntity.ok("Book returned Successfully");
        }else{
            throw new ResourceNotFoundException("Returning failed!!! ,either book is not borrowed or invalid id");
        }
    }

    @GetMapping("/bookByPatronId")
    public ResponseEntity<Object> getBookByPatron( @RequestParam int id){
        List<BookDTO> books=bookService.getBooksByPatronId(id);
        if(books==null || books.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Book Found for this patron");
        }
        return ResponseEntity.ok(bookService.getBooksByPatronId(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchBook(@RequestParam("term") String searchTerm){
        List<Book> books=bookService.searchBooks(searchTerm);
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
            return ResponseEntity.ok("Cannot delete borrowed book");
        }
    }

    @GetMapping("/borrowedBooks")
    public ResponseEntity<Object> getAllBorrowedBooks(){
        List<BorrowedBookResponseDTO> borrowedBooks=bookService.getAllBorrowedBooks();
        if(borrowedBooks.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No borrowed books found");
        }
        return ResponseEntity.ok(borrowedBooks);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updateBook(@PathVariable int id, @RequestBody BookUpdateDTO dto){
        boolean update= bookService.updateBook(id,dto);
        if(update){
            return ResponseEntity.ok("Update book successfully");

        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message","Book not updated.Either book not found or already exist!",
                    "status","Unsuccessful"
            ));
        }
    }
}
