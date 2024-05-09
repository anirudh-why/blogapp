import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Error.css'; // Import CSS file for styling

function Error() {
  return (
    <div className="error-container">
      <h1 className='display-2'>Oops! Page not found</h1>
      <p className="error-message">The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="btn btn-danger">Go to Home</Link>
    </div>
  );
}

export default Error;
