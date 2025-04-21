package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.Dao.PatronDao;
import com.example.LibraryManagementSystem.entity.Patron;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatronService {
    @Autowired
    private PatronDao patronDao;

    public Patron addPatron(Patron patron){
       if(patronDao.addPatron(patron))return patron;
       else throw new RuntimeException("Failed to add Patron");
    }

    public List<Patron> getAllPatrons(){
        return patronDao.getAllPatrons();
    }

    public boolean deletePatronById(int patronId){
        return patronDao.deletePatronById(patronId);
    }
    public Patron getPatronById(int patronId){
        return patronDao.getPatronByID(patronId);
    }
}
