
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const goToSection = (sectionId) => {
        setMenuOpen(false);

        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`);
        } else {
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    return (
        <nav className="navbar">
            <a href="/" className="logo">
                ARTÉ<span>.</span>
            </a>

            <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                <button onClick={() => goToSection("home")}>Home</button>
                <button onClick={() => goToSection("gallery")}>Gallery</button>
                <button onClick={() => goToSection("artists")}>Artists</button>
                <button onClick={() => goToSection("about")}>About</button>
                <button onClick={() => goToSection("contact")}>Contact Us</button>
            </div>

            <button
                className="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
        </nav>
    );
}

export default Navbar;
