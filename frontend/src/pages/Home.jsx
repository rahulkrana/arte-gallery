
import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import ArtworkCard from "../components/ArtworkCard";
import { getAllArtworks } from "../services/artworkService";

import ContactSection from "../components/ContactSection";

import ScrollReveal from "../ScrollReveal";

function Home() {

  useEffect(() => {
    document.title = "Home | ARTÉ Gallery";

    document.querySelector('meta[name="description"]')
        ?.setAttribute(
            "content",
            "Explore ARTÉ Gallery's curated collection of beautiful paintings and timeless artwork."
        );
  }, []);

  // Store artwork received from backend
  const [artworks, setArtworks] = useState([]);

  // Store selected category
  const [category, setCategory] = useState("All");

  // Store artwork search text
  const [searchTerm, setSearchTerm] = useState("");

  // Store selected sorting option
  const [sortOrder, setSortOrder] = useState("newest");

  // Number of artworks currently visible
  const [visibleCount, setVisibleCount] = useState(8);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch artworks when homepage loads
  useEffect(() => {

    const fetchArtworks = async () => {

      try {
        setLoading(true);
        setError("");

        const data = await getAllArtworks();

        // Convert backend data into frontend format
        const formattedArtworks = data.map((artwork) => ({
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          category: artwork.category,
          price: `$${Number(artwork.price).toLocaleString("en-US")}`,
          image: artwork.imageUrl,
          createdAt: artwork.createdAt
        }));

        setArtworks(formattedArtworks);

      } catch (err) {
        setError("Unable to load artworks. Please try again later.");
        console.error(err);

      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();

  }, []);

  // Generate categories from database records
  const categories = [
    "All",
    ...new Set(
        artworks
            .map((art) => art.category)
            .filter(Boolean)
    )
  ];

// Filter artworks by category and search text
  const filteredArtworks = artworks.filter((art) => {

    const matchesCategory =
        category === "All" || art.category === category;

    const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.artist.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort filtered artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {

    switch (sortOrder) {

      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "az":
        return a.title.localeCompare(b.title);

      case "za":
        return b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });

  // Display artworks according to visible count
  const visibleArtworks = sortedArtworks.slice(0, visibleCount);

  return (
      <>
        <ScrollReveal />
        <Navbar />

        <main>

          {/* HERO SECTION */}
          <section className="hero" id="home">

            <div className="hero-content">

              <p className="eyebrow">
                THE WORLD OF FINE ART
              </p>

              <h1>
                Art That Speaks.
                <br />
                <span>Beauty That Lasts.</span>
              </h1>

              <p className="hero-description">
                Discover exceptional paintings and timeless
                masterpieces from talented artists around
                the world.
              </p>

              <a href="#gallery" className="gold-button">
                Explore Collection →
              </a>

            </div>

            <div className="hero-image">

              <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200"
                  alt="Featured fine art painting"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
              />

            </div>

          </section>


          {/* GALLERY SECTION */}
          <section className="gallery-section" id="gallery">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  CURATED FOR YOU
                </p>

                <h2>Featured Collection</h2>

              </div>

              <p>
                Discover art that transforms spaces
                and inspires emotions.
              </p>

            </div>

            {/* ARTWORK SEARCH */}
            <div className="artwork-search">
              <input
                  type="text"
                  placeholder="Search by artwork title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* CATEGORY FILTER */}
            <div className="category-filter">

              {categories.map((item) => (

                  <button
                      key={item}
                      className={
                        category === item ? "active" : ""
                      }
                      onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>

              ))}

            </div>

            {/* ARTWORK SORTING */}
            <div className="artwork-sorting">
              <label htmlFor="sortOrder">Sort By:</label>

              <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
              </select>
            </div>

            {/* ARTWORK DISPLAY */}
            <div className="artwork-grid">

              {loading ? (

                  <p>Loading artworks...</p>

              ) : error ? (

                  <p>{error}</p>

              ) : filteredArtworks.length === 0 ? (

                  <p>No artworks available in this category.</p>

              ) : (

                  visibleArtworks.map((artwork) => (
                      <ArtworkCard
                          key={artwork.id}
                          artwork={artwork}
                      />
                  ))

              )}

            </div>

            {!loading && !error && sortedArtworks.length > visibleCount && (
                <div className="show-more-container">
                  <button
                      className="show-more-button"
                      onClick={() => setVisibleCount(prev => prev + 8)}
                  >
                    Show More Artworks ＋
                  </button>
                </div>
            )}

          </section>

          {/* MEET THE ARTIST SECTION */}
          <section className="artist-profile-section reveal" id="artists">
            <img
                src="/artist-vikash.png"
                alt="Vikash Rana - Artist"
                className="artist-profile-image"
            />
          </section>

          {/* ABOUT SECTION */}

          <section className="about-section reveal" id="about">

            <div className="about-content">

              <p className="eyebrow">
                MEET THE ARTIST
              </p>

              <h2>
                The Artist Behind <span>ARTÉ.</span>
              </h2>

              <p>
                Every painting begins with an imagination,
                an emotion and a story waiting to be told.
              </p>

              <p>
                ARTÉ is a space dedicated to showcasing
                artistic creativity, unique paintings and
                the beauty of visual expression.
              </p>

              <p>
                Through every artwork, we aim to connect
                people with creativity, imagination and
                timeless artistic expression.
              </p>

            </div>

          </section>



          {/* CONTACT SECTION */}
          <ContactSection />


          {/* FOOTER */}
          <footer className="footer reveal" id="artists">

            <h2>ARTÉ.</h2>

            <p>
              Where creativity meets timeless elegance.
            </p>

            <p>
              © 2026 ARTÉ Gallery. All rights reserved.
            </p>

          </footer>

        </main>
      </>
  );
}

export default Home;
