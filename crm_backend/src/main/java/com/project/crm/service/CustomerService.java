package com.project.crm.service;

import com.project.crm.dto.CustomerDTO;
import com.project.crm.dto.CustomerRequest;
import com.project.crm.dto.CustomerResponse;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    CustomerResponse create(CustomerRequest req);
    Page<CustomerResponse> list(Pageable pageable);
    CustomerResponse get(Long id);


    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    void deleteCustomer(Long id);

//    Page<CustomerDTO> getAllCustomers(int page, int size);
    Page<CustomerDTO> getAllCustomers(int page, int size, String sortBy, String sortDir);



    List<CustomerDTO> getAllCustomers();   // ✅ New method

}
