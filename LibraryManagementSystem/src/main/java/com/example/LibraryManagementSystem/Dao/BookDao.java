package com.example.LibraryManagementSystem.Dao;

import com.example.LibraryManagementSystem.connection.DBConnection;
import com.example.LibraryManagementSystem.entity.Book;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

@Repository
public class BookDao {
    public boolean addBook(Book book) {
        try (Connection connection = DBConnection.getConnection()) {
            String checkQuery="SELECT id FROM books WHERE title=? AND author=?";
            PreparedStatement ps=connection.prepareStatement(checkQuery);
            ps.setString(1,book.getTitle());
            ps.setString(2,book.getAuthor());
            ResultSet check=ps.executeQuery();
            if(check.next()){
                throw new DuplicateEntryException("Duplicate entry: book with this title and author already exists");

            }
            String query = "INSERT INTO books(title,author,is_available)  VALUES(?,?,?)";
            PreparedStatement preparedStatement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, book.getTitle());
            preparedStatement.setString(2, book.getAuthor());
            preparedStatement.setBoolean(3, book.isAvailable());
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                ResultSet rs = preparedStatement.getGeneratedKeys();
                if (rs.next()) {
                    int generatedId = rs.getInt(1);
                    book.setId(generatedId);
                    System.out.println("Book added with ID: " + generatedId);
                }
                return true;
            }
        } catch (SQLException e) {
            System.out.println("Error while adding book"+e.getMessage());
        } catch (DuplicateEntryException e) {
            throw new RuntimeException(e);
        }
        return false;
    }

    public List<Book> getAllBook() {
        List<Book> books = new ArrayList<>();
        try (Connection connection = DBConnection.getConnection()) {
            String query = "SELECT * FROM books";
            Statement st = connection.createStatement();
            ResultSet rs = st.executeQuery(query);
            while (rs.next()) {
                Book book = new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getBoolean("is_available"),
                        rs.getInt("borrowed_by")
                );
                if (!book.isAvailable()) {
                    book.setBorrowedBy(rs.getInt("borrowed_by"));
                }
                books.add(book);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return books;
    }

    public boolean borrowBook(int patronId, int bookId) {
        try (Connection connection = DBConnection.getConnection()) {
            String query = "UPDATE books SET is_available =FALSE , borrowed_By=? where id=? AND is_available=TRUE";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, patronId);
            ps.setInt(2, bookId);
            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return false;
    }

    public boolean returnBook(int patronId, int bookId) {
        try (Connection connection = DBConnection.getConnection()) {
            String query = "UPDATE books SET is_available =TRUE ,borrowed_By=NULL where id=? AND borrowed_by=?";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, bookId);
            ps.setInt(2, patronId);
            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public List<Book> getBooksByPatron(int patronId) {
        List<Book> books = new ArrayList<>();
        try (Connection connection = DBConnection.getConnection()) {
            String query = "SELECT * FROM books WHERE borrowed_by=?";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, patronId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Book b = new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getBoolean("is_available"),
                        rs.getInt("borrowed_by")
                );
                books.add(b);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return books;
    }

    public List<Book> searchBooks(String searchTerm) {
        List<Book> books = new ArrayList<>();
        try (Connection connection = DBConnection.getConnection()) {
            String query = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?";
            PreparedStatement ps = connection.prepareStatement(query);
            String searchPattern = "%" + searchTerm + "%";
            ps.setString(1, searchPattern);
            ps.setString(2, searchPattern);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Book book = new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getBoolean("is_available"),
                        rs.getInt("borrowed_by")
                );
                books.add(book);
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return books;
    }

    public boolean deleteById(int id) {
        try (Connection connection = DBConnection.getConnection()) {
            String query = "DELETE FROM books where id=?";
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.out.println("Error Deleting Book" + ex.getMessage());
        }
        return false;
    }

    public List<LinkedHashMap<String, Object>> getAllBorrowedBooks() {

        List<LinkedHashMap<String, Object>> listOfBooks = new ArrayList<>();
        String query = """ 
                SELECT b.id as book_id ,b.title as book_title,b.author as author_name,
                p.id as patron_id,p.name as patron_name from books b
                JOIN patrons p ON borrowed_by=p.id
                WHERE is_available=FALSE
                """;
        try (Connection connection = DBConnection.getConnection()) {
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                LinkedHashMap<String, Object> mp = new LinkedHashMap<>();
                mp.put("book_id", rs.getInt("book_id"));
                mp.put("book_title", rs.getString("book_title"));
                mp.put("author_name", rs.getString("author_name"));
                mp.put("patron_id", rs.getInt("patron_id"));
                mp.put("patron_name", rs.getString("patron_name"));
                listOfBooks.add(mp);
            }
        } catch (SQLException exception) {
            System.out.println(exception.getMessage());
        }
        return listOfBooks;
    }

    public boolean updateBookById(int bookId,Book updatedBook){
        try(Connection con=DBConnection.getConnection()){
            String selectQuery = "SELECT * FROM books WHERE id = ?";
            PreparedStatement selectPs = con.prepareStatement(selectQuery);
            selectPs.setInt(1, bookId);
            ResultSet resultSet = selectPs.executeQuery();

            if (!resultSet.next()) {
                System.out.println("Book with ID " + bookId + " not found.");
                return false;
            }


            String existingTitle = resultSet.getString("title");
            String existingAuthor = resultSet.getString("author");
            boolean existingAvailability = resultSet.getBoolean("is_available");

            String finalTitle = updatedBook.getTitle() != null ? updatedBook.getTitle() : existingTitle;
            String finalAuthor = updatedBook.getAuthor() != null ? updatedBook.getAuthor() : existingAuthor;
            boolean finalAvailability = updatedBook.getIsAvailable() != null ? updatedBook.getIsAvailable() : existingAvailability;


            String checkQuery = "SELECT id FROM books WHERE title = ? AND id <> ?";
            PreparedStatement checkStmt = con.prepareStatement(checkQuery);
            checkStmt.setString(1, finalTitle);
            checkStmt.setInt(2, bookId);
            ResultSet checkRs = checkStmt.executeQuery();
            if (checkRs.next()) {
                System.out.println("Duplicate title found. Book not updated.");
                return false;
            }
            String query="UPDATE books SET  title=? , author=? ,is_available=? WHERE id=?";
            PreparedStatement ps=con.prepareStatement(query);
            ps.setString(1,finalTitle);
            ps.setString(2,finalAuthor);
            ps.setBoolean(3,finalAvailability);
            ps.setInt(4,bookId);
            System.out.println(finalTitle+" "+finalAuthor+" "+finalAvailability);
            return ps.executeUpdate()>0;
        }catch (SQLException ex){
            System.out.println("Error update Book "+ex.getMessage());
        }
        return false;
    }
}
