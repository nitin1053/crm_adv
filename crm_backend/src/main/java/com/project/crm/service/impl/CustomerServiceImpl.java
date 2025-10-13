package com.project.crm.service.impl;

import com.project.crm.dto.CustomerDTO;
import com.project.crm.dto.CustomerRequest;
import com.project.crm.dto.CustomerResponse;
import com.project.crm.model.Customer;
import com.project.crm.repo.CustomerRepository;
import com.project.crm.service.CustomerService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class CustomerServiceImpl implements CustomerService {


    private final ModelMapper mapper;

    private final CustomerRepository repo;



    @Autowired
    public CustomerServiceImpl(CustomerRepository repo,ModelMapper mapper){
        this.repo=repo;
        this.mapper=mapper;
    }

    private CustomerResponse toResponse(Customer c){
        CustomerResponse r=new CustomerResponse();
        r.id=c.getId();
        r.firstName= c.getFirstName();
        r.lastName= c.getLastName();
        r.email=c.getEmail();
        r.phone=c.getPhone();
        r.company=c.getCompany();
        r.notes=c.getNotes();
        r.createdAt=c.getCreatedAt();
        r.updatedAt=c.getCreatedAt();
        return r;

    }

    @Override
    public CustomerResponse create(CustomerRequest req){
        Customer c=new Customer();
        c.setFirstName(req.firstName);
        c.setLastName(req.lastName);
        c.setEmail(req.email);
        c.setPhone(req.phone);
        c.setCompany(req.company);
        c.setNotes(req.notes);
        return toResponse(repo.save(c));
    }

    @Override
    public Page<CustomerResponse> list(Pageable pageable) {
        return repo.findAll(pageable).map(this::toResponse);
    }



    @Override
    public CustomerResponse get(Long id){
        return repo.findById(id).map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
    }


    @Override
    public CustomerResponse updateCustomer(Long id, CustomerRequest request){
        Customer existing=repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id : "+ id));


//        update field

        existing.setFirstName(request.firstName);
        existing.setLastName(request.lastName);
        existing.setEmail(request.email);
        existing.setPhone(request.phone);


        existing.setUpdatedAt(LocalDateTime.now());

        Customer saved =repo.save(existing);
        return toResponse(saved);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer existing=repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: "+id));
        repo.delete(existing);
    }




//    ----->
    private CustomerDTO convertToDTO(Customer customer){
        CustomerDTO dto=new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setCompany(customer.getCompany());
        dto.setNotes(customer.getNotes());

        return dto;
    }



//    @Override
//    public Page<CustomerDTO> getAllCustomers(int page, int size) {
//        Pageable pageable= PageRequest.of(page,size, Sort.by("id").descending());
//        return repo.findAll(pageable)
//                .map(this::convertToDTO);
//    }

//    ---> alternative

    public Page<CustomerDTO> getAllCustomers(int page, int size,String sortBy,String sortDir) {
        Sort sort=sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size,sort);
        return repo.findAll(pageable)
                .map(this::convertToDTO); // convert entity → DTO
    }







    @Override
//    public List<CustomerDTO> getAllCustomers() {
//        List<Customer> customers = repo.findAll();
//
//        return customers.stream()
//                .map(c -> new CustomerDTO(
//                        c.getId(),
//                        c.getFirstName(),
//                        c.getLastName(),
//                        c.getEmail(),
//                        c.getPhone(),
//                        c.getCompany(),
//                        c.getNotes()
//                ))
//                .collect(Collectors.toList());
//    }
    public List<CustomerDTO> getAllCustomers(){
        return repo.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();

    }

//    ---> Atlternative
//public List<CustomerDTO> getAllCustomers() {
//    return customerRepository.findAll().stream()
//            .map(customerMapper::toDto)
//            .toList();
//}



}
