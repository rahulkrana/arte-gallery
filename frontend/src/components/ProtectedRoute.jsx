
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {

        const checkAuthentication = async () => {

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/auth/me`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }

            } catch (error) {
                console.error("Authentication Check Error:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();

    }, []);

    // Wait until the server responds
    if (isAuthenticated === null) {
        return <div>Checking admin access...</div>;
    }

    // Redirect unauthorized visitors
    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    // Display dashboard for authenticated admins
    return children;
}

export default ProtectedRoute;
