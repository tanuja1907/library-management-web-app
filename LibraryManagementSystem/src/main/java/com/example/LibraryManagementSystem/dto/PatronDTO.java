package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class PatronDTO {
    private int patronId;
    private String name;
    private Integer age;
    private String profession;

    public PatronDTO(int patronId, String name,Integer age,String profession) {
        this.patronId = patronId;
        this.name = name;
        this.age=age;
        this.profession=profession;
    }
    public void setProfession(){
        if(profession!=null){
            this.profession=profession.trim().toLowerCase();
        }
    }
}
