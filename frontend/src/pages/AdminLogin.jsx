
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Palette } from "lucide-react";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //
    //     // Actual authentication will be connected in a later step.
    //     alert("Login authentication will be connected soon.");
    // };
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Login failed.");
                return;
            }

            alert("Admin login successful!");

            navigate("/admin");

        } catch (error) {
            console.error("Login Error:", error);
            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="login-logo">
                    <Palette size={30} />
                    <h1>ARTÉ</h1>
                    <p>ART & PAINTING GALLERY</p>
                </div>

                <div className="login-heading">
                    <h2>Admin Login</h2>
                    <p>
                        Welcome back. Sign in to manage your gallery.
                    </p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="login-input-group">
                        <label>Email Address</label>

                        <div className="login-input-wrapper">
                            <Mail size={18} />

                            <input
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label>Password</label>

                        <div className="login-input-wrapper">
                            <LockKeyhole size={18} />

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-btn"
                    >
                        Sign In
                    </button>

                </form>

                <button
                    className="back-to-gallery"
                    onClick={() => navigate("/")}
                >
                    ← Back to Gallery
                </button>

                <div className="login-footer">
                    Secure Administration Portal
                </div>

            </div>

        </div>
    );
}

export default AdminLogin;
