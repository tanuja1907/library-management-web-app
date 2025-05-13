package com.example.LibraryManagementSystem.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String author;
    private int availableCopies;
    @JsonBackReference
    @ManyToMany(mappedBy = "borrowedBooks")
    private List<Patron> patrons = new ArrayList<>();
}
