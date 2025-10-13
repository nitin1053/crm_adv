package com.project.crm.controller;


import com.project.crm.dto.CustomerDTO;
import com.project.crm.dto.CustomerRequest;
import com.project.crm.dto.CustomerResponse;
import com.project.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
//@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService){
        this.customerService = customerService;
    }

    // ➡ Create - only MANAGER or ADMIN can create
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest req){
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.create(req));
    }

    // ➡ Paginated list - all logged-in users (CUSTOMER, MANAGER, ADMIN)
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','MANAGER','ADMIN')")
    public ResponseEntity<Page<CustomerDTO>> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(customerService.getAllCustomers(page, size,sortBy,sortDir));
    }

    // ➡ Full list - same access as above
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('CUSTOMER','MANAGER','ADMIN')")
    public List<CustomerDTO> getAll() {
        return customerService.getAllCustomers();
    }

    // ➡ Get single customer - everyone logged in
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','MANAGER','ADMIN')")
    public ResponseEntity<CustomerResponse> get(@PathVariable Long id){
//        return ResponseEntity.ok(customerService.get(id));
        CustomerResponse customer = customerService.get(id);
        return customer != null ? ResponseEntity.ok(customer) : ResponseEntity.notFound().build();
    }

    // ➡ Update - only MANAGER or ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable long id,
            @Valid @RequestBody CustomerRequest request){
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    // ➡ Delete - only ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
