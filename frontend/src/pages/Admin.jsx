
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ScrollReveal from "../ScrollReveal";

import {
    getAllArtworks,
    addArtwork,
    updateArtwork,
    deleteArtwork
} from "../services/artworkService";

import "./Admin.css";

function Admin() {

    // Artwork collection states

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search and category filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [saveError, setSaveError] = useState("");

    // Initial form data
    const initialFormData = {
        title: "",
        artist: "",
        description: "",
        /** @type {File | null} */
        imageFile: null,
        imageUrl: "",
        category: "",
        medium: "",
        dimensions: ""
    };

    const [formData, setFormData] = useState(initialFormData);

    const [imagePreview, setImagePreview] = useState("");

    const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);

    // Load artworks from backend
    const loadArtworks = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllArtworks();
            setArtworks(data);

        } catch (err) {
            setError("Unable to load artworks. Please check the backend.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter artworks by search text and category
    const filteredArtworks = artworks.filter((artwork) => {

        const matchesSearch =
            artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.artist?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            artwork.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Edit artwork
    const handleEditArtwork = (artwork) => {

        setEditingId(artwork.id);
        setImagePreview("");

        setFormData({
            title: artwork.title || "",
            artist: artwork.artist || "",
            description: artwork.description || "",
            imageFile: null,
            imageUrl: artwork.imageUrl || "",
            category: artwork.category || "",
            medium: artwork.medium || "",
            dimensions: artwork.dimensions || ""
        });

        setSaveError("");
        setSuccessMessage("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete artwork
    const handleDeleteArtwork = async (id, title) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setSaveError("");
            setSuccessMessage("");

            await deleteArtwork(id);
            await loadArtworks();

            setSuccessMessage("Artwork deleted successfully!");

        } catch (error) {
            console.error("Delete Artwork Error:", error);
            setSaveError(error.message || "Unable to delete artwork.");
        }
    };

    // Add or update artwork
    const handleSaveArtwork = async (e) => {

        e.preventDefault();

        // Validate required text fields
        const title = formData.title.trim();
        const artist = formData.artist.trim();
        const category = formData.category.trim();

        if (!title || !artist || !category) {
            setSaveError("Please enter artwork title, artist name, and category.");
            return;
        }

        if (title.length < 2) {
            setSaveError("Artwork title must contain at least 2 characters.");
            return;
        }

        if (artist.length < 2) {
            setSaveError("Artist name must contain at least 2 characters.");
            return;
        }

        setIsSaving(true);
        setSuccessMessage("");
        setSaveError("");

        try {

            let imageUrl = formData.imageUrl;

            // Step 1: Upload image if a new image was selected
            if (formData.imageFile) {

                const imageData = new FormData();
                imageData.append("image", formData.imageFile);

                const uploadResponse = await fetch(
                    `${API_BASE_URL}/api/artworks/upload-image`,
                    {
                        method: "POST",
                        credentials: "include",
                        body: imageData
                    }
                );

                if (!uploadResponse.ok) {
                    let errorMessage = "Image upload failed. Please try again.";

                    try {
                        const errorData = await uploadResponse.json();
                        errorMessage = errorData.message || errorData.error || errorMessage;
                    } catch {
                        // Keep the default error message if the response is not JSON
                    }

                    throw new Error(errorMessage);
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.imageUrl;
            }

            // Step 2: Check whether an image exists
            if (!imageUrl) {
                throw new Error("Please select an artwork image.");
            }

            // Step 3: Prepare artwork details
            const { imageFile, ...artworkDetails } = formData;

            const artworkData = {
                ...artworkDetails,
                imageUrl: imageUrl
            };

            // Step 4: Add or update artwork
            if (editingId !== null) {

                await updateArtwork(editingId, artworkData);
                setSuccessMessage("Artwork updated successfully!");

            } else {

                await addArtwork(artworkData);
                setSuccessMessage("Artwork added successfully!");
            }

            // Step 5: Refresh collection
            await loadArtworks();

            // Step 6: Reset form
            setFormData({ ...initialFormData });

            setImagePreview("");

            setEditingId(null);
            setShowForm(false);

        } catch (error) {
            console.error("Save Artwork Error:", error);
            setSaveError(error.message || "Unable to save artwork.");
        } finally {
            setIsSaving(false);
        }
    };

    // Admin logout
    const handleLogout = async () => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed.");
            }

            window.location.href = "/admin-login";

        } catch (error) {
            console.error("Logout Error:", error);
            alert("Unable to logout. Please try again.");
        }
    };

    // Load artworks when dashboard opens
    useEffect(() => {
        loadArtworks();
    }, []);

    // Close image preview when Escape key is pressed
    useEffect(() => {
        if (!isImageZoomOpen) return;

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setIsImageZoomOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isImageZoomOpen]);

    // Automatically hide notifications after 4 seconds
    useEffect(() => {
        if (!successMessage && !saveError) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
            setSaveError("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [successMessage, saveError]);

    return (

        <div className="admin-page">

            <ScrollReveal />

            {/* ADMIN HEADER */}
            <header className="admin-header">

                <Link to="/" className="admin-logo">
                    ARTÉ<span>.</span>
                </Link>

                <div className="admin-header-right">

                    {/*<span>ADMINISTRATION</span>*/}

                    <Link to="/" className="back-home">
                        View Gallery →
                    </Link>

                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="admin-main">

                {/* DASHBOARD HEADING */}
                <div className="admin-heading">

                    <div>
                        <p className="admin-eyebrow">
                            ARTÉ COLLECTION MANAGEMENT
                        </p>

                        <h1>Admin Dashboard</h1>

                        <p>
                            Manage your gallery and artwork collection.
                        </p>
                    </div>

                    <button
                        className="add-artwork-btn"
                        onClick={() => {
                            if (!showForm) {
                                setFormData({ ...initialFormData });
                                setImagePreview("");
                                setEditingId(null);
                            }

                            setShowForm(!showForm);
                            setSaveError("");
                            setSuccessMessage("");
                        }}
                    >
                        + Add New Artwork
                    </button>

                </div>

                {/* ADD / EDIT ARTWORK FORM */}
                {showForm && (

                    <section className="artwork-management add-artwork-form reveal">

                        <h2>
                            {editingId !== null
                                ? "Edit Artwork"
                                : "Add New Artwork"}
                        </h2>

                        <form onSubmit={handleSaveArtwork}>

                            <input
                                type="text"
                                placeholder="Artwork Title"
                                value={formData.title}
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Artist Name"
                                value={formData.artist}
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        artist: e.target.value
                                    })
                                }
                            />

                            <textarea
                                placeholder="Artwork Description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                            />

                            {/* IMAGE UPLOAD */}
                            <div className="image-upload-field">

                                <label htmlFor="artworkImage">
                                    Select Artwork Image
                                </label>

                                <input
                                    type="file"
                                    id="artworkImage"
                                    accept="image/*"
                                    required={!formData.imageUrl}
                                    onChange={(e) => {
                                        const file = e.target.files[0];

                                        if (!file) return;

                                        // Check image file type
                                        if (!file.type.startsWith("image/")) {
                                            setSaveError("Please select a valid image file.");
                                            e.target.value = "";
                                            return;
                                        }

                                        // Check image size (maximum 5 MB)
                                        if (file.size > 5 * 1024 * 1024) {
                                            setSaveError("Image size must be less than 5 MB.");
                                            e.target.value = "";
                                            return;
                                        }

                                        // Clear previous error
                                        setSaveError("");

                                        // Save selected image and show preview
                                        setFormData({ ...formData, imageFile: file });
                                        setImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                                {(imagePreview || formData.imageUrl) && (
                                    <div className="admin-image-preview">
                                        <p>Image Preview</p>

                                        <button
                                            type="button"
                                            className="admin-preview-trigger"
                                            onClick={() => setIsImageZoomOpen(true)}
                                            aria-label="Zoom artwork image"
                                        >
                                            <img
                                                src={imagePreview || formData.imageUrl}
                                                alt="Selected artwork preview"
                                            />
                                        </button>
                                    </div>
                                )}

                                {formData.imageFile && (
                                    <p className="selected-image-name">
                                        Selected: {formData.imageFile.name}
                                    </p>
                                )}

                            </div>

                            <input
                                type="text"
                                placeholder="Category (Abstract, Portrait, Landscape...)"
                                value={formData.category}
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value.toUpperCase()
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Medium (Oil, Acrylic, Watercolor...)"
                                value={formData.medium}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medium: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Dimensions (e.g. 24 x 36 inches)"
                                value={formData.dimensions}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dimensions: e.target.value
                                    })
                                }
                            />

                            {/* SUCCESS MESSAGE */}
                            {successMessage && (
                                <p className="admin-success">
                                    {successMessage}
                                </p>
                            )}

                            {/* ERROR MESSAGE */}
                            {saveError && (
                                <p className="admin-error">
                                    {saveError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="add-artwork-btn"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : editingId !== null
                                        ? "Update Artwork"
                                        : "Save Artwork"}
                            </button>

                        </form>

                    </section>

                )}

                {/* DASHBOARD STATISTICS */}
                <section className="admin-stats">

                    <div className="stat-card">
                        <span>Total Artworks</span>
                        <h2>{artworks.length}</h2>
                    </div>

                    <div className="stat-card">
                        <span>Total Artists</span>
                        <h2>
                            {new Set(
                                artworks
                                    .map(item => item.artist)
                                    .filter(Boolean)
                            ).size}
                        </h2>
                    </div>

                    <div className="stat-card">
                        <span>Categories</span>
                        <h2>
                            {new Set(
                                artworks
                                    .map(item => item.category)
                                    .filter(Boolean)
                            ).size}
                        </h2>
                    </div>

                </section>

                {/* ARTWORK COLLECTION */}
                <section className="artwork-management">

                    <div className="management-heading">

                        <h2>Artwork Collection</h2>

                        <button
                            onClick={() => loadArtworks()}
                            className="refresh-btn"
                        >
                            ↻ Refresh
                        </button>

                    </div>

                    {/* SEARCH AND CATEGORY FILTER */}
                    <div className="admin-filters">

                        <input
                            type="text"
                            placeholder="Search by artwork title or artist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="admin-category-filter"
                        >

                            <option value="All">
                                All Categories
                            </option>

                            {[...new Set(
                                artworks
                                    .map(artwork => artwork.category)
                                    .filter(Boolean)
                            )]
                                .sort()
                                .map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}

                        </select>

                    </div>

                    {/* LOADING MESSAGE */}
                    {loading && (
                        <p className="admin-message">
                            Loading artworks...
                        </p>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p className="admin-error">
                            {error}
                        </p>
                    )}

                    {/* EMPTY COLLECTION MESSAGE */}
                    {!loading && !error && artworks.length === 0 && (
                        <p className="admin-message">
                            No artworks found. Add your first artwork soon.
                        </p>
                    )}

                    {/* NO SEARCH RESULTS MESSAGE */}
                    {!loading &&
                        !error &&
                        artworks.length > 0 &&
                        filteredArtworks.length === 0 && (

                            <p className="admin-message">
                                No matching artworks found.
                                Try another search or category.
                            </p>
                        )}

                    {/* ARTWORK TABLE */}
                    {!loading &&
                        !error &&
                        filteredArtworks.length > 0 && (

                            <div className="artwork-table-wrapper">

                                <table className="artwork-table">

                                    <thead>
                                    <tr>
                                        <th>Artwork</th>
                                        <th>Artist</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {filteredArtworks.map(artwork => (

                                        <tr key={artwork.id}>

                                            <td>
                                                <div className="table-artwork">

                                                    <img
                                                        src={artwork.imageUrl}
                                                        alt={artwork.title}
                                                    />

                                                    <span>
                                                            {artwork.title}
                                                        </span>

                                                </div>
                                            </td>

                                            <td>{artwork.artist}</td>

                                            <td>{artwork.category}</td>

                                            <td>
                                                <div className="artwork-actions">

                                                    <button
                                                        className="edit-artwork-btn"
                                                        onClick={() =>
                                                            handleEditArtwork(artwork)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-artwork-btn"
                                                        onClick={() =>
                                                            handleDeleteArtwork(
                                                                artwork.id,
                                                                artwork.title
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

            </main>


            {/* ADMIN TOAST NOTIFICATIONS */}
            {(successMessage || saveError) && (
                <div
                    className={`admin-toast ${
                        saveError ? "error" : "success"
                    }`}
                    role={saveError ? "alert" : "status"}
                >
        <span className="admin-toast-icon">
            {saveError ? "✕" : "✓"}
        </span>

                    <span className="admin-toast-message">
            {saveError || successMessage}
        </span>

                    <button
                        type="button"
                        className="admin-toast-close"
                        onClick={() => {
                            setSuccessMessage("");
                            setSaveError("");
                        }}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* FULLSCREEN IMAGE PREVIEW */}
            {isImageZoomOpen && (
                <div
                    className="admin-image-modal"
                    onClick={() => setIsImageZoomOpen(false)}
                >
                    <button
                        type="button"
                        className="admin-image-modal-close"
                        onClick={() => setIsImageZoomOpen(false)}
                        aria-label="Close image preview"
                    >
                        &times;
                    </button>

                    <img
                        src={imagePreview || formData.imageUrl}
                        alt="Artwork fullscreen preview"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    );
}

export default Admin;
