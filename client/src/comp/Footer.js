import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
//import './Footer.css'; // Importing CSS file for styling

function Footer() {
  return (
    <footer className="footer bg-dark text-white">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4">
            <h5>About TrekEase</h5>
            <p>Your ultimate guide to travel inspiration and adventure. Explore the world with TrekEase!</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="https://facebook.com"><FaFacebook /></a>
              <a href="https://twitter.com"><FaTwitter /></a>
              <a href="https://instagram.com"><FaInstagram /></a>
            </div>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-3">
        <p>&copy; {new Date().getFullYear()} TrekEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
