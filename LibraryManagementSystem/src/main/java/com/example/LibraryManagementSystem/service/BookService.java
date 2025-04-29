package com.example.LibraryManagementSystem.service;
import com.example.LibraryManagementSystem.dto.*;
import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.entity.Patron;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import com.example.LibraryManagementSystem.repository.BookRepository;
import com.example.LibraryManagementSystem.repository.PatronRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class BookService  {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PatronRepository patronRepository;

    public Book addBook(Book book) {
        Optional<Book> bookCheck=bookRepository.findByTitle(book.getTitle());
        if(bookCheck.isPresent()){
            Book existingBook=bookCheck.get();
            existingBook.setAvailableCopies(existingBook.getAvailableCopies()+book.getAvailableCopies());
            return bookRepository.save(existingBook);
        }
       return bookRepository.save(book);
    }

    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    public boolean borrowBook(BorrowRequestDTO borrowRequestDTO){
       Book book=bookRepository.findById(borrowRequestDTO.getBookId()).orElseThrow(()->new ResourceNotFoundException("Book not found with id:"+borrowRequestDTO.getBookId()));
        Patron patron=patronRepository.findById(borrowRequestDTO.getPatronId()).orElseThrow(()->new ResourceNotFoundException("Patron not found with id:"+borrowRequestDTO.getPatronId()));
        if (patron.getBorrowedBooks().contains(book)) {
            throw new DuplicateEntryException("You have already borrowed this book");
        }
        if(book.getAvailableCopies()>0){
                book.setAvailableCopies(book.getAvailableCopies()-1);
                patron.getBorrowedBooks().add(book);
                book.getPatrons().add(patron);
                patronRepository.save(patron);
                bookRepository.save(book);
                return true;
            }else{
                throw new ResourceNotFoundException("No copies available for borrowing");

        }

    }
    public boolean returnBook(ReturnRequestDTO returnRequestDTO){
        Optional<Book> findBook=bookRepository.findById(returnRequestDTO.getBookId());
        Optional<Patron> findPatron=patronRepository.findById(returnRequestDTO.getPatronId());
        if(findBook.isPresent() && findPatron.isPresent()){
            Book book=findBook.get();
            Patron patron=findPatron.get();
            if(patron.getBorrowedBooks().remove(book)){
                book.setAvailableCopies(book.getAvailableCopies()+1);
                book.getPatrons().remove(patron);
                patronRepository.save(patron);
                bookRepository.save(book);
                return  true;
            }
        }
        return false;
    }

    public List<BookDTO> getBooksByPatronId(int patronId){

        if (!patronRepository.existsById(patronId)) {
            throw new ResourceNotFoundException("Patron with ID " + patronId + " not found");
        }
        List<Book> books =bookRepository.findBooksByPatronId(patronId);
        if(books.isEmpty()) {
            throw new ResourceNotFoundException("No Books Found!!!");
        }
        List<BookDTO> bookList=new ArrayList<>();
        for (Book book : books) {
                BookDTO bookDTO=new BookDTO(book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getAvailableCopies());
                bookList.add(bookDTO);
            }

        return bookList;
    }

    public List<Book> searchBooks(String pattern){
        return bookRepository.searchBookByTitleOrAuthor(pattern);
    }

    public boolean deleteBook(int id){
        Book findBook=bookRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No book found with this id: "+id)) ;
        List<Patron> patrons=findBook.getPatrons();
        if(patrons!=null && !patrons.isEmpty()){
            throw new IllegalStateException("cannot delete borrowed book");
        }
        bookRepository.delete(findBook);
        return true;
    }

    public List<BorrowedBookResponseDTO> getAllBorrowedBooks(){
        List<Book> borrowedBooks=bookRepository.findAllBorrowedBooks();
        List<BorrowedBookResponseDTO> bookList=new ArrayList<>();
        for(Book book:borrowedBooks){
            List<BorrowedBookResponseDTO.PatronInfo> patronInfos=new ArrayList<>();
            for(Patron patron:book.getPatrons()){
                BorrowedBookResponseDTO.PatronInfo patronInfo=new BorrowedBookResponseDTO.PatronInfo(patron.getId(),patron.getName());
                patronInfos.add(patronInfo);
            }
            BorrowedBookResponseDTO res=new BorrowedBookResponseDTO(
                    book.getId(),
                    book.getTitle(),
                    book.getAvailableCopies(),
                    patronInfos
            );
            bookList.add(res);
        }
        return bookList;
    }

    public boolean updateBook(int id, BookUpdateDTO bookUpdateDTO){
        Book book=bookRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("No book found with id: "+ id));
        if(bookRepository.existsByTitleAndIdNot(bookUpdateDTO.getTitle(),id)){
            throw new DuplicateEntryException("Book with this title already exist.");
        }
        if(bookUpdateDTO.getTitle()!=null)book.setTitle(bookUpdateDTO.getTitle());
        if(bookUpdateDTO.getAuthor()!=null)book.setAuthor(bookUpdateDTO.getAuthor());
        if(bookUpdateDTO.getAvailableCopies()!=null)book.setAvailableCopies(bookUpdateDTO.getAvailableCopies());
        bookRepository.save(book);
        return true;
    }
    public Book getBookById(int id){
        return bookRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No book found with id: "+id));
    }
}
