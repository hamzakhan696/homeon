import React, { useState } from 'react';
import '../css/homepage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink} from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Only if installed via npm
import { faClock,faEnvelopeOpen,faPhoneVolume ,faMapMarkerAlt  } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
    const [activeLink, setActiveLink] = useState('');
    const handleNavClick = (link) => {
        setActiveLink(link);
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
    <div className='container'>
    <nav className="row navbar navbar-expand-lg">
            <div className='col-2 d-flex justify-content-start'><NavLink to={'/'}><img src="assets/logo.webp" alt="Logo" width="90" /></NavLink></div>
            <div className='col-7 d-flex justify-content-center'>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header d-flex justify-content-center d-lg-none d-block">
            <NavLink to={'/'}> <img src="assets/logo.webp" alt="Logo" width="90" /></NavLink>
            </div>
            <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                    <li className="nav-item">
                        <NavLink className={`nav-link d-flex justify-content-between ${activeLink === 'Home' ? 'active' : ''}`} onClick={() => handleNavClick('Home')} aria-current="page" to={'/'}>HOME<i className="fa fa-chevron-right d-lg-none d-block"></i></NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <a className={`nav-link dropdown-toggle d-flex justify-content-between ${activeLink === 'products' ? 'active' : ''}`} onClick={() => handleNavClick('products')} href="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            SERVICES<i className="fa fa-chevron-right d-lg-none d-block"></i>
                        </a>
                        <ul className="dropdown-menu main-menu" aria-labelledby="offcanvasNavbarDropdown">
                        <li className="border-bottom-custom">
                            <NavLink className="dropdown-item" to={'/consultancy'}><span>Consultancy</span></NavLink>
                        </li>
                            <li className="border-bottom-custom"><NavLink className="dropdown-item" to={'/projectSelling'} ><span>Project Selling</span></NavLink>
                            </li>
                            <li  className="border-bottom-custom"><NavLink className="dropdown-item" to={'/propertyManagement'}><span>Property Management</span></NavLink>
                            </li>
                            <li className='border-bottom-custom'><NavLink className="dropdown-item" to={'/transactions'}><span>Transactions</span></NavLink></li>
                            <li className='border-bottom-custom' ><NavLink className="dropdown-item" to={'/currentProject'}><span>Installment Housing</span></NavLink></li>
                            <li className='border-bottom-custom'><NavLink className="dropdown-item" to={'/turnkey'}><span>Turnkey
                            </span></NavLink></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <NavLink className={`nav-link d-flex justify-content-between ${activeLink === 'portfolio' ? 'active' : ''}`} onClick={() => handleNavClick('portfolio')} to={'/portfolio'}>PORTFOLIO<i className="fa fa-chevron-right d-lg-none d-block"></i></NavLink>

                    </li>
                    <li className="nav-item">
                        <NavLink className={`nav-link d-flex justify-content-between ${activeLink === 'blog' ? 'active' : ''}`} onClick={() => handleNavClick('blog')} to={'/blog'}>BLOG<i className="fa fa-chevron-right d-lg-none d-block"></i></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={`nav-link d-flex justify-content-between ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')} to={'/contact'}>CONTACT<i className="fa fa-chevron-right d-lg-none d-block"></i></NavLink>
                    </li>
                </ul>
                <div className="dlab-social-icon d-lg-none d-block d-flex gap-2 justify-content-center mt-4">
  <a href="https://www.facebook.com/homeonofficial" target="_blank" rel="noopener noreferrer">
    <i className="bi bi-facebook"></i>
  </a>
  <a href="https://www.tiktok.com/@homeon.pk" target="_blank" rel="noopener noreferrer">
    <i className="bi bi-tiktok"></i>
  </a>
  <a href="https://www.youtube.com/@Homeonofficial" target="_blank" rel="noopener noreferrer">
    <i className="bi bi-youtube"></i>
  </a>
  <a href="https://www.instagram.com/homeonofficial" target="_blank" rel="noopener noreferrer">
    <i className="bi bi-instagram"></i>
  </a>
                            </div>		
            </div>
        </div>
            </div>
            <div className='col-3 d-flex justify-content-end'>
            <button className="btn-custom d-lg-block d-none">Book Now</button>
            <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
    <span className="navbar-toggler-icon"></span>
</button>
            </div>
</nav>
    </div>
</div>
  );
};

export default Header;
