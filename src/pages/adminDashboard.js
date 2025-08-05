import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for projects form tabs
  const [activePropertyTab, setActivePropertyTab] = useState('home');
  const [activeSubtype, setActiveSubtype] = useState('house');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Studio');
  const [selectedBathrooms, setSelectedBathrooms] = useState('1');
  const [selectedPurpose, setSelectedPurpose] = useState('sell');

  // State for file uploads
  const [projectImages, setProjectImages] = useState([]);
  const [projectVideos, setProjectVideos] = useState([]);
  const [blogFeaturedImage, setBlogFeaturedImage] = useState(null);
  const [blogImages, setBlogImages] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]);

  // Refs for file inputs
  const projectImageInputRef = useRef(null);
  const projectVideoInputRef = useRef(null);
  const blogImageInputRef = useRef(null);
  const blogFeaturedImageInputRef = useRef(null);

  // Add this mapping after state declarations
  const propertySubtypes = {
    home: [
      { key: 'house', label: 'House', icon: 'fas fa-home' },
      { key: 'flat', label: 'Flat', icon: 'fas fa-building' },
      { key: 'upper', label: 'Upper Portion', icon: 'fas fa-level-up-alt' },
      { key: 'lower', label: 'Lower Portion', icon: 'fas fa-level-down-alt' },
      { key: 'farmhouse', label: 'Farm House', icon: 'fas fa-tree' },
      { key: 'room', label: 'Room', icon: 'fas fa-door-open' },
      { key: 'penthouse', label: 'Penthouse', icon: 'fas fa-crown' },
    ],
    plots: [
      { key: 'residential', label: 'Residential Plot', icon: 'fas fa-map-marker-alt' },
      { key: 'commercial', label: 'Commercial Plot', icon: 'fas fa-map-signs' },
      { key: 'agricultural', label: 'Agricultural Plot', icon: 'fas fa-tractor' },
      { key: 'industrial', label: 'Industrial Land', icon: 'fas fa-industry' },
    ],
    commercial: [
      { key: 'office', label: 'Office', icon: 'fas fa-briefcase' },
      { key: 'shop', label: 'Shop', icon: 'fas fa-store' },
      { key: 'warehouse', label: 'Warehouse', icon: 'fas fa-warehouse' },
      { key: 'factory', label: 'Factory Building', icon: 'fas fa-industry' },
      { key: 'other', label: 'Other', icon: 'fas fa-ellipsis-h' },
    ],
  };

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  // Handle property type tab changes
  const handlePropertyTabChange = (tab) => {
    setActivePropertyTab(tab);
    setActiveSubtype('house'); // Reset subtype when changing main tab
  };

  // Handle subtype selection
  const handleSubtypeChange = (subtype) => {
    setActiveSubtype(subtype);
  };

  // Handle bedroom selection
  const handleBedroomChange = (bedrooms) => {
    setSelectedBedrooms(bedrooms);
  };

  // Handle bathroom selection
  const handleBathroomChange = (bathrooms) => {
    setSelectedBathrooms(bathrooms);
  };

  // Handle purpose selection
  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
  };

  // File upload handlers
  const handleProjectImageUpload = (event) => {
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
      url: URL.createObjectURL(file),
      isCover: false
    }));

    setProjectImages(prev => [...prev, ...newImages]);
  };

  const handleProjectVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'].includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are valid video formats and under 50MB.');
    }

    const newVideos = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    setProjectVideos(prev => [...prev, ...newVideos]);
  };

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

  const handleYoutubeLinkAdd = () => {
    const link = prompt('Enter YouTube video URL:');
    if (link && link.includes('youtube.com')) {
      setYoutubeLinks(prev => [...prev, {
        id: Date.now(),
        url: link,
        title: `Video ${prev.length + 1}`
      }]);
    } else if (link) {
      alert('Please enter a valid YouTube URL.');
    }
  };

  const removeProjectImage = (imageId) => {
    setProjectImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeProjectVideo = (videoId) => {
    setProjectVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const removeBlogImage = (imageId) => {
    setBlogImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeYoutubeLink = (linkId) => {
    setYoutubeLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const setCoverImage = (imageId) => {
    setProjectImages(prev => prev.map(img => ({
      ...img,
      isCover: img.id === imageId
    })));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statsData = [
    { title: 'Total Properties', value: '1,247', icon: 'fas fa-home', color: '#63b330', change: '+12%' },
    { title: 'Active Projects', value: '23', icon: 'fas fa-building', color: '#2196F3', change: '+5%' },
    { title: 'Total Revenue', value: '$2.4M', icon: 'fas fa-dollar-sign', color: '#4CAF50', change: '+18%' },
    { title: 'New Inquiries', value: '156', icon: 'fas fa-users', color: '#FF9800', change: '+8%' }
  ];

  const recentActivities = [
    { action: 'New property added', time: '2 hours ago', type: 'property' },
    { action: 'Project status updated', time: '4 hours ago', type: 'project' },
    { action: 'New inquiry received', time: '6 hours ago', type: 'inquiry' },
    { action: 'Payment received', time: '1 day ago', type: 'payment' },
    { action: 'Contract signed', time: '2 days ago', type: 'contract' }
  ];

  const quickActions = [
    { title: 'Add Property', icon: 'fas fa-plus', color: '#63b330', action: () => console.log('Add Property') },
    { title: 'View Projects', icon: 'fas fa-eye', color: '#2196F3', action: () => console.log('View Projects') },
    { title: 'Manage Blog', icon: 'fas fa-blog', color: '#FF9800', action: () => console.log('Manage Blog') },
    { title: 'Generate Report', icon: 'fas fa-chart-bar', color: '#9C27B0', action: () => console.log('Generate Report') }
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src="assets/logo.webp" alt="Homeon Logo" className="sidebar-logo" />
          {!sidebarCollapsed && <h3>Admin Panel</h3>}
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''}>
              <button onClick={() => setActiveTab('overview')}>
                <i className="fas fa-tachometer-alt"></i>
                {!sidebarCollapsed && <span>Overview</span>}
              </button>
            </li>
            <li className={activeTab === 'properties' ? 'active' : ''}>
              <button onClick={() => setActiveTab('properties')}>
                <i className="fas fa-home"></i>
                {!sidebarCollapsed && <span>Properties</span>}
              </button>
            </li>
            <li className={activeTab === 'projects' ? 'active' : ''}>
              <button onClick={() => setActiveTab('projects')}>
                <i className="fas fa-building"></i>
                {!sidebarCollapsed && <span>Projects</span>}
              </button>
            </li>
            <li className={activeTab === 'blog' ? 'active' : ''}>
              <button onClick={() => setActiveTab('blog')}>
                <i className="fas fa-blog"></i>
                {!sidebarCollapsed && <span>Blog</span>}
              </button>
            </li>
            <li className={activeTab === 'reports' ? 'active' : ''}>
              <button onClick={() => setActiveTab('reports')}>
                <i className="fas fa-chart-bar"></i>
                {!sidebarCollapsed && <span>Reports</span>}
              </button>
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''}>
              <button onClick={() => setActiveTab('settings')}>
                <i className="fas fa-cog"></i>
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1>Dashboard</h1>
          </div>
          
          <div className="header-right">
            <div className="admin-profile">
              <img src="assets/astronaut.jpg" alt="Admin" className="admin-avatar" />
              <div className="admin-info">
                <span className="admin-name">Admin User</span>
                <span className="admin-role">Administrator</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* Stats Cards */}
              <div className="stats-grid">
                {statsData.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                      <i className={stat.icon}></i>
                    </div>
                    <div className="stat-content">
                      <h3>{stat.value}</h3>
                      <p>{stat.title}</p>
                      <span className="stat-change positive">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  {quickActions.map((action, index) => (
                    <button 
                      key={index} 
                      className="action-card"
                      onClick={action.action}
                      style={{ borderLeftColor: action.color }}
                    >
                      <i className={action.icon} style={{ color: action.color }}></i>
                      <span>{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="recent-activities">
                <h2>Recent Activities</h2>
                <div className="activities-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <i className={`fas fa-${activity.type === 'property' ? 'home' : 
                                        activity.type === 'project' ? 'building' : 
                                        activity.type === 'inquiry' ? 'users' : 
                                        activity.type === 'payment' ? 'dollar-sign' : 'file-contract'}`}></i>
                      </div>
                      <div className="activity-content">
                        <p>{activity.action}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-card">
                  <h3>Revenue Overview</h3>
                  <div className="chart-placeholder">
                    <i className="fas fa-chart-line"></i>
                    <p>Revenue chart will be displayed here</p>
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Property Distribution</h3>
                  <div className="chart-placeholder">
                    <i className="fas fa-chart-pie"></i>
                    <p>Property distribution chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="properties-section">
              <h2>Properties Management</h2>
              <p>Properties management interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-section">
              <h2>Projects Management</h2>
              
              {/* Progress Steps */}
              <div className="progress-steps">
                <div className="step active">
                  <i className="fas fa-info-circle"></i>
                  <span>Project Information</span>
                </div>
                <div className="step">
                  <i className="fas fa-dollar-sign"></i>
                  <span>Project Price</span>
                </div>
                <div className="step">
                  <i className="fas fa-images"></i>
                  <span>Project Images</span>
                </div>
              </div>

              {/* Project Form */}
              <div className="project-form">
                {/* Location and Purpose Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Location and Purpose</h3>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Purpose</label>
                    <div className="radio-group">
                      <label className={`radio-option ${selectedPurpose === 'sell' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="purpose" 
                          value="sell" 
                          checked={selectedPurpose === 'sell'}
                          onChange={() => handlePurposeChange('sell')}
                        />
                        <span className="radio-custom"></span>
                        <i className="fas fa-home"></i>
                        Sell
                      </label>
                      <label className={`radio-option ${selectedPurpose === 'rent' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="purpose" 
                          value="rent" 
                          checked={selectedPurpose === 'rent'}
                          onChange={() => handlePurposeChange('rent')}
                        />
                        <span className="radio-custom"></span>
                        <i className="fas fa-key"></i>
                        Rent
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Select Property Type</label>
                    <div className="property-tabs">
                      <button 
                        className={`tab-btn ${activePropertyTab === 'home' ? 'active' : ''}`}
                        onClick={() => handlePropertyTabChange('home')}
                      >
                        Home
                      </button>
                      <button 
                        className={`tab-btn ${activePropertyTab === 'plots' ? 'active' : ''}`}
                        onClick={() => handlePropertyTabChange('plots')}
                      >
                        Plots
                      </button>
                      <button 
                        className={`tab-btn ${activePropertyTab === 'commercial' ? 'active' : ''}`}
                        onClick={() => handlePropertyTabChange('commercial')}
                      >
                        Commercial
                      </button>
                    </div>
                    
                    <div className="property-subtypes">
                      {propertySubtypes[activePropertyTab].map((sub) => (
                        <button
                          key={sub.key}
                          className={`subtype-btn ${activeSubtype === sub.key ? 'active' : ''}`}
                          onClick={() => handleSubtypeChange(sub.key)}
                        >
                          <i className={sub.icon}></i>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <select className="form-control">
                      <option>Select City</option>
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Islamabad</option>
                      <option>Rawalpindi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" className="form-control" placeholder="Search Location" />
                  </div>
                </div>

                {/* Ad Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-file-alt"></i>
                    <h3>Ad Information</h3>
                  </div>
                  
                  <div className="form-group">
                    <label>Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter property title e.g. Beautiful House in DHA Phase 5" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      placeholder="Describe your property, it's features, area it is in etc."
                    ></textarea>
                  </div>
                </div>

                {/* Price and Area Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-tag"></i>
                    <h3>Price and Area</h3>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Area Size</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Enter Unit" />
                        <select className="form-control">
                          <option>Marla</option>
                          <option>Kanal</option>
                          <option>Sq Ft</option>
                          <option>Sq Yd</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Price</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Enter Price" />
                        <select className="form-control">
                          <option>PKR</option>
                          <option>USD</option>
                          <option>EUR</option>
                        </select>
                      </div>
                      <small className="text-muted">
                        <i className="fas fa-info-circle"></i>
                        Price Check
                      </small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Enable if listing is available on installments
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Enable if listing is ready for possession
                    </label>
                  </div>
                </div>

                {/* Features and Amenities Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-home"></i>
                    <h3>Features and Amenities</h3>
                  </div>
                  
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <div className="button-group">
                      {['Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map((num, index) => (
                        <button 
                          key={index} 
                          className={`btn btn-outline ${selectedBedrooms === num ? 'active' : ''}`}
                          onClick={() => handleBedroomChange(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bathrooms</label>
                    <div className="button-group">
                      {['1', '2', '3', '4', '5', '6', '6+'].map((num, index) => (
                        <button 
                          key={index} 
                          className={`btn btn-outline ${selectedBathrooms === num ? 'active' : ''}`}
                          onClick={() => handleBathroomChange(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Add additional features e.g. parking spaces, waste disposal, internet etc.</label>
                    <button className="btn btn-primary">
                      <i className="fas fa-plus"></i>
                      Add Amenities
                    </button>
                  </div>

                  <div className="quality-tip">
                    <i className="fas fa-check-circle"></i>
                    <span>Add at least 5 amenities</span>
                    <div className="progress">
                      <div className="progress-bar" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Property Images Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-images"></i>
                    <h3>Property Images and Videos</h3>
                  </div>
                  
                  <div className="upload-section">
                    <div className="upload-area">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Upload Images of your Property</p>
                      <div className="upload-buttons">
                        <button 
                          className="btn btn-primary"
                          onClick={() => projectImageInputRef.current?.click()}
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
                        ref={projectImageInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleProjectImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                    
                    {/* Uploaded Images Display */}
                    {projectImages.length > 0 && (
                      <div className="uploaded-files">
                        <h4>Uploaded Images ({projectImages.length})</h4>
                        <div className="file-grid">
                          {projectImages.map((image) => (
                            <div key={image.id} className="file-item">
                              <img src={image.url} alt={image.name} />
                              <div className="file-info">
                                <span className="file-name">{image.name}</span>
                                <span className="file-size">{formatFileSize(image.size)}</span>
                                {image.isCover && <span className="cover-badge">Cover</span>}
                              </div>
                              <div className="file-actions">
                                <button 
                                  className="btn btn-sm btn-outline"
                                  onClick={() => setCoverImage(image.id)}
                                  title="Set as cover image"
                                >
                                  <i className="fas fa-star"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeProjectImage(image.id)}
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
                        <span>Ads with pictures get 5x more views.</span>
                      </div>
                      <div className="tip">
                        <i className="fas fa-check"></i>
                        <span>Upload good quality pictures with proper lighting.</span>
                      </div>
                      <div className="tip">
                        <i className="fas fa-check"></i>
                        <span>Click the star icon to set cover image.</span>
                      </div>
                    </div>
                  </div>

                  <div className="quality-tip">
                    <i className="fas fa-check-circle"></i>
                    <span>Add at least 5 more images</span>
                    <div className="progress">
                      <div className="progress-bar" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  <div className="video-section">
                    <div className="section-header">
                      <i className="fas fa-video"></i>
                      <h4>Add Videos of your Property</h4>
                    </div>
                    <p>Add videos of your property from Youtube. Upload on Youtube and paste the link below.</p>
                    <div className="video-upload-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={() => projectVideoInputRef.current?.click()}
                      >
                        <i className="fas fa-upload"></i>
                        Upload Video Files
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={handleYoutubeLinkAdd}
                      >
                        <i className="fas fa-plus"></i>
                        Add YouTube Link
                      </button>
                    </div>
                    <small>Max size 50MB for video files. Supported formats: MP4, AVI, MOV, WMV</small>
                    <input
                      ref={projectVideoInputRef}
                      type="file"
                      multiple
                      accept="video/mp4,video/avi,video/mov,video/wmv"
                      onChange={handleProjectVideoUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {/* Uploaded Videos Display */}
                    {projectVideos.length > 0 && (
                      <div className="uploaded-files">
                        <h4>Uploaded Videos ({projectVideos.length})</h4>
                        <div className="file-grid">
                          {projectVideos.map((video) => (
                            <div key={video.id} className="file-item">
                              <video controls width="100" height="60">
                                <source src={video.url} type={video.file.type} />
                                Your browser does not support the video tag.
                              </video>
                              <div className="file-info">
                                <span className="file-name">{video.name}</span>
                                <span className="file-size">{formatFileSize(video.size)}</span>
                              </div>
                              <div className="file-actions">
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeProjectVideo(video.id)}
                                  title="Remove video"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* YouTube Links Display */}
                    {youtubeLinks.length > 0 && (
                      <div className="uploaded-files">
                        <h4>YouTube Links ({youtubeLinks.length})</h4>
                        <div className="youtube-links">
                          {youtubeLinks.map((link) => (
                            <div key={link.id} className="youtube-link-item">
                              <div className="link-info">
                                <i className="fab fa-youtube"></i>
                                <span className="link-title">{link.title}</span>
                                <span className="link-url">{link.url}</span>
                              </div>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => removeYoutubeLink(link.id)}
                                title="Remove link"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-phone"></i>
                    <h3>Contact Information</h3>
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Enter email address" />
                  </div>

                  <div className="form-group">
                    <label>Mobile</label>
                    <div className="input-group">
                      <select className="form-control">
                        <option>🇵🇰 +92</option>
                        <option>🇺🇸 +1</option>
                        <option>🇬🇧 +44</option>
                      </select>
                      <input type="tel" className="form-control" placeholder="Enter mobile number" />
                      <button className="btn btn-outline">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Landline</label>
                    <div className="input-group">
                      <select className="form-control">
                        <option>🇵🇰 +92</option>
                        <option>🇺🇸 +1</option>
                        <option>🇬🇧 +44</option>
                      </select>
                      <input type="tel" className="form-control" placeholder="Enter landline number" />
                    </div>
                  </div>
                </div>

                {/* Platform Selection Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-globe"></i>
                    <h3>Platform Selection</h3>
                  </div>
                  
                  <div className="platform-selection">
                    <div className="platform-card active">
                      <i className="fas fa-check-circle"></i>
                      <span>homeon.pk</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button className="btn btn-primary btn-lg">
                    <i className="fas fa-paper-plane"></i>
                    Submit Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
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
                      className="form-control" 
                      placeholder="Enter blog title" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Blog Category</label>
                    <select className="form-control">
                      <option>Select Category</option>
                      <option>Real Estate</option>
                      <option>Property Investment</option>
                      <option>Home Improvement</option>
                      <option>Market Trends</option>
                      <option>Legal Advice</option>
                      <option>Tips & Guides</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Blog Description</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      placeholder="Enter a brief description of the blog post"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Blog Content</label>
                    <textarea 
                      className="form-control" 
                      rows="12"
                      placeholder="Write your blog content here..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter tags separated by commas" 
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
                      className="form-control" 
                      placeholder="Enter meta title for SEO" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Meta Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      placeholder="Enter meta description for SEO"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>URL Slug</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter URL slug" 
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
                      <label className="radio-option active">
                        <input type="radio" name="status" value="draft" defaultChecked />
                        <span className="radio-custom"></span>
                        <i className="fas fa-save"></i>
                        Draft
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="status" value="published" />
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
                      className="form-control" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Allow comments on this blog post
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Feature this blog post on homepage
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button className="btn btn-primary btn-lg">
                    <i className="fas fa-save"></i>
                    Save as Draft
                  </button>
                  <button className="btn btn-success btn-lg">
                    <i className="fas fa-paper-plane"></i>
                    Publish Blog
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2>Reports & Analytics</h2>
              <p>Reports and analytics interface will be implemented here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Settings</h2>
              <p>Settings interface will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 