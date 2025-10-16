import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// API Base URL (adjust as per your environment)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.23.128.1:3002';
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;

const BlogTab = () => {
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    descriptions: [], // Array to store multiple descriptions
    content: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'draft',
    publishDate: '',
    allowComments: false,
    featureOnHomepage: false,
  });

  // State for file uploads
  const [blogFeaturedImage, setBlogFeaturedImage] = useState(null);
  const [blogImages, setBlogImages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers
  const resolveMediaUrl = (name, fileObj) => {
    if (name && /^data:image\//i.test(String(name))) return name;
    if (fileObj?.url) return fileObj.url;
    if (!name) return '';
    if (/^https?:\/\//i.test(String(name))) return name;
    const base = MEDIA_BASE_URL.replace(/\/$/, '');
    const file = String(name).replace(/^\//, '');
    return `${base}/${file}`;
  };

  // Refs for file inputs
  const blogImageInputRef = useRef(null);
  const blogFeaturedImageInputRef = useRef(null);

  // File upload handlers
  const handleBlogFeaturedImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType || !isValidSize) {
        alert('Please select a JPG/PNG image under 5MB.');
        return;
      }

      setBlogFeaturedImage({
        id: Date.now(),
        file: file,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleBlogImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are JPG/PNG and under 5MB.');
    }

    const newImages = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    setBlogImages(prev => [...prev, ...newImages]);
  };

  const removeBlogImage = (imageId) => {
    setBlogImages(prev => prev.filter(img => img.id !== imageId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle multiple descriptions
  const handleDescriptionChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => i === index ? value : desc)
    }));
  };

  const addDescription = () => {
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, '']
    }));
  };

  const removeDescription = (index) => {
    setFormData(prev => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index)
    }));
  };

  // Handle blog creation
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const {
        title, content, category, description, descriptions, tags,
        metaTitle, metaDescription, slug, status,
        publishDate, allowComments, featureOnHomepage
      } = formData;
  
      if (!title?.trim() || !content?.trim()) {
        setError('Title and content are required.');
        setLoading(false);
        return;
      }
  
      const hasFiles = Boolean(blogFeaturedImage || (blogImages && blogImages.length > 0));
  
      let response;
      if (!hasFiles) {
        // JSON path (no images)
        const payload = {
          title: String(title).trim(),
          content: String(content).trim(),
          ...(category ? { category: String(category).trim() } : {}),
          ...(description ? { description: String(description).trim() } : {}),
          ...(descriptions && descriptions.length > 0 ? { descriptions: descriptions.filter(d => d.trim()).map(d => String(d).trim()) } : {}),
          ...(tags ? { tags: String(tags).trim() } : {}),
          ...(metaTitle ? { metaTitle: String(metaTitle).trim() } : {}),
          ...(metaDescription ? { metaDescription: String(metaDescription).trim() } : {}),
          ...(slug ? { slug: String(slug).trim() } : {}),
          ...(status ? { status } : {}),
          ...(publishDate ? { publishDate } : {}),
          allowComments: Boolean(allowComments),
          featureOnHomepage: Boolean(featureOnHomepage),
        };
  
        response = await axios.post(`${API_BASE_URL}/admin/blogs`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Multipart path (images present)
        const fd = new FormData();
        const appendStr = (k, v) => v != null && v !== '' ? fd.append(k, String(v)) : null;
  
        appendStr('title', title);
        appendStr('content', content);
        appendStr('category', category);
        appendStr('description', description);
        if (descriptions && descriptions.length > 0) {
          descriptions.filter(d => d.trim()).forEach((desc, index) => {
            fd.append(`descriptions[${index}]`, String(desc).trim());
          });
        }
        appendStr('tags', tags);
        appendStr('metaTitle', metaTitle);
        appendStr('metaDescription', metaDescription);
        appendStr('slug', slug);
        appendStr('status', status);
        appendStr('publishDate', publishDate); // backend transforms to Date
        appendStr('allowComments', allowComments ? 'true' : 'false');
        appendStr('featureOnHomepage', featureOnHomepage ? 'true' : 'false');
  
        // Files: first file will be treated as featured by backend
        if (blogFeaturedImage?.file) {
          fd.append('files', blogFeaturedImage.file);
        }
        (blogImages || []).forEach(img => {
          if (img?.file) fd.append('files', img.file);
        });
  
        response = await axios.post(`${API_BASE_URL}/admin/blogs/create-with-media`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
  
      alert('Blog created successfully!');
      setFormData({
        title: '',
        category: '',
        description: '',
        descriptions: [],
        content: '',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        slug: '',
        status: 'draft',
        publishDate: '',
        allowComments: false,
        featureOnHomepage: false,
      });
      setBlogFeaturedImage(null);
      setBlogImages([]);
      fetchBlogs();
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      if (Array.isArray(serverMsg)) setError(serverMsg.join(', '));
      else if (typeof serverMsg === 'string') setError(serverMsg);
      else setError('Failed to create blog. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/blogs`);
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load blogs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this blog?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/blogs/${id}`);
      alert('Blog deleted successfully');
      await fetchBlogs();
    } catch (err) {
      console.error('Delete blog failed:', err);
      const msg = err?.response?.data?.message || 'Failed to delete blog';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="blog-section">
      <h2>Blog Management</h2>

      {/* Blog Form */}
      <div className="blog-form">
        <div className="form-section">
          <div className="section-header">
            <i className="fas fa-edit"></i>
            <h3>Blog Information</h3>
          </div>
          
          <div className="form-group">
            <label>Blog Title</label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              placeholder="Enter blog title" 
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Blog Category</label>
            <select 
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Property Investment">Property Investment</option>
              <option value="Home Improvement">Home Improvement</option>
              <option value="Market Trends">Market Trends</option>
              <option value="Legal Advice">Legal Advice</option>
              <option value="Tips & Guides">Tips & Guides</option>
            </select>
          </div>

          <div className="form-group">
            <label>Blog Description</label>
            <textarea 
              name="description"
              className="form-control" 
              rows="4"
              placeholder="Enter a brief description of the blog post"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            
            {/* Multiple Descriptions Section */}
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <label style={{ margin: 0, fontWeight: 'bold' }}>Additional Descriptions</label>
                <button 
                  type="button" 
                  className="btn btn-sm btn-success"
                  onClick={addDescription}
                  style={{ 
                    borderRadius: '50%', 
                    width: '30px', 
                    height: '30px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 0
                  }}
                  title="Add another description"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              {formData.descriptions.map((desc, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    placeholder={`Additional description ${index + 1}`}
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    style={{ flex: 1 }}
                  ></textarea>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => removeDescription(index)}
                    style={{ 
                      borderRadius: '50%', 
                      width: '30px', 
                      height: '30px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: 0
                    }}
                    title="Remove this description"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              
              {formData.descriptions.length > 0 && (
                <small className="text-muted">
                  First description will be shown on blog listing page. All descriptions will be shown on blog detail page.
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Blog Content</label>
            <textarea 
              name="content"
              className="form-control" 
              rows="12"
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input 
              type="text" 
              name="tags"
              className="form-control" 
              placeholder="Enter tags separated by commas" 
              value={formData.tags}
              onChange={handleInputChange}
            />
            <small className="text-muted">Example: real estate, investment, property</small>
          </div>
        </div>

        {/* Blog Images Section */}
        <div className="form-section">
          <div className="section-header">
            <i className="fas fa-images"></i>
            <h3>Blog Images</h3>
          </div>
          
          <div className="upload-section">
            <div className="upload-area">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Upload Featured Image for Blog</p>
              <div className="upload-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => blogFeaturedImageInputRef.current?.click()}
                >
                  <i className="fas fa-upload"></i>
                  Upload Featured Image
                </button>
                <button className="btn btn-outline">
                  Image Bank
                </button>
              </div>
              <small>Max size 5MB, .jpg .png only</small>
              <input
                ref={blogFeaturedImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleBlogFeaturedImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Featured Image Display */}
            {blogFeaturedImage && (
              <div className="uploaded-files">
                <h4>Featured Image</h4>
                <div className="file-item featured">
                  <img src={blogFeaturedImage.url} alt={blogFeaturedImage.name} />
                  <div className="file-info">
                    <span className="file-name">{blogFeaturedImage.name}</span>
                    <span className="file-size">{formatFileSize(blogFeaturedImage.size)}</span>
                    <span className="featured-badge">Featured</span>
                  </div>
                  <div className="file-actions">
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => setBlogFeaturedImage(null)}
                      title="Remove featured image"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="upload-tips">
              <div className="tip">
                <i className="fas fa-check"></i>
                <span>Blogs with images get 3x more engagement.</span>
              </div>
              <div className="tip">
                <i className="fas fa-check"></i>
                <span>Use high-quality images with proper dimensions.</span>
              </div>
              <div className="tip">
                <i className="fas fa-check"></i>
                <span>Recommended size: 1200x630 pixels.</span>
              </div>
            </div>
          </div>
          
          {/* Additional Blog Images Section */}
          <div className="form-section">
            <div className="section-header">
              <i className="fas fa-images"></i>
              <h3>Additional Blog Images</h3>
            </div>
            
            <div className="upload-section">
              <div className="upload-area">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Upload Additional Images for Blog</p>
                <div className="upload-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => blogImageInputRef.current?.click()}
                  >
                    <i className="fas fa-upload"></i>
                    Upload Images
                  </button>
                  <button className="btn btn-outline">
                    Image Bank
                  </button>
                </div>
                <small>Max size 5MB, .jpg .png only</small>
                <input
                  ref={blogImageInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleBlogImagesUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Additional Images Display */}
              {blogImages.length > 0 && (
                <div className="uploaded-files">
                  <h4>Additional Images ({blogImages.length})</h4>
                  <div className="file-grid">
                    {blogImages.map((image) => (
                      <div key={image.id} className="file-item">
                        <img src={image.url} alt={image.name} />
                        <div className="file-info">
                          <span className="file-name">{image.name}</span>
                          <span className="file-size">{formatFileSize(image.size)}</span>
                        </div>
                        <div className="file-actions">
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => removeBlogImage(image.id)}
                            title="Remove image"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="upload-tips">
                <div className="tip">
                  <i className="fas fa-check"></i>
                  <span>Additional images help tell your story better.</span>
                </div>
                <div className="tip">
                  <i className="fas fa-check"></i>
                  <span>Use relevant images that complement your content.</span>
                </div>
                <div className="tip">
                  <i className="fas fa-check"></i>
                  <span>Optimize images for web to improve loading speed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="form-section">
          <div className="section-header">
            <i className="fas fa-search"></i>
            <h3>SEO Settings</h3>
          </div>
          
          <div className="form-group">
            <label>Meta Title</label>
            <input 
              type="text" 
              name="metaTitle"
              className="form-control" 
              placeholder="Enter meta title for SEO" 
              value={formData.metaTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Meta Description</label>
            <textarea 
              name="metaDescription"
              className="form-control" 
              rows="3"
              placeholder="Enter meta description for SEO"
              value={formData.metaDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>URL Slug</label>
            <input 
              type="text" 
              name="slug"
              className="form-control" 
              placeholder="Enter URL slug" 
              value={formData.slug}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Publishing Options */}
        <div className="form-section">
          <div className="section-header">
            <i className="fas fa-publish"></i>
            <h3>Publishing Options</h3>
          </div>
          
          <div className="form-group">
            <label>Publish Status</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.status === 'draft' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="status" 
                  value="draft" 
                  checked={formData.status === 'draft'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                <i className="fas fa-save"></i>
                Draft
              </label>
              <label className={`radio-option ${formData.status === 'published' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="status" 
                  value="published" 
                  checked={formData.status === 'published'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                <i className="fas fa-globe"></i>
                Published
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Publish Date</label>
            <input 
              type="datetime-local" 
              name="publishDate"
              className="form-control" 
              value={formData.publishDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="allowComments"
                checked={formData.allowComments}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Allow comments on this blog post
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="featureOnHomepage"
                checked={formData.featureOnHomepage}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Feature this blog post on homepage
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          {/* <button 
            className="btn btn-primary btn-lg"
            onClick={handleCreateBlog}
            disabled={loading}
          >
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save as Draft</>}
          </button> */}
          <button 
            className="btn btn-success btn-lg"
            onClick={handleCreateBlog}
            disabled={loading}
          >
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Publishing...</> : <><i className="fas fa-paper-plane"></i> Publish Blog</>}
          </button>
        </div>
      </div>

      {/* All Blogs Section */}
      <div className="all-blogs-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>All Blogs</h2>
            <span className="badge badge-success" style={{ background: '#27ae60', color: '#fff', padding: '5px 10px', borderRadius: 12 }}>{blogs.length}</span>
          </div>
          <button type="button" className="btn btn-outline" onClick={fetchBlogs} disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Refreshing...</> : <><i className="fas fa-sync"></i> Refresh</>}
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
        {loading && <p><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
        {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}
        {!loading && !error && blogs.length > 0 && (
          <div className="blogs-table-container">
            <table className="attractive-table">
              <thead>
                <tr style={{ background: '#63b330', color: '#fff' }}>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Image</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Title</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Description</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Category</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Status</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Slug</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Tags</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Meta Title</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Publish Date</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Allow Comments</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Featured</th>
                  <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Created At</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => {
                  const imgSrc = resolveMediaUrl(blog.featuredImage);
                  let images = [];
                  try {
                    if (Array.isArray(blog.images)) images = blog.images;
                    else if (typeof blog.images === 'string' && blog.images.trim()) images = JSON.parse(blog.images);
                  } catch {}
                  const firstImage = images && images.length > 0 ? resolveMediaUrl(images[0]) : '';
                  const finalImg = imgSrc || firstImage || '';
                  return (
                    <tr key={blog.id} style={{ background: '#fff', transition: 'background 0.3s', borderBottom: '1px solid #ecf0f1' }}>
                      <td style={{ padding: '8px' }}>{finalImg ? <img src={finalImg} alt={blog.title} style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.title}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.description || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.category || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.status}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.slug || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.tags || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.metaTitle || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.publishDate ? new Date(blog.publishDate).toLocaleString() : '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.allowComments ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{blog.featureOnHomepage ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '12px', color: '#7f8c8d' }}>{blog.createdAt ? new Date(blog.createdAt).toLocaleString() : '-'}</td>
                      <td style={{ padding: '12px' }}>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteBlog(blog.id)} title="Delete blog">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTab;
