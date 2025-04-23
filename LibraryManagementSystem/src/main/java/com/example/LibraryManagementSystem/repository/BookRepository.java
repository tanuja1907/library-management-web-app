package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book,Integer> {
    Optional<Book> findById(int id);

    Optional<Book> findByTitle(String title);

    @Query("SELECT b from Book b JOIN b.patrons p WHERE p.id= :patronId")
    List<Book> findBooksByPatronId(@Param("patronId") int patronId);

    @Query("SELECT b from Book b WHERE Lower(b.title) LIKE LOWER(CONCAT('%',:searchTerm,'%')) "+
            "OR Lower(b.author) LIKE LOWER(CONCAT('%',:searchTerm,'%')) ")
    List<Book> searchBookByTitleOrAuthor(String searchTerm);

    boolean existsByTitleAndIdNot(String title, int id);

    @Query("SELECT b from Book b where SIZE(b.patrons)>0")
    List<Book> findAllBorrowedBooks();
}
