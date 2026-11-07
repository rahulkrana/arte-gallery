
package com.arte.gallery.service;

import com.arte.gallery.entity.Artwork;
import com.arte.gallery.repository.ArtworkRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    private final ArtworkRepository artworkRepository;

    // Constructor injection
    public ArtworkService(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    // Get all artworks
    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll();
    }

    // Get artwork by ID
    public Optional<Artwork> getArtworkById(Long id) {
        return artworkRepository.findById(id);
    }

    // Add new artwork
    public Artwork saveArtwork(Artwork artwork) {
        return artworkRepository.save(artwork);
    }

    // Update artwork
    public Artwork updateArtwork(Long id, Artwork updatedArtwork) {

        Artwork existingArtwork = artworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Artwork not found with ID: " + id));

        existingArtwork.setTitle(updatedArtwork.getTitle());
        existingArtwork.setArtist(updatedArtwork.getArtist());
        existingArtwork.setDescription(updatedArtwork.getDescription());
        existingArtwork.setPrice(updatedArtwork.getPrice());
        existingArtwork.setImageUrl(updatedArtwork.getImageUrl());
        existingArtwork.setCategory(updatedArtwork.getCategory());
        existingArtwork.setMedium(updatedArtwork.getMedium());
        existingArtwork.setDimensions(updatedArtwork.getDimensions());
        existingArtwork.setAvailable(updatedArtwork.isAvailable());

        return artworkRepository.save(existingArtwork);
    }

    // Delete artwork
    public void deleteArtwork(Long id) {

        if (!artworkRepository.existsById(id)) {
            throw new RuntimeException(
                    "Artwork not found with ID: " + id);
        }

        artworkRepository.deleteById(id);
    }
}
