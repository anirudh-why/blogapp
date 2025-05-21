import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const natureImages = [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % natureImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section">
      <div className="container position-relative">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-3 fw-bold text-white mb-4">
                Welcome to
                <span className="d-block">TrekEase</span>
              </h1>
              <p className="lead text-white mb-4 fw-normal">
                Discover a platform to share your stories and connect with a vibrant 
                community of adventurers, travelers, and storytellers.
              </p>
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg me-3">
                  Get Started <ArrowRight className="ms-2" />
                </Link>
                <Link to="/signin" className="btn btn-outline-light btn-lg">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className="image-carousel">
              {natureImages.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
              <div className="carousel-overlay"></div>
              <div className="carousel-dots">
                {natureImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose TrekEase?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3>Global Community</h3>
                <p>Connect with travelers from around the world and share your experiences</p>
                <div className="feature-hover-effect"></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-pen-fancy"></i>
                </div>
                <h3>Share Stories</h3>
                <p>Document your adventures and inspire others with your unique perspective</p>
                <div className="feature-hover-effect"></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <h3>Discover Places</h3>
                <p>Find hidden gems and popular destinations through our community</p>
                <div className="feature-hover-effect"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;