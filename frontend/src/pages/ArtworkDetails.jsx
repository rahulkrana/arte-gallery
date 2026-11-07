
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

import Navbar from "../components/Navbar";
import { getAllArtworks } from "../services/artworkService";

import "./ArtworkDetails.css";

function ArtworkDetails() {
    const { id } = useParams();

    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Control artwork image preview
    const [isImageOpen, setIsImageOpen] = useState(false);

    // Update SEO metadata for the selected artwork
    useEffect(() => {
        if (artwork) {
            document.title = `${artwork.title} | ARTÉ Gallery`;

            document.querySelector('meta[name="description"]')
                ?.setAttribute(
                    "content",
                    `Explore ${artwork.title} by ${artwork.artist} at ARTÉ Gallery. Discover beautiful ${artwork.category || "fine art"} and its creative details.`
                );
        } else if (error) {
            document.title = "Artwork Not Found | ARTÉ Gallery";
        }
    }, [artwork, error]);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                setLoading(true);

                const data = await getAllArtworks();

                const selectedArtwork = data.find(
                    (item) => String(item.id) === String(id)
                );

                if (!selectedArtwork) {
                    setError("Artwork not found.");
                } else {
                    setArtwork(selectedArtwork);
                }

            } catch (err) {
                console.error(err);
                setError("Unable to load artwork details.");
            } finally {
                setLoading(false);
            }
        };

        fetchArtwork();
    }, [id]);

    const handleContactOwner = () => {
        const message = `Hello, I am interested in the artwork "${artwork.title}" by ${artwork.artist}. Please share more details.`;

        const whatsappUrl =
            `https://wa.me/919905371792?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <Navbar />

            <main className="artwork-details-page">

                <Link to="/" className="back-to-gallery">
                    <ArrowLeft size={18} />
                    Back to Gallery
                </Link>

                {loading ? (
                    <p className="details-message">Loading artwork details...</p>
                ) : error ? (
                    <p className="details-message">{error}</p>
                ) : (
                    <section className="artwork-details-container">

                        <div
                            className="details-image"
                            onClick={() => setIsImageOpen(true)}
                        >
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                            />

                            <span className="image-preview-hint">
        Click to enlarge
    </span>
                        </div>

                        <div className="details-content">

              <span className="details-category">
                {artwork.category || "ARTWORK"}
              </span>

                            <h1>{artwork.title}</h1>

                            <p className="details-artist">
                                By {artwork.artist}
                            </p>

                            <div className="details-divider"></div>

                            <h3>About This Artwork</h3>

                            <p className="details-description">
                                {artwork.description ||
                                    "Discover the beauty and creativity behind this artwork."}
                            </p>

                            <div className="details-information">

                                <div>
                                    <span>Medium</span>
                                    <p>{artwork.medium || "Not specified"}</p>
                                </div>

                                <div>
                                    <span>Dimensions</span>
                                    <p>{artwork.dimensions || "Not specified"}</p>
                                </div>

                                <div>
                                    <span>Category</span>
                                    <p>{artwork.category || "Not specified"}</p>
                                </div>

                            </div>

                            <button
                                className="contact-owner-button"
                                onClick={handleContactOwner}
                            >
                                <MessageCircle size={19} />
                                Contact Owner
                            </button>

                        </div>

                    </section>
                )}
                {/* FULL-SCREEN IMAGE PREVIEW */}
                {isImageOpen && (
                    <div className="image-preview-overlay">

                        <button
                            className="image-preview-close"
                            onClick={() => setIsImageOpen(false)}
                            aria-label="Close image preview"
                        >
                            ×
                        </button>

                        <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="image-preview-full"
                        />

                        <p className="image-preview-title">
                            {artwork.title}
                        </p>

                    </div>
                )}

            </main>
        </>
    );
}

export default ArtworkDetails;
