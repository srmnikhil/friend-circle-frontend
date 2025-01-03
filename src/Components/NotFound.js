import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFound;
