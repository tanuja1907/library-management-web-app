package com.example.LibraryManagementSystem.entity;


@SuppressWarnings("ALL")
public class Patron {

    private int id;
    private String name;

    public Patron(){

    }
    public Patron(String name) {
        this.name = name;
    }

    public Patron(int id,String name){
        this.id=id;
        this.name=name;
    }

    public String getName() {
        return name;
    }
    public int getId(){return id;}

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
