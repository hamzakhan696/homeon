import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// API Base URL (adjust as per your environment)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.13:3002';
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;

const BlogTab = () => {
  const [showEditBlog, setShowEditBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
const [showCreateBlog, setShowCreateBlog] = useState(false);
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
  const [editBlog, setEditBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      console.log("Blogs",response)
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
  const handleEditBlog = (id) => {
  const selectedBlog = blogs.find((b) => b.id === id);
  if (selectedBlog) {
    setEditBlog(selectedBlog);
    setShowEditBlog(true);
  }
};

// ✅ Corrected: handleUpdateBlog
const handleUpdateBlog = async () => {
  if (!editBlog?.id) return alert('No blog selected');

  try {
    setLoading(true);

    // ✅ Only include fields that backend accepts
    const updatedData = {
      title: editBlog.title,
      description: editBlog.description,
        descriptions: editBlog.descriptions,
      category: editBlog.category,
      category: editBlog.content,
      status: editBlog.status,
      slug: editBlog.slug,
      metaTitle: editBlog.metaTitle,
      metaDescription: editBlog.metaDescription,
      allowComments: editBlog.allowComments,
      featureOnHomepage: editBlog.featureOnHomepage,
      tags: editBlog.tags,
      publishDate: editBlog.publishDate,
      content: editBlog.content,
      // ❌ featuredImage removed (backend doesn’t accept it)
    };

    // 🟩 API call
    const response = await axios.put(
      `${API_BASE_URL}/admin/blogs/${editBlog.id}`,
      updatedData
    );

    alert('✅ Blog updated successfully!');
    console.log("Update response:", response.data);
    setShowModal(false);

    // 🔄 Refresh blog list after update
    await fetchBlogs();

  } catch (err) {
    console.error('Update blog failed:', err);

    // Show proper backend message if available
    alert(err?.response?.data?.message || 'Failed to update blog.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h3 className='mb-3'>Blog Management</h3>
       <button
    className={`${showCreateBlog ? 'btn-custom' : 'btn-custom'}`}
    onClick={() => setShowCreateBlog(!showCreateBlog)}
  >
    {showCreateBlog ? (
      <>
        <i className="fas fa-arrow-left me-2"></i> Back to Blogs
      </>
    ) : (
      <>
        <i className="fas fa-plus me-2"></i> Create Blog
      </>
    )}
  </button>
  {showCreateBlog ? (
 <div className="blog-section mt-3">
      <div className="blog-form">
        <div className="form-section">
          <div className='row'>
          <div className="section-header">
            <i className="fas fa-edit"></i>
            <h3 c>Blog Information</h3>
          </div>
          </div>
<div className='row'>
  <div className='col-md-6 col-12'><div className="form-group">
            <label>Blog Title</label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              placeholder="Enter blog title" 
              value={formData.title}
              onChange={handleInputChange}
            />
          </div></div>
  <div className='col-md-6 col-12'><div className="form-group">
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
          </div></div>
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

  <div className="mt-3">
    <div className="d-flex align-items-center gap-2 mb-2">
      <label className="m-0 fw-bold">Additional Descriptions</label>
      <button 
        type="button" 
        className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center add-desc-btn"
        onClick={addDescription}
        title="Add another description"
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>

    {formData.descriptions.map((desc, index) => (
      <div key={index} className="mb-2 d-flex gap-2 align-items-start desc-item">
        <textarea 
          className="form-control flex-grow-1" 
          rows="3"
          placeholder={`Additional description ${index + 1}`}
          value={desc}
          onChange={(e) => handleDescriptionChange(index, e.target.value)}
        ></textarea>
        <button 
          type="button" 
          className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center remove-desc-btn"
          onClick={() => removeDescription(index)}
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
              rows="4"
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
                  className="btn-custom"
                  onClick={() => blogFeaturedImageInputRef.current?.click()}
                >
                  <i className="fas fa-upload me-2"></i>
                  Upload Featured Image
                </button>
              </div>
              <small>Max size 5MB, .jpg .png only</small>
              <input
                ref={blogFeaturedImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleBlogFeaturedImageUpload}
                className='d-none'
              />
            </div>
            
            {blogFeaturedImage && (
              <div className="uploaded-files">
                <h4>Featured Image</h4>
                <div className="file-item featured">
                  <span className="featured-badge mb-2">Featured</span>
                  <img src={blogFeaturedImage.url} alt={blogFeaturedImage.name} className='img-fluid'/>
                  <div className="file-info">
                    <span className="file-name">{blogFeaturedImage.name}</span>
                    <span className="file-size">{formatFileSize(blogFeaturedImage.size)}</span>
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
                        <div className="upload-tips d-flex justify-content-center">
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
                    className="btn-custom"
                    onClick={() => blogImageInputRef.current?.click()}
                  >
                    <i className="fas fa-upload me-2"></i>
                    Upload Images
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
              {blogImages.length > 0 && (
                <div className="uploaded-files">
                  <h4>Additional Images ({blogImages.length})</h4>
                  <div className="file-grid">
                    {blogImages.map((image) => (
                      <div key={image.id} className="file-item">
                        <img src={image.url} alt={image.name} className='img-fluid' />
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
                            <div className="upload-tips d-flex justify-content-center">
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
        <div className="form-section">
          <div className="section-header">
          <i class="fas fa-rocket"></i>
            <h3>Publishing Options</h3>
          </div>
          
          <div className="form-group">
            <label>Publish Status</label>
            <div className="radio-group radio-grp-cstm">
              <label className={`radio-option ${formData.status === 'draft' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="status" 
                  value="draft" 
                  checked={formData.status === 'draft'}
                  onChange={handleInputChange}
                />
                <i className="fas fa-save me-2"></i>
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
                <i className="fas fa-globe me-2"></i>
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

          <div className="form-group checkbox-label-cstm">
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

          <div className="form-group checkbox-label-cstm">
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
        <div className="form-actions">
          <button 
            className="btn-custom"
            onClick={handleCreateBlog}
            disabled={loading}
          >
            {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Publishing...</> : <><i className="fas fa-paper-plane me-2"></i>Publish Blog</>}
          </button>
        </div>
      </div>

      </div>
      )
      :showEditBlog ? (
  <div className="edit-blog-section mt-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>Edit Blog - {editBlog?.title}</h3>
      <button className="btn-custom" onClick={() => setShowEditBlog(false)}>
        <i className="fas fa-arrow-left me-2"></i> Back
      </button>
    </div>

    <div className="card p-4 shadow-sm">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.title || ''}
          onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={editBlog?.description || ''}
          onChange={(e) => setEditBlog({ ...editBlog, description: e.target.value })}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.category || ''}
          onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })}
        />
      </div>
            <div className="mb-3">
        <label className="form-label">Content</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.content || ''}
          onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
        />
      </div>
{editBlog?.descriptions?.map((desc, index) => (
  <div className="mb-3" key={index}>
    <label className="form-label">Description {index + 1}</label>
    <textarea
      className="form-control"
      rows="2"
      value={desc}
      onChange={(e) => {
        const updatedDescriptions = [...editBlog.descriptions];
        updatedDescriptions[index] = e.target.value;
        setEditBlog({ ...editBlog, descriptions: updatedDescriptions });
      }}
    ></textarea>
  </div>
))}
<button
  type="button"
  className="btn btn-outline-primary mb-3"
  onClick={() =>
    setEditBlog({
      ...editBlog,
      descriptions: [...(editBlog.descriptions || []), ""],
    })
  }
>
  <i className="fas fa-plus me-2"></i> Add Description
</button>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={editBlog?.status || ''}
          onChange={(e) => setEditBlog({ ...editBlog, status: e.target.value })}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Slug</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.slug || ''}
          onChange={(e) => setEditBlog({ ...editBlog, slug: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Meta Title</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.metaTitle || ''}
          onChange={(e) => setEditBlog({ ...editBlog, metaTitle: e.target.value })}
        />
      </div>
          <div className="mb-3">
        <label className="form-label">Meta Description</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.metaDescription || ''}
          onChange={(e) => setEditBlog({ ...editBlog, metaDescription: e.target.value })}
        />
      </div>
                <div className="mb-3">
        <label className="form-label">Tags</label>
        <input
          type="text"
          className="form-control"
          value={editBlog?.tags || ''}
          onChange={(e) => setEditBlog({ ...editBlog, tags: e.target.value })}
        />
      </div>

{/* 🏞️ Featured Image */}
{editBlog?.featuredImage && (
  <div className="featured-image mb-4">
    <label className="form-label fw-bold">Featured Image</label>
    <div className="d-flex align-items-center gap-3">
      <img
        src={editBlog.featuredImage}
        alt="Featured"
        style={{
          width: 120,
          height: 80,
          objectFit: "cover",
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />
    </div>
  </div>
)}

      {/* 🖼️ Show Images */}
      {editBlog?.images && editBlog.images.length > 0 && (
        <div className="blog-images mb-4">
          <label className="form-label fw-bold">Images</label>
          <div className="d-flex flex-wrap gap-2">
            {editBlog.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Blog"
                style={{
                  width: 100,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={editBlog?.allowComments || false}
          onChange={(e) => setEditBlog({ ...editBlog, allowComments: e.target.checked })}
        />
        <label className="form-check-label">Allow Comments</label>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={editBlog?.featureOnHomepage || false}
          onChange={(e) => setEditBlog({ ...editBlog, featureOnHomepage: e.target.checked })}
        />
        <label className="form-check-label">Feature on Homepage</label>
      </div>
      <div className="text-end">
        <button className="btn btn-success" onClick={handleUpdateBlog}>
          <i className="fas fa-save me-2"></i> Save Changes
        </button>
      </div>
    </div>
  </div>
)
      : (
            <div className="all-blogs-section mt-3">
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
        {loading && <p><i className="fas fa-spinner fa-spin"></i>Loading blogs...</p>}
        {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}
        {!loading && !error && blogs.length > 0 && (
<div className="blogs-section">
<div className="table-responsive shadow-sm rounded bg-white">
  <table className="table table-hover align-middle mb-0">
    <thead className="bg-success text-white text-center">
      <tr>
        <th>Image</th>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {blogs.map((blog) => {
        const imgSrc = resolveMediaUrl(blog.featuredImage);
        return (
          <tr key={blog.id}>
            <td>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={blog.title}
                  className="rounded"
                  width="70"
                  height="45"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                '-'
              )}
            </td>
            <td>{blog.title}</td>
            <td>
              {blog.description?.length > 50
                ? blog.description.slice(0, 50) + '...'
                : blog.description || '-'}
            </td>
            <td>
              <span
                className={`badge ${
                  blog.status === 'published'
                    ? 'bg-success'
                    : 'bg-secondary'
                }`}
              >
                {blog.status}
              </span>
            </td>
            <td className='action-buttons-custom'>
              <div className='action-button-flex'>
              <button
                  className="btn btn-sm btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#viewBlogModal"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <i className="fas fa-eye"></i>
                </button>
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => handleEditBlog(blog.id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteBlog(blog.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
 <div
        className="modal fade"
        id="viewBlogModal"
        tabIndex="-1"
        aria-labelledby="viewBlogModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="viewBlogModalLabel">
                {selectedBlog?.title || "Blog Details"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedBlog ? (
                <>
                  <div className="mb-3 text-center">
                    {selectedBlog.featuredImage && (
                      <img
                        src={selectedBlog.featuredImage}
                        alt="Featured"
                        className="img-fluid rounded"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    )}
                  </div>

                  <p>
                    <strong>Category:</strong> {selectedBlog.category}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        selectedBlog.status === "published"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {selectedBlog.status}
                    </span>
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedBlog.description}
                  </p>
                  {selectedBlog.descriptions.map((desc, index) => (
  <div key={index} className="mb-2">
    <strong>Description {index + 1}:</strong>
    <p>{desc}</p>
  </div>
))}
                  <p>
                    <strong>Content:</strong> {selectedBlog.content}
                  </p>
                  <p>
                    <strong>Meta Title:</strong> {selectedBlog.metaTitle}
                  </p>
                 <p>
  <strong>Comments:</strong>{' '}
  {selectedBlog.allowComments ? 'Allowed' : 'Not Allowed'}
</p>
                 <p>
  <strong>Feature On Homepage:</strong>{' '}
  {selectedBlog.featureOnHomepage ? 'Allowed' : 'Not Allowed'}
</p>

                  <p>
                    <strong>Meta Description:</strong>{" "}
                    {selectedBlog.metaDescription}
                  </p>
                  <p>
                    <strong>Tags:</strong> {selectedBlog.tags}
                  </p>
                   <p>
                    <strong>Slug Url:</strong> {selectedBlog.slug}
                  </p>

                  {/* ✅ Show Gallery Images */}
                  {selectedBlog.images && selectedBlog.images.length > 0 && (
                    <>
                      <h6 className="mt-4 fw-bold">Gallery Images:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedBlog.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Blog"
                            className="rounded"
                            width="100"
                            height="70"
                            style={{ objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p>No blog selected.</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
</div>

        )}
      </div>
      )}

    </div>
  );
};

export default BlogTab;
