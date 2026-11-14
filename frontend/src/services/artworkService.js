
const API_URL = `${
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
}/api/artworks`;

// GET: Fetch all artworks
export const getAllArtworks = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch artworks");
    }

    return await response.json();
};

// POST: Add a new artwork
export const addArtwork = async (artwork) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(artwork)
    });

    if (!response.ok) {
        throw new Error("Failed to add artwork");
    }

    return await response.json();
};

// PUT: Update an existing artwork
export const updateArtwork = async (id, artwork) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(artwork)
    });

    if (!response.ok) {
        throw new Error("Failed to update artwork");
    }

    return await response.json();
};

// DELETE: Delete an artwork
export const deleteArtwork = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to delete artwork");
    }
};
