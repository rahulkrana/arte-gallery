package com.arte.gallery.config;

import com.arte.gallery.entity.Admin;
import com.arte.gallery.repository.AdminRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    public AdminDataInitializer(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            System.out.println(
                    "Admin account not initialized. Configure ADMIN_EMAIL and ADMIN_PASSWORD."
            );
            return;
        }

        if (adminRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("Admin account already exists.");
            return;
        }

        Admin admin = new Admin(
                adminEmail,
                passwordEncoder.encode(adminPassword),
                "ADMIN"
        );

        adminRepository.save(admin);

        System.out.println("Initial admin account created successfully.");
    }
}