import React, { useEffect, useMemo, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../layout/header';
import Footer from '../layout/footer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.23.128.1:3002';
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
          <div className="row">
            <div className="col-lg-8 col-12">
              <h2 style={{ marginBottom: 12 }}>{blog.title}</h2>
              {blog.publishDate && (
                <p style={{ color: '#7f8c8d' }}>Published: {new Date(blog.publishDate).toLocaleDateString()}</p>
              )}
              {imageUrls[0] && (
                <img src={imageUrls[0]} alt={blog.title} className="img-fluid" style={{ borderRadius: 8, marginBottom: 16 }} />
              )}
              
              {/* Show all descriptions */}
              {blog.descriptions && blog.descriptions.length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  {blog.descriptions.map((desc, index) => (
                    <div key={index} style={{ 
                      marginBottom: index < blog.descriptions.length - 1 ? 15 : 0,
                      padding: 15,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 8,
                      borderLeft: '4px solid #63b330'
                    }}>
                      <p style={{ margin: 0, color: '#2c3e50', lineHeight: '1.6' }}>
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : blog.description ? (
                <div style={{ 
                  marginBottom: 20,
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 8,
                  borderLeft: '4px solid #63b330'
                }}>
                  <p style={{ margin: 0, color: '#2c3e50', lineHeight: '1.6' }}>
                    {blog.description}
                  </p>
                </div>
              ) : null}
              
              <div style={{ whiteSpace: 'pre-line', color: '#2c3e50' }}>{blog.content}</div>
              {imageUrls.length > 1 && (
                <>
                  <h4 style={{ marginTop: 24 }}>Additional Images</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {imageUrls.slice(1).map((url, idx) => (
                      <img key={idx} src={url} alt={`img-${idx}`} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="col-lg-4 col-12">
              <div className="card" style={{ border: '1px solid #eee', borderRadius: 8 }}>
                <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  {blog.category && <p className="card-text"><b>Category:</b> {blog.category}</p>}
                  {blog.tags && <p className="card-text"><b>Tags:</b> {blog.tags}</p>}
                  {blog.metaTitle && <p className="card-text"><b>Meta Title:</b> {blog.metaTitle}</p>}
                  {blog.metaDescription && <p className="card-text"><b>Meta Description:</b> {blog.metaDescription}</p>}
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


