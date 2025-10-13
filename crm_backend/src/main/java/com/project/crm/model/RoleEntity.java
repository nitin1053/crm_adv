package com.project.crm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store enum as string (ROLE_ADMIN, ROLE_MANAGER, ROLE_CUSTOMER)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Role name;

    // --- Constructors ---
    public RoleEntity() {}

    public RoleEntity(Role name) {
        this.name = name;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getName() {
        return name;
    }

    public void setName(Role name) {
        this.name = name;
    }
}
