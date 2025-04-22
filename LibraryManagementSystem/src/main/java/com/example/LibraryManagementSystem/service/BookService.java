package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.Dao.BookDao;
import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookDao bookDao;

    public Book addBook(Book book) throws DuplicateEntryException {
        book.setIsAvailable(true);
        if(bookDao.addBook(book)){
            return book;
        }else{
             throw new DuplicateEntryException("Duplicate entry");
        }
    }

    public List<Book> getAllBooks(){
        return bookDao.getAllBook();
    }

    public boolean borrowBook(int patronId,int bookId){
        return bookDao.borrowBook(patronId,bookId);
    }
    public boolean returnBook(int patronId,int bookId){
        return  bookDao.returnBook(patronId,bookId);
    }

    public List<Book> getBooksByPatron(int patronId){
        return bookDao.getBooksByPatron(patronId);
    }

    public List<Book> searchBooks(String searchTerm){
        return bookDao.searchBooks(searchTerm);
    }

    public boolean deleteBook(int id){
        return bookDao.deleteById(id);
    }

    public List<LinkedHashMap<String, Object>> booksBorrowedByPatron(){
        return bookDao.getAllBorrowedBooks();
    }

    public boolean updateBook(int id,Book book){
        return bookDao.updateBookById(id,book);
    }
}
