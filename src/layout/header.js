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
    <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
               <div className="col-4 pe-0">
                <ul className=''>
                    <li><FontAwesomeIcon icon={faEnvelopeOpen} /> salam@homeon.pk</li>
                </ul>				
            </div>
            <div className='col-md-6 col-8 d-flex justify-content-end align-items-center'>
      <div>
      <NavLink to={'/schedule-meeting'}  className="upper-navbar-btn1 d-flex align-items-center me-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-calendar">
  <rect x="3" y="4" width="9" height="9" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
  <path d="M12 14h0"></path>
</svg> &nbsp;&nbsp;Schedule a Meeting</NavLink>
      </div>
                    <div>
      <NavLink to={'/submit-project'} className="upper-navbar-btn  d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" class="_5dc37518" viewBox="0 0 32 32"><path d="M16-.1a2.8 2.8 0 0 0-2.8 2.8v10.4H2.8c-1.6 0-2.8 1.3-2.8 2.8s1.3 2.8 2.8 2.8h10.4v10.4c0 1.6 1.3 2.8 2.8 2.8s2.8-1.3 2.8-2.8V18.8h10.4c1.6 0 2.8-1.3 2.8-2.8s-1.3-2.8-2.8-2.8H18.8V2.8c0-1.6-1.2-2.9-2.8-2.9z"></path></svg>&nbsp; Add Property</NavLink>
      </div>
            </div>

            {/* <div className="col-md-3 d-md-block d-none">
                <ul className='d-flex justify-content-end gap-3'>
                    <li><FontAwesomeIcon icon={faEnvelopeOpen} /> salam@homeon.pk</li>
                </ul>				
            </div> */}
        </div>
    </div>
    </div>
    <div className='container'>
    <nav className="row navbar navbar-expand-lg">
            <div className='col-md-2 col-3 d-flex justify-content-start logo-homeon'><NavLink to={'/'}><img src="/assets/logo.webp" alt="Logo" className='img-fluid' /></NavLink></div>
            <div className='col-lg-7 col-md-6 col-1 d-flex justify-content-center'>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header d-flex justify-content-center d-lg-none d-block">
            <NavLink to={'/'}> <img src="/assets/logo.webp" alt="Logo" width="90" /></NavLink>
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
                    {/* <li className="nav-item">
                        <NavLink className={`nav-link d-flex justify-content-between ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')} to={'/contact'}>CONTACT<i className="fa fa-chevron-right d-lg-none d-block"></i></NavLink>
                    </li> */}
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
            <div className='col-lg-3 col-md-4 col-8 d-flex justify-content-end gap-3 flex-wrap align-items-center'>
            {(() => {

  return (
    <>
      <div>
      <NavLink to={'/contact'} className="btn-custom">Contact Us</NavLink>
      </div>
    </>
  );
})()}

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
