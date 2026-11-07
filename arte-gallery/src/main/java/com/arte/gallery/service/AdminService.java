package com.arte.gallery.service;

import com.arte.gallery.entity.Admin;
import com.arte.gallery.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean authenticate(String email, String password) {

        Optional<Admin> adminOptional =
                adminRepository.findByEmail(email);

        if (adminOptional.isEmpty()) {
            return false;
        }

        Admin admin = adminOptional.get();

        return passwordEncoder.matches(
                password,
                admin.getPassword()
        );
    }
}