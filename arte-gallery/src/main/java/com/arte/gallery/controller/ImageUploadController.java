
package com.arte.gallery.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDirectory;

    @Value("${cloudinary.enabled:false}")
    private boolean cloudinaryEnabled;

    private final ObjectProvider<Cloudinary> cloudinaryProvider;

    public ImageUploadController(
            ObjectProvider<Cloudinary> cloudinaryProvider) {
        this.cloudinaryProvider = cloudinaryProvider;
    }

    @PostMapping(
            value = "/upload-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("image") MultipartFile file
    ) throws Exception {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select an image."));
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.contains(".")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid image filename."));
        }

        String extension = originalFilename
                .substring(originalFilename.lastIndexOf("."))
                .toLowerCase();

        if (!extension.matches("\\.(jpg|jpeg|png|webp|gif)")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Unsupported image format."));
        }

        // Production: Upload image to Cloudinary
        if (cloudinaryEnabled) {

            Cloudinary cloudinary = cloudinaryProvider.getObject();

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "arte-gallery")
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            return ResponseEntity.ok(
                    Map.of("imageUrl", imageUrl)
            );
        }

        // Local development: Save image to uploads folder
        Path uploadPath = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(uploadPath);

        String newFilename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(newFilename).normalize();

        if (!filePath.startsWith(uploadPath)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file path."));
        }

        Files.copy(file.getInputStream(), filePath);

        String imageUrl =
                "http://localhost:8080/uploads/" + newFilename;

        return ResponseEntity.ok(
                Map.of("imageUrl", imageUrl)
        );
    }
}
