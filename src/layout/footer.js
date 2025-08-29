import React, {  } from 'react';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate('/contact');
  };
  const handleHome = () => {
    window.scrollTo(0, 0);
    navigate('/');
  }

  return (
    <div>
                        <div className="container-fluid px-0 mt-4">
  <img src="/assets/Website-img1.webp" className="img-fluid" alt="Background View" />
</div>
<footer className="site-footer" id="footer">
  <div className="footer-top pt-5 pb-5">
  <div className="container">
  <div className="row">
  <div className="col-lg-4 col-md-6 col-12">
  <div className="widget widget_about">
  <div className="footer-logo">
  <a onClick={handleHome}><img src="assets/logo3.webp" alt="" className='img-fluid' width="90"/></a>
</div>
<p className='footer_text mt-3'>Surround yourself with fresh energy, high-tech amenities, and elevated style. Indulge in extraordinary amenities, relax in appealing social spaces.</p>
</div>
</div>
<div className="col-lg-4 col-md-6 col-12 mt-4 mt-md-0">
  <div className="widget">
  <h5 className="footer-title">Contact Us</h5>
<div className="contact-info-bx">
  <div className='contact-info-bx-inner-text d-flex align-items-center'>
    <div><i className="las la-map-marker me-2"></i></div><p className='mb-0'><strong>Address</strong> 2nd Floor 61 Nishter Commercial, Bahria Town, Lahore</p></div>
<div className='contact-info-bx-inner-text d-flex align-items-center mt-3'><div><i className="las la-phone-volume me-2"></i></div><p className='mb-0'><strong>Call :-</strong> 0325-5255255</p></div>
<div className='contact-info-bx-inner-text mt-3'><i className="las la-envelope me-2"></i><strong>Email:-</strong> salam@homeon.pk
  </div>
</div>
</div>
</div>
<div className="col-lg-4 col-md-6 mt-md-4 mt-lg-0 col-12 mt-4 mt-md-0">
  <div className="widget widget-logo">
    <h5 className="footer-title">Our Business Channels</h5>
        <div className='row'>
          <div className='col-5'>
          <div className='footer-social'>
        <i className="fab fa-tiktok me-2" style={{ color: 'white', fontSize: '17px' }}></i>
        <a href="https://www.tiktok.com/@homeon.pk" target="_blank" >TikTok</a>
        </div>
          </div>
          <div className='col-7'>
            <div className='footer-social'>
      <i className="fab fa-youtube me-2" style={{  color: 'white', fontSize: '17px' }}></i>
      <a href="https://www.youtube.com/@Homeonofficial" target="_blank">YouTube</a>
          </div>
          </div>
          </div>
          <div className='row mt-3'>
        <div className='col-5'>
          <div className='footer-social'>
        <i className="fab fa-instagram me-2" style={{  color: 'white', fontSize: '17px' }}></i>
        <a href="https://www.instagram.com/homeonofficial" target="_blank">Instagram</a>
        </div>
        </div>
        <div className='col-7'>
          <div className='footer-social'>
        <i className="fab fa-facebook-f me-2" style={{ color: 'white', fontSize: '17px' }}></i>
        <a href="https://www.facebook.com/homeonofficial" target="_blank">Facebook</a>
        </div>
        </div>
        </div>
        <div className='row mt-3'>
      <div className='col-6'>
        <div className='footer-social'>
        <i className="fab fa-linkedin-in me-2" style={{ color: 'white', fontSize: '17px' }}></i>
        <a href="https://www.linkedin.com/company/homeonpk" target="_blank">LinkedIn</a>
      </div>
      </div>
      </div>
  </div>
</div>


</div>
</div>
</div>
<div className="footer-bottom pt-4 pb-2">
<div className="container">
<div className="row">
<div className="col-md-6 col-12 text-md-left text-center d-flex justify-content-md-start justify-content-center"> <p className='mb-0'>© 2024 HomeOn. All Right Reserved</p> </div>
<div className="col-md-6 col-12 text-md-right text-center d-flex justify-content-md-end justify-content-center mt-md-0 mt-4">
<div className="widget-link ">
<div className='d-flex gap-4'>
  <a onClick={handleHome}> About</a>
  <a onClick={handleClick}>Contact Us</a>
  <a> Privacy Policy</a>
</div>
</div>
</div>
</div>
</div>
</div>
</footer>
</div>
  );
};

export default Footer;
