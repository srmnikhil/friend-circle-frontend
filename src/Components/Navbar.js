import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ showToast, fetchUser }) {
    let navigate = useNavigate();
    let location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLogout = () => {
        showToast("You have logged out.", "success");
        setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
        }, 100);
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    const handleLinkClick = () => {
        setIsCollapsed(true); // Collapse the navbar when a link is clicked
    }

    return (
        <div className="header">
            <nav className="navbar fixed-top navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">FriendCircle</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleCollapse}
                        aria-controls="navbarSupportedContent"
                        aria-expanded={!isCollapsed}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/" || location.pathname === "/dashboard" ? "active" : ""}`}
                                    aria-current="page"
                                    to={localStorage.getItem("token") ? "/dashboard" : "/"}
                                    onClick={handleLinkClick} // Collapse on link click
                                >
                                    {localStorage.getItem("token") ? "Dashboard" : "Home"}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                                    to="/about"
                                    onClick={handleLinkClick} // Collapse on link click
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                        {!localStorage.getItem("token") ? (
                            <div className="d-flex" role="search">
                                <Link className="btn btn-primary mx-1" to="/register" role="button" onClick={handleLinkClick}>Register</Link>
                                <Link className="btn btn-primary mx-1" to="/login" role="button" onClick={handleLinkClick}>Login</Link>
                            </div>
                        ) : (
                            <div>
                                <Link className="btn btn-primary mx-1" to="/user" role="button" onClick={() => { handleLinkClick(); fetchUser(); }}>
                                    User Detail
                                </Link>
                                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}
