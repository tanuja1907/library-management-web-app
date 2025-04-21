package com.example.LibraryManagementSystem.Dao;

import com.example.LibraryManagementSystem.connection.DBConnection;
import com.example.LibraryManagementSystem.entity.Book;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

@Repository
public class BookDao {
    public boolean addBook(Book book) {
        try (Connection connection = DBConnection.getConnection()) {
            String query = "INSERT INTO books(title,author,is_available)  VALUES(?,?,?)";
            PreparedStatement ps = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setBoolean(3, book.isAvailable());
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                ResultSet rs = ps.getGeneratedKeys();
                if (rs.next()) {
                    int generatedId = rs.getInt(1);
                    book.setId(generatedId);
                    System.out.println("Book added with ID: " + generatedId);
                }
                return true;
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
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

        // gives only books details
//        try(Connection connection=DBConnection.getConnection()){
//
//            String query="SELECT * from books where is_available=false";
//            Statement statement=connection.createStatement();
//            ResultSet rs=statement.executeQuery(query);
//            while (rs.next()){
//                Book book=new Book(rs.getInt("id"),
//                        rs.getString("title"),
//                        rs.getString("author"),
//                        rs.getBoolean("is_available"),
//                        rs.getInt("borrowed_by"));
//                books.add(book);
//
//            }
//            return books;
//        }catch (SQLException exception){
//            System.out.println(exception.getMessage());
//        }
        // hqashmap here giving unsequential data so using linkedHashMap
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
}
