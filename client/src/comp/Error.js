import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Error.css';

function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-number">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="error-buttons">
          <Link to="/home" className="btn-primary">
            Go to Home
          </Link>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
