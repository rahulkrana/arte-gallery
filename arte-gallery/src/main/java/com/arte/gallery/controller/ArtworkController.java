
package com.arte.gallery.controller;

import com.arte.gallery.entity.Artwork;
import com.arte.gallery.service.ArtworkService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artworks")
//@CrossOrigin(origins = "http://localhost:5173")
public class ArtworkController {

    private final ArtworkService artworkService;

    // Constructor injection
    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    // 1. Get all artworks
    @GetMapping
    public List<Artwork> getAllArtworks() {
        return artworkService.getAllArtworks();
    }

    // 2. Get artwork by ID
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {

        Optional<Artwork> artwork = artworkService.getArtworkById(id);

        return artwork.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. Add new artwork
    @PostMapping
    public ResponseEntity<Artwork> addArtwork(
            @RequestBody Artwork artwork) {

        Artwork savedArtwork = artworkService.saveArtwork(artwork);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedArtwork);
    }

    // 4. Update artwork
    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(
            @PathVariable Long id,
            @RequestBody Artwork artwork) {

        try {
            Artwork updatedArtwork =
                    artworkService.updateArtwork(id, artwork);

            return ResponseEntity.ok(updatedArtwork);

        } catch (RuntimeException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Delete artwork
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {

        try {
            artworkService.deleteArtwork(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException exception) {
            return ResponseEntity.notFound().build();
        }
    }
}
