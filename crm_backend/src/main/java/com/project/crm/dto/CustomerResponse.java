package com.project.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class CustomerResponse {


    public Long id;
    public String firstName;
    public String lastName;
    public String email;
    public String phone;
    public String company;
    public String notes;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;



}
