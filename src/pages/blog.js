import React, {useState} from 'react';
import '../css/blog.css'
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { NavLink } from 'react-router-dom';
const Blog = () => {  
  const [currentPage, setCurrentPage] = useState(1);
  const [displayText, setDisplayText] = useState(1);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);

    switch (pageNumber) {
      case 1:
        setDisplayText(1);
        break;
      case 2:
        setDisplayText(2);
        break;
      case 3:
        setDisplayText(3);
        break;
      default:
        setDisplayText('');
    }
  };
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };
  const handleNextClick = () => {
    if (currentPage < 3) {
      handlePageClick(currentPage + 1);
    }
  };
  return (
    <div>
        <div className='contactUs-bg'>
    <NavBar/>
    <div className="dlab-bnr-inr d-flex align-items-center">
        <div className="container">
        <div className="dlab-bnr-inr-entry text-md-start text-center">
        <h1>BLOG</h1>
    <nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
        <ul className="breadcrumb">
        <li className="breadcrumb-item"><NavLink to={'/home'}><i className="las fa-home me-2"></i>Home</NavLink></li>
        <li className="breadcrumb-item active" aria-current="page">Blog</li>
    </ul>
    </nav>
    </div>
    </div>
    </div>
     </div>
     <div className='whatsapp-position-custom'>
     <a href="https://wa.me/923255255255" className='whatsapp' target='_blank'>
          <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="70"
      height="70"
      viewBox="0 0 48 48"
      className="whatsapp-logo"
    >
      <path
        fill="#fff"
        d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"
      ></path>
      <path
        fill="#fff"
        d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"
      ></path>
      <path
        fill="#40c351"
        d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"
      ></path>
      <path
        fill="#40c351"
        d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"
      ></path>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z"
        clipRule="evenodd"
      ></path>
    </svg>
    </a>
    </div>
    <div className="container">
    {displayText===1 && 
  <div className="row mt-5">
    <div className='col-lg-12 col-md-6 col-12'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/blog1.jpg" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 5, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Affordable Apartments in Karachi</h3>
            <p className='dlab-blog-text1'>Discover luxurious yet affordable apartments in Karachi with flexible installment plans. Perfect for families and investors looking for high returns in the booming real estate market.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-lg-5 mt-md-0 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-5 col-12 order-lg-1 order-2 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 8, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Investment in Bahria Town Islamabad</h3>
            <p className='dlab-blog-text1'>Bahria Town Islamabad offers exceptional opportunities for local and overseas investors with world-className amenities, strategic location, and secure investment options.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
        <div className='col-lg-7 col-12 order-lg-2 order-1'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/blog2.jpg" alt="" className='img-fluid'/>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news1.webp" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 10, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Premium Commercial Properties</h3>
            <p className='dlab-blog-text1'>Explore premium commercial properties in Lahore with flexible payments and guaranteed high returns for businesses looking for strategic locations.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12  mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-5 col-12 order-lg-1 order-2 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 12, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Modern Apartments on Installments</h3>
            <p className='dlab-blog-text1'>HomeOn offers the latest apartments in Karachi and Islamabad with easy installment options for both local and overseas investors.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
        <div className='col-lg-7 col-12 order-lg-2 order-1'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news2.webp" alt="" className='img-fluid'/>
          </div>
        </div>
      </div>
    </div>
</div>
}
{displayText===2 && 
<div className="row mt-5">
    <div className='col-lg-12 col-md-6 col-12'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news3.webp" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 15, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Investment in Bahria Town Lahore</h3>
            <p className='dlab-blog-text1'>Bahria Town Lahore is an ideal investment destination with a range of residential and commercial properties available at competitive prices.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-lg-5 mt-md-0 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-5 col-12 order-lg-1 order-2 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 18, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Luxury Homes in Bahria Town Lahore</h3>
            <p className='dlab-blog-text1'>Explore the best luxury homes available in Lahore, offering the latest amenities and a premium living experience in the heart of the city.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
        <div className='col-lg-7 col-12 order-lg-2 order-1'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/blog1.jpg" alt="" className='img-fluid'/>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/blog2.jpg" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 20, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Top Investment Properties in Bahria Town Karachi</h3>
            <p className='dlab-blog-text1'>Discover the most profitable investment properties in Bahria Town Karachi, a secure and well-developed community with excellent future prospects.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-5 col-12 order-lg-1 order-2 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 23, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Investing in Commercial Plots in Islamabad</h3>
            <p className='dlab-blog-text1'>Looking for commercial plots in Islamabad? Here's everything you need to know about lucrative commercial real estate investment opportunities in the capital city.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
        <div className='col-lg-7 col-12 order-lg-2 order-1'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news3.webp" alt="" className='img-fluid'/>
          </div>
        </div>
      </div>
    </div>
    </div>
}{displayText===3 && 
    <div className="row mt-5">
    <div className='col-lg-12 col-md-6 col-12'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news1.webp" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 25, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Top Locations for Real Estate Investment in Lahore</h3>
            <p className='dlab-blog-text1'>Explore the top locations for real estate investment in Lahore and discover how you can maximize your returns in this thriving market.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-lg-5 mt-md-0 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-5 col-12 order-lg-1 order-2 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 28, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Affordable Houses for Sale in Karachi</h3>
            <p className='dlab-blog-text1'>Explore affordable housing options for sale in Karachi, ideal for first-time buyers and investors looking for budget-friendly properties.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
        <div className='col-lg-7 col-12 order-lg-2 order-1'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/news2.webp" alt="" className='img-fluid'/>
          </div>
        </div>
      </div>
    </div>
    <div className='col-lg-12 col-md-6 col-12 mt-5'>
      <div className='row d-flex align-items-center'>
        <div className='col-lg-7 col-12'>
          <div className="dlab-media wow fadeIn">
            <img src="assets/blog1.jpg" alt="" className='img-fluid'/>
          </div>
        </div>
        <div className='col-lg-5 col-12 mt-lg-0 mt-4'>
          <div className="dlab-info">
            <div className="dlab-meta">
              <ul>
                <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>January 30, 2025</p></li>
                <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
              </ul>
            </div>
            <h3 className="dlab-title-blog">Investing in Property on Installments</h3>
            <p className='dlab-blog-text1'>Explore flexible property investment options on installments for both residential and commercial properties across Pakistan, offering an affordable way to enter the real estate market.</p>
            <div className="dlab-readmore">
              <a className="readmore"><i className="las la-plus"></i> Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
<div className="mt-5">
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a
              className="page-link"
              onClick={handlePreviousClick}
              href="#"
            >
              Previous
            </a>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
            <a
              className="page-link"
              onClick={() => handlePageClick(1)}
              href="#"
            >
              1
            </a>
          </li>
          <li className={`page-item ${currentPage === 2 ? 'active' : ''}`}>
            <a
              className="page-link"
              onClick={() => handlePageClick(2)}
              href="#"
            >
              2
            </a>
          </li>
          <li className={`page-item ${currentPage === 3 ? 'active' : ''}`}>
            <a
              className="page-link"
              onClick={() => handlePageClick(3)}
              href="#"
            >
              3
            </a>
          </li>
          <li className={`page-item ${currentPage === 3 ? 'disabled' : ''}`}>
            <a
              className="page-link"
              onClick={handleNextClick}
              href="#"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
      </div>
</div>

<Footer/>
</div>
  );
};

export default Blog;
