
import { Link } from "react-router-dom";

function ArtworkCard({ artwork }) {
    return (
        <Link
            to={`/artwork/${artwork.id}`}
            className="artwork-card-link"
        >
            <article className="artwork-card reveal">

                <div className="artwork-image">
                    <img
                        src={artwork.image}
                        alt={artwork.title}
                        loading="lazy"
                        decoding="async"
                    />

                    <span className="artwork-category">
                        {artwork.category}
                    </span>
                </div>

                <div className="artwork-info">
                    <div>
                        <h3>{artwork.title}</h3>
                        <p>{artwork.artist}</p>
                    </div>
                </div>

            </article>
        </Link>
    );
}

export default ArtworkCard;
