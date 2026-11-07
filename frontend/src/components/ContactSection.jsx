
import {
    MessageCircle,
    Mail,
    Phone,
    ArrowUpRight
} from "lucide-react";

import "./ContactSection.css";

function ContactSection() {

    const contactOptions = [
        {
            title: "WhatsApp",
            description: "Chat with us directly for artwork enquiries.",
            icon: MessageCircle,
            link: "https://wa.me/919905371792?text=Hello%21%20I%20visited%20your%20ART%C3%89%20Gallery%20website." +
                "%20Can%20I%20know%20more%20about%20your%20website%20and%20the%20artwork%20displayed%20there%3F",
            label: "Chat with us"
        },
        {
            title: "Email",
            description: "Send us your questions or detailed enquiries.",
            icon: Mail,
            link: "mailto:artistvikash97@gmail.com",
            label: "Send an email"
        },
        {
            title: "Phone",
            description: "Speak directly with the gallery owner.",
            icon: Phone,
            link: "tel:+919905371792",
            label: "Call us"
        }
    ];

    const socialLinks = [
        {
            title: "Instagram",
            symbol: "◎",
            link: "https://www.instagram.com/artistvikash2.0/"
        },
        {
            title: "Facebook",
            symbol: "f",
            link: "https://www.facebook.com/share/1F1HcRhsSc/"
        },
        {
            title: "YouTube",
            symbol: "▶",
            link: "https://youtube.com/shorts/GyWYZAAEHBM?si=anQK46wskNTvFaz1"
        }
    ];

    return (
        <div className="home-contact-section reveal" id="contact">

            <section className="contact-content">

                <div className="contact-heading">
                    <span>GET IN TOUCH</span>
                    <h2>Connect With ARTÉ</h2>
                    <p>
                        Choose your preferred way to contact us.
                    </p>
                </div>

                <div className="contact-grid">

                    {contactOptions.map((item) => {
                        const Icon = item.icon;

                        return (
                            <a
                                href={item.link}
                                className="contact-card"
                                key={item.title}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div className="contact-icon">
                                    <Icon size={25} />
                                </div>

                                <h3>{item.title}</h3>
                                <p>{item.description}</p>

                                <span className="contact-card-link">
                                    {item.label}
                                    <ArrowUpRight size={16} />
                                </span>
                            </a>
                        );
                    })}

                </div>

            </section>

            <section className="social-section">

                <span>FOLLOW OUR JOURNEY</span>

                <h2>Art Beyond The Gallery</h2>

                <p>
                    Explore our artwork, creative journey and latest updates
                    on social media.
                </p>

                <div className="social-links">

                    {socialLinks.map((item) => (
                        <a
                            href={item.link}
                            key={item.title}
                            aria-label={item.title}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="social-symbol">
                                {item.symbol}
                            </span>

                            <span>{item.title}</span>

                            <ArrowUpRight size={15} />
                        </a>
                    ))}

                </div>

            </section>

        </div>
    );
}

export default ContactSection;
