import React from 'react';
import "../assets/css/notfound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="not-found-background">
        <Link className='not-found-link' to="/dashboard">
          <svg height="0.8em" width="0.8em" viewBox="0 0 2 1" preserveAspectRatio="none">
            <polyline fill="none" stroke="#777777" strokeWidth="0.1" points="0.9,0.1 0.1,0.5 0.9,0.9" />
          </svg> Home
        </Link>
        <div className="not-found-background-wrapper">
          <h1 id="visual">404</h1>
        </div>
        <p>The page you’re looking for does not exist.</p>
      </div>
    </>
  );
}

export default NotFound;