package com.example.LibraryManagementSystem.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Data
@Entity
@Table(name="patrons")
public class Patron {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private int age;
    private String profession;

    @ManyToMany
    @JoinTable(name="borrowed_books",joinColumns = @JoinColumn(name="patron_id"),inverseJoinColumns = @JoinColumn(name="book_id"))
    private List<Book> borrowedBooks=new ArrayList<>();

    public void setProfession(){
        if(profession!=null){
            this.profession=profession.trim().toLowerCase();
        }
    }

}
