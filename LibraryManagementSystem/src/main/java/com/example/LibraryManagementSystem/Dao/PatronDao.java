package com.example.LibraryManagementSystem.Dao;

import com.example.LibraryManagementSystem.connection.DBConnection;
import com.example.LibraryManagementSystem.entity.Patron;
import com.example.LibraryManagementSystem.exception.DuplicateEntryException;
import com.example.LibraryManagementSystem.exception.ResourceNotFoundException;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PatronDao {

    public boolean addPatron(Patron patron){
        try(Connection connection= DBConnection.getConnection()){
            String query="INSERT INTO patrons(name) VALUES(?)";
            PreparedStatement ps=connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, patron.getName());
            if( ps.executeUpdate()>0){
                ResultSet rs= ps.getGeneratedKeys();
                if(rs.next()){
                    int generatedKey=rs.getInt(1);
                    patron.setId(generatedKey);
                    System.out.println("Patron added with id: "+generatedKey);
                }
                return  true;
            }
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
        return false;
    }

    public Patron getPatronByID(int patronID){

        try(Connection connection= DBConnection.getConnection()){
            String query="SELECT * FROM patrons where id=?";
            PreparedStatement ps=connection.prepareStatement(query);
            ps.setInt(1,patronID);
            ResultSet resultSet=ps.executeQuery();
            if(resultSet.next()){
                return new Patron(resultSet.getInt("id"),
                        resultSet.getString("name"));
            }
        } catch (SQLException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
        return null;
    }

    public List<Patron> getAllPatrons(){
        List<Patron> patrons=new ArrayList<>();
        try(Connection connection=DBConnection.getConnection()){
            String query="SELECT * FROM patrons";
            Statement st=connection.createStatement();
            ResultSet rs=st.executeQuery(query);
            while(rs.next()){
                patrons.add(new Patron(rs.getInt("id"),
                        rs.getString("name")));

            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return  patrons;
    }

    public boolean deletePatronById(int patronId){
        try(Connection connection=DBConnection.getConnection()){
            String bookStm="UPDATE books SET is_available=TRUE, borrowed_by=Null where borrowed_by=?";
            PreparedStatement preparedStatement=connection.prepareStatement(bookStm);
            preparedStatement.setInt(1,patronId);
            preparedStatement.executeUpdate();
            String query="DELETE FROM patrons WHERE id=?";
            PreparedStatement ps=connection.prepareStatement(query);
            ps.setInt(1,patronId);
            return ps.executeUpdate()>0;
        }catch(SQLException ex){
            System.out.println("Error Deleting Patron"+ex.getMessage());
        }
        return false;
    }

    public List<Patron> searchPatron(String name){
        List<Patron> patrons=new ArrayList<>();
        try(Connection connection=DBConnection.getConnection()){
            String query="SELECT * FROM patrons WHERE name LIKE ?";
            PreparedStatement ps=connection.prepareStatement(query);
            String searchPattern="%"+name+"%";
            ps.setString(1,searchPattern);
            ResultSet rs=ps.executeQuery();
            while(rs.next()){
                Patron patron=new Patron(rs.getInt("id"),
                        rs.getString("name"));
                patrons.add(patron);
            }
        }catch(SQLException ex){
            throw new RuntimeException("Error occured while searching for patron"+ex.getMessage());
        }
        if(patrons.isEmpty()){
            throw new ResourceNotFoundException("No patrons found with this name");
        }
        return patrons;
    }

    public boolean updatePatronById(int id,Patron patron){
        try(Connection connection=DBConnection.getConnection()){
            String selectQuery="SELECT * FROM patrons WHERE id=?";
            PreparedStatement checkStatement =connection.prepareStatement(selectQuery);
            checkStatement.setInt(1,id);
            ResultSet rs= checkStatement.executeQuery();
            if(!rs.next()){
                throw new ResourceNotFoundException("User not exist");
            }
            String existingName=rs.getString("name");
            String updatedName= patron.getName()!=null? patron.getName().trim() : existingName;
            String checkQuery="SELECT id FROM patrons WHERE name=? AND id<>?";
            PreparedStatement preparedStatement=connection.prepareStatement(checkQuery);
            preparedStatement.setString(1,updatedName);
            preparedStatement.setInt(2,id);
            ResultSet checkRS=preparedStatement.executeQuery();
            if(checkRS.next()){
                throw new DuplicateEntryException("Duplicate user found");
            }
            String updateQuery="UPDATE patrons SET name=? WHERE id=?";
            PreparedStatement ps=connection.prepareStatement(updateQuery);
            ps.setString(1,updatedName);
            ps.setInt(2,id);
            System.out.println("Updated patron");
            System.out.println(updatedName);
            return ps.executeUpdate()>0;
        }catch (SQLException e){
            System.out.println("Error in updating patron "+e.getMessage());;
        }
        return false;
    }
}
