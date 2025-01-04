import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userIcon from '../assets/userIcon.svg';

export default function Navbar({ fetchUser }) {
    let navigate = useNavigate();
    let location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleLogout = () => {
        setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
        }, 100);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLinkClick = () => {
        setIsCollapsed(true); // Collapse the navbar when a link is clicked
    };

    return (
        <div className="header">
            <nav className="navbar fixed-top navbar-expand-lg bg-primary navbar-dark">
                <div className="container-fluid">
                    {/* FriendCircle Brand */}
                    <Link
                        className="navbar-brand"
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                        to={localStorage.getItem("token") ? '/dashboard' : '/'}
                    >
                        FriendCircle
                    </Link>

                    {/* Navbar Toggler for Mobile */}
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

                    {/* Right-Side Links */}
                    <div
                        className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`}
                        id="navbarSupportedContent"
                    >
                        <div className="ms-auto d-flex align-items-center">
                            {!localStorage.getItem("token") ? (
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''
                                                }`}
                                            aria-current="page"
                                            to={localStorage.getItem("token") ? '/dashboard' : '/'}
                                            onClick={handleLinkClick} // Collapse on link click
                                        >
                                            {localStorage.getItem("token") ? 'Dashboard' : 'Home'}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname === '/about' || location.pathname === '/dashboard' ? 'active' : ''
                                                }`}
                                            aria-current="page"
                                            to="/about"
                                            onClick={handleLinkClick}
                                        >
                                            About Us
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className="btn btn-light mx-1 rounded-2xl"
                                            to="/login"
                                            role="button"
                                            onClick={handleLinkClick}
                                            style={{ borderRadius: "2rem", backgroundColor: "lightgoldenrodyellow" }}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <div style={{ backgroundColor: "white", borderRadius: "50%", marginRight: "10px", height: "40px", width: "40px", padding: "7px" }}>
                                        <Link
                                            to="/user"
                                        >
                                            <img src={userIcon} alt="user-icon-image" style={{ height: "25px", width: "25px" }}
                                                onClick={() => {
                                                    handleLinkClick();
                                                    fetchUser();
                                                }} />
                                        </Link>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-danger">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
