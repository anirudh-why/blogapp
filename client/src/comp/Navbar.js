import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../redux/slices/userAuthorSlice';

const Navbar = () => {
  const { currentUser, loginUserStatus } = useSelector((state) => state.userAuthorLoginReducer);
  const dispatch = useDispatch();

  const signout = () => {
    dispatch(resetState());
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          TrekEase
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!loginUserStatus ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark" to="home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark" to="signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="signin">
                    <button className="btn btn-primary px-4">
                      Sign In
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span 
                    className="nav-link"
                    style={{
                      backgroundColor: '#f0f8ff',
                      color: '#007bff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '500',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Welcome, {currentUser.username}
                  </span>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link px-3" 
                    to="signin" 
                    onClick={signout}
                  >
                    <button 
                      className="btn" 
                      style={{
                        color: '#dc3545',
                        border: '1px solid #dc3545',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s, color 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#dc3545';
                      }}
                    >
                      Sign Out
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
