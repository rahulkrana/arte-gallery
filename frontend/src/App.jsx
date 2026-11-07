
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
// import Contact from "./pages/Contact";
import ArtworkDetails from "./pages/ArtworkDetails";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                {/*<Route path="/contact" element={<Contact />} />*/}

                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetails />}
                />

                <Route path="/admin-login" element={<AdminLogin />} />

                <Route

                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
