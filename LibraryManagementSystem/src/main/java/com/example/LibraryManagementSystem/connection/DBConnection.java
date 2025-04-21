package com.example.LibraryManagementSystem.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {


        static  String url="jdbc:mysql://localhost:3306/library-management-system";
        static  String user="root";
        static  String pass="tanuja";
        public static Connection getConnection()throws SQLException {
            try(Connection connection= DriverManager.getConnection(url,user,pass)){
                return DriverManager.getConnection(url,user,pass);
            } catch (Exception e) {
                throw new SQLException();
            }
        }

    }

