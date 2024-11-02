import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="vh-100 d-flex align-items-center" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      </div>

      {/* Content */}
      <div className="container position-relative">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-3 fw-bold text-white mb-4">
              Welcome to
              <span className="d-block" style={{ color: '#4BB4DE' }}>TrekEase</span>
            </h1>
            <p className="lead text-white mb-4 fw-normal" style={{ fontSize: '1.3rem' }}>
              Discover a platform to share your stories and connect with a vibrant 
              community of adventurers, travelers, and storytellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;