import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/adminLogin.css';
import NavBar from '../layout/header';
import '../css/homepage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink} from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Only if installed via npm
import { faClock,faEnvelopeOpen,faPhoneVolume ,faMapMarkerAlt  } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const AdminLogin = () => {
  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.13:3002';
  console.log('Environment API URL:', process.env.REACT_APP_API_URL);
  console.log('Using API URL:', API_BASE_URL);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        // Login successful
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminToken', response.data.token || 'logged-in');
        navigate('/admin-dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
       <div className='top-bar'>
    <div className="container d-md-block d-none">
        <div className="row d-flex justify-content-between">
            <div className="col-6">
                <ul className='d-flex justify-content-start gap-3'>
                    <li><FontAwesomeIcon icon={faPhoneVolume } /> 0325-5255255</li>
                </ul>
            </div>
            <div className="col-6">
                <ul className='d-flex justify-content-end gap-3'>
                    <li><FontAwesomeIcon icon={faEnvelopeOpen} /> salam@homeon.pk</li>
                </ul>				
            </div>
        </div>
    </div>
    </div>
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo">
              <img src="assets/logo.webp" alt="Homeon Logo" />
            </div>
            <h1>Admin Login</h1>
            <p>Welcome back! Please enter your credentials to access the admin panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className={`admin-login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Demo Credentials:</p>
            <p><strong>Email:</strong> admin@homeon.pk</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 