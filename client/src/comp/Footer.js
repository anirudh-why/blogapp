import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="footer-brand">
                <h3 className="gradient-text">TrekEase</h3>
                <p>Your ultimate guide to travel inspiration and adventure. Explore the world with TrekEase!</p>
              </div>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="https://github.com" className="social-link" aria-label="GitHub">
                  <FaGithub />
                </a>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-4">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-4 col-md-4">
              <h4>Categories</h4>
              <ul className="footer-links">
                <li><Link to="/articles?category=Mountains">Mountains</Link></li>
                <li><Link to="/articles?category=Beach">Beach</Link></li>
                <li><Link to="/articles?category=Adventure">Adventure</Link></li>
                <li><Link to="/articles?category=City">City</Link></li>
                <li><Link to="/articles?category=Culture">Culture</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p>&copy; {new Date().getFullYear()} TrekEase. All rights reserved.</p>
            </div>
            <div className="col-md-6">
              <ul className="footer-bottom-links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
