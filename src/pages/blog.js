import React, {useState, useEffect} from 'react';
import '../css/blog.css'
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.10.30:3002';
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;
const Blog = () => {  
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(blogs.length / pageSize));

  const resolveMediaUrl = (name) => {
    if (name && /^data:image\//i.test(String(name))) return name;
    if (!name) return '';
    if (/^https?:\/\//i.test(String(name))) return name;
    const base = MEDIA_BASE_URL.replace(/\/$/, '');
    const file = String(name).replace(/^\//, '');
    return `${base}/${file}`;
  };

  const getBlogImage = (blog) => {
    const featured = blog?.featuredImage ? resolveMediaUrl(blog.featuredImage) : '';
    let images = [];
    try {
      if (Array.isArray(blog?.images)) images = blog.images;
      else if (typeof blog?.images === 'string' && blog.images.trim()) images = JSON.parse(blog.images);
    } catch {}
    const first = images && images.length > 0 ? resolveMediaUrl(images[0]) : '';
    return featured || first || 'assets/portfolio1.jpg';
  };

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/blogs`);
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const paginatedBlogs = blogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageClick = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };
  return (
    <>
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
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="70" height="70" viewBox="0 0 48 48" className="whatsapp-logo">
            <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6 C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
            <path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6 C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3 L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path>
            <path fill="#40c351" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3 L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24 c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2 c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path>
            <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8 l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
            <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0 s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3 c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9 c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8 c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
          </svg>
        </a>
      </div>

      <div className="container">
        {loading && (
          <div className="text-center mt-5"><p><i className="fas fa-spinner fa-spin"></i> Loading blogs...</p></div>
        )}
        {error && (
          <div className="text-center mt-5"><p className="text-danger">{error}</p></div>
        )}
        {!loading && !error && paginatedBlogs.length > 0 && (
          <div className="row mt-5">
            {paginatedBlogs.map((blog, idx) => {
              const imageUrl = getBlogImage(blog);
              const leftImage = idx % 2 === 0; // alternate layout
              return (
                <div key={blog.id} className='col-lg-12 col-md-6 col-12 mt-0 mt-lg-5'>
                  <div className='row d-flex align-items-center'>
                    {leftImage && (
                      <div className='col-lg-7 col-12 order-lg-1 order-1'>
                        <div className="dlab-media wow fadeIn">
                          <img src={imageUrl} alt={blog.title} className='img-fluid'/>
                        </div>
                      </div>
                    )}
                    <div className={`col-lg-5 col-12 ${leftImage ? 'order-lg-2 order-2 mt-lg-0 mt-4' : 'order-lg-1 order-2 mt-lg-0 mt-4'}`}>
                      <div className="dlab-info">
                        <div className="dlab-meta">
                          <ul>
                            <li className="post-date d-flex align-items-center"><i className="las la-calendar-alt"></i><p className='mb-0'>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</p></li>
                            <li className="post-user d-flex align-items-center"><i className="las la-user"></i><p className='mb-0'>By HomeOn Team</p></li>
                          </ul>
                        </div>
                        <h3 className="dlab-title-blog">{blog.title}</h3>
                        <p className='dlab-blog-text1'>
                          {blog.descriptions && blog.descriptions.length > 0 
                            ? blog.descriptions[0] 
                            : blog.description || ''
                          }
                        </p>
                        <div className="dlab-readmore">
                          <NavLink to={`/blog/${blog.id}`} className="readmore"><i className="las la-plus"></i> Read More</NavLink>
                        </div>
                      </div>
                    </div>
                    {!leftImage && (
                      <div className='col-lg-7 col-12 order-lg-2 order-1'>
                        <div className="dlab-media wow fadeIn">
                          <img src={imageUrl} alt={blog.title} className='img-fluid'/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" onClick={handlePreviousClick} href="#">Previous</a>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                <a className="page-link" onClick={() => handlePageClick(p)} href="#">{p}</a>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a className="page-link" onClick={handleNextClick} href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>

      <Footer/>
    </>
  );
};

export default Blog;
