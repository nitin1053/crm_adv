package com.project.crm.service;

import com.project.crm.dto.LoginRequest;
import com.project.crm.dto.JwtResponse;
import com.project.crm.dto.SignupRequest;
import com.project.crm.dto.UserResponse;
import com.project.crm.model.Role;
import com.project.crm.model.RoleEntity;
import com.project.crm.model.User;
import com.project.crm.repo.RoleRepository;
import com.project.crm.repo.UserRepository;
import com.project.crm.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository,
                       JwtUtils jwtUtils,
                       RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.roleRepository = roleRepository;
    }

    // ✅ Register new user
    public UserResponse registerUser(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // pick requested role OR default ROLE_CUSTOMER
        Role roleEnum = request.getRole() != null ? request.getRole() : Role.ROLE_CUSTOMER;

        // find role entity in DB
        RoleEntity roleEntity = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found in DB: " + roleEnum));

        // create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(roleEntity);

        User savedUser = userRepository.save(user);

        // ✅ Send String role back in response
        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole().getName().name() // String like "ROLE_ADMIN"
        );
    }


    // ✅ Login and return JWT
    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // ✅ get role string properly
        List<String> roles = Collections.singletonList(user.getRole().getName().name());

        // generate JWT token
        String token = jwtUtils.generateToken(user.getUsername(), roles);

        return new JwtResponse(
                token,
                user.getId(),
                user.getUsername(),
                roles
        );
    }
}
