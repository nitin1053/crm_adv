package com.project.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CustomerRequest {

    @NotBlank
    public String firstName;


//    @NotBlank
    public String lastName;


    @Email
    public String email;


    public String phone;

    public String company;


    public String notes;

}
