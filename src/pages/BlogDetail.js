import React, { useEffect, useMemo, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import '../css/blog.css'
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.13:3002';
import { API_BASE_URL } from '../api';
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resolveMediaUrl = (name) => {
    if (name && /^data:image\//i.test(String(name))) return name;
    if (!name) return '';
    if (/^https?:\/\//i.test(String(name))) return name;
    const base = MEDIA_BASE_URL.replace(/\/$/, '');
    const file = String(name).replace(/^\//, '');
    return `${base}/${file}`;
  };

  const imageUrls = useMemo(() => {
    if (!blog) return [];
    const urls = [];
    if (blog.featuredImage) urls.push(resolveMediaUrl(blog.featuredImage));
    let arr = [];
    try {
      if (Array.isArray(blog.images)) arr = blog.images;
      else if (typeof blog.images === 'string' && blog.images.trim()) arr = JSON.parse(blog.images);
    } catch {}
    for (const item of arr) {
      const candidate = (item && (item.url || item.name)) || item;
      const u = resolveMediaUrl(candidate);
      if (u) urls.push(u);
    }
    return urls;
  }, [blog]);

  const fetchBlog = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/blogs/${id}`);
      setBlog(res.data || null);
    } catch (err) {
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  return (
    <>
      <div className='contactUs-bg'>
        <NavBar/>
        <div className="dlab-bnr-inr d-flex align-items-center">
          <div className="container">
            <div className="dlab-bnr-inr-entry text-md-start text-center">
              <h1>Blog Detail</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><NavLink to={'/'}><i className="las fa-home me-2"></i>Home</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to={'/blog'}>Blog</NavLink></li>
                  <li className="breadcrumb-item active" aria-current="page">Detail</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 24, marginBottom: 40 }}>
        {loading && <p className="text-center"><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        {!loading && !error && blog && (

<div className="container py-5 blog-detail-page">

  <div className="row g-4">

    {/* LEFT CONTENT */}
    <div className="col-lg-8">

      {/* Category + Date */}
      <div className="d-flex align-items-center gap-3 mb-3">
        {blog.category && (
          <span className="badge bg-success text-uppercase px-3 py-2">
            {blog.category}
          </span>
        )}
        {blog.publishDate && (
          <span className="text-muted small">
            <i className="far fa-calendar-alt me-1"></i>
            {new Date(blog.publishDate).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric"
            })}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="fw-bold mb-4 blog-title">{blog.title}</h1>

      {/* Main Image */}
      {imageUrls[0] && (
        <img src={imageUrls[0]} className="img-fluid rounded mb-4 shadow-sm" alt={blog.title} />
      )}

      {/* Description Section */}
      {blog.description && (
        <p className="lead text-dark lh-lg mb-4">{blog.description}</p>
      )}

      {/* Multiple Descriptions */}
      {blog.descriptions?.length > 0 && blog.descriptions.map((desc, i) => (
        <div key={i} className="p-3 mb-3 rounded desc-box">
          <p className="mb-0">{desc}</p>
        </div>
      ))}

      {/* Blog Content */}
      {blog.content && (
        <div className="blog-content mb-4">{blog.content}</div>
      )}

      {/* Additional Images */}
      {imageUrls.length > 1 && (
        <>
          <h3 className="fw-semibold mb-3">Property Gallery</h3>
          <div className="row g-3">
            {imageUrls.slice(1).map((url, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="ratio ratio-16x9">
                  <img src={url} className="rounded gallery-img" alt={`img-${idx}`} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>

    {/* RIGHT SIDEBAR */}
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm p-4 info-card">

        <h5 className="fw-bold mb-3">Blog Information</h5>

        <ul className="list-unstyled mb-0">
          {blog.tags && (
            <li className="mb-2"><strong>Tags:</strong> {blog.tags}</li>
          )}
          {blog.slug && (
            <li className="mb-2"><strong>Slug:</strong> {blog.slug}</li>
          )}
          {blog.metaTitle && (
            <li className="mb-2"><strong>SEO Title:</strong> {blog.metaTitle}</li>
          )}
          {blog.metaDescription && (
            <li className="mb-2"><strong>SEO Description:</strong> {blog.metaDescription}</li>
          )}
          {blog.createdAt && (
            <li className="mb-2"><strong>Created:</strong> {new Date(blog.createdAt).toLocaleString()}</li>
          )}
          {blog.updatedAt && (
            <li><strong>Updated:</strong> {new Date(blog.updatedAt).toLocaleString()}</li>
          )}
        </ul>

      </div>
    </div>

  </div>

</div>


        )}
      </div>

      <Footer/>
    </>
  );
};

export default BlogDetail;


