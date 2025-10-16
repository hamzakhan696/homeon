import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { showToast } from '../../toast';

// API Base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.194:3002';
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;
const USE_MULTIPART_UPLOAD = (process.env.REACT_APP_UPLOAD_MODE || 'json').toLowerCase() === 'multipart';
console.log('Environment API URL:', process.env.REACT_APP_API_URL);
console.log('Using API URL:', API_BASE_URL);

const ProjectsTab = () => {
  // State for projects form tabs
  const [activePropertyTab, setActivePropertyTab] = useState('home');
  const [activeSubtype, setActiveSubtype] = useState('house');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Studio');
  const [selectedBathrooms, setSelectedBathrooms] = useState('1');
  const [selectedPurpose, setSelectedPurpose] = useState('sell');

  // Sub-tabs within Projects: create vs list
  const [activeProjectsTab, setActiveProjectsTab] = useState('create'); // 'create' | 'list'
  const [projects, setProjects] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // State for file uploads
  const [projectImages, setProjectImages] = useState([]);
  const [projectVideos, setProjectVideos] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]);

  // Editing state
  const [editingProjectId, setEditingProjectId] = useState(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    location: '',
    areaSize: '',
    areaUnit: 'marla',
    price: '',
    currency: 'PKR',
    availableOnInstallments: false,
    readyForPossession: false,
    email: '',
    mobile: '',
    landline: '',
    amenities: [],
  });

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // State for modal
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  // Refs for file inputs
  const projectImageInputRef = useRef(null);
  const projectVideoInputRef = useRef(null);

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null });
  const closeConfirm = () => setConfirmState({ open: false, title: '', message: '', onConfirm: null });
  const openConfirm = ({ title, message, onConfirm }) => setConfirmState({ open: true, title, message, onConfirm });

  // Media gallery modal state
  const [mediaModal, setMediaModal] = useState({ open: false, title: '', images: [], videos: [] });
  const openMediaModal = (title, images, videos) => setMediaModal({ open: true, title, images, videos });
  const closeMediaModal = () => setMediaModal({ open: false, title: '', images: [], videos: [] });

  // Property subtypes mapping
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

  // Handle property type tab changes
  const handlePropertyTabChange = (tab) => {
    setActivePropertyTab(tab);
    setActiveSubtype(propertySubtypes[tab][0].key);
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // File upload handlers
  const handleProjectImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are JPG/PNG and under 5MB.');
    }

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      isCover: false,
    }));

    setProjectImages((prev) => [...prev, ...newImages]);
  };

  const handleProjectVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'].includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are valid video formats and under 50MB.');
    }

    const newVideos = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setProjectVideos((prev) => [...prev, ...newVideos]);
  };

  const handleYoutubeLinkAdd = () => {
    const link = prompt('Enter YouTube video URL:');
    if (link && link.includes('youtube.com')) {
      setYoutubeLinks((prev) => [
        ...prev,
        {
          id: Date.now(),
          url: link,
          title: `Video ${prev.length + 1}`,
        },
      ]);
    } else if (link) {
      alert('Please enter a valid YouTube URL.');
    }
  };

  const removeProjectImage = (imageId) => {
    setProjectImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeProjectVideo = (videoId) => {
    setProjectVideos((prev) => prev.filter((video) => video.id !== videoId));
  };

  const removeYoutubeLink = (linkId) => {
    setYoutubeLinks((prev) => prev.filter((link) => link.id !== linkId));
  };

  const setCoverImage = (imageId) => {
    setProjectImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === imageId,
      }))
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch projects list
  const fetchProjects = async () => {
    setIsListLoading(true);
    setListError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/projects`, {
        headers: { Accept: 'application/json' },
      });
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setListError('Failed to load projects');
    } finally {
      setIsListLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = (id) => {
    if (!id) return;
    openConfirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project?',
      onConfirm: async () => {
        try {
          setIsListLoading(true);
          await axios.delete(`${API_BASE_URL}/admin/projects/${id}`);
          showToast('Project deleted', 'success');
          await fetchProjects();
        } catch (err) {
          console.error('Delete project failed:', err);
          const msg = err?.response?.data?.message || 'Failed to delete project';
          showToast(msg, 'error');
        } finally {
          setIsListLoading(false);
          closeConfirm();
        }
      },
    });
  };

  // Approve project
  const handleApproveProject = (id) => {
    if (!id) return;
    openConfirm({
      title: 'Approve Project',
      message: 'Do you want to approve this project?',
      onConfirm: async () => {
        try {
          setIsListLoading(true);
          await axios.patch(`${API_BASE_URL}/admin/projects/${id}/approve`);
          showToast('Project approved', 'success');
          await fetchProjects();
        } catch (err) {
          console.error('Approve project failed:', err);
          const msg = err?.response?.data?.message || 'Failed to approve project';
          showToast(msg, 'error');
        } finally {
          setIsListLoading(false);
          closeConfirm();
        }
      },
    });
  };

  // Auto-load when switching to list tab
  useEffect(() => {
    if (activeProjectsTab === 'list') {
      fetchProjects();
    }
  }, [activeProjectsTab]);

  const formatCurrency = (cur, amount) => {
    if (amount === undefined || amount === null || amount === '') return '-';
    const num = Number(amount);
    if (Number.isNaN(num)) return `${cur || ''} ${amount}`.trim();
    return `${cur} ${num.toLocaleString()}`.trim();
  };

  const resolveMediaUrl = (name, fileObj) => {
    if (name && /^data:image\//i.test(name)) {
      console.log('Base64 URL:', name); // Debug log
      return name;
    }
    if (fileObj?.url) return fileObj.url;
    if (!name) return '';
    if (/^https?:\/\//i.test(name)) return name;
    const base = MEDIA_BASE_URL.replace(/\/$/, '');
    const file = String(name).replace(/^\//, '');
    return `${base}/${file}`;
  };

  // Extractors for images/videos arrays
  const extractImageUrls = (project) => {
    const urls = [];
    if (Array.isArray(project?.projectImages)) {
      for (const item of project.projectImages) {
        const candidate = (item && (item.url || item.name)) || item;
        const u = resolveMediaUrl(candidate);
        if (u) urls.push(u);
      }
    } else if (typeof project?.projectImages === 'string' && project.projectImages.trim()) {
      try {
        const arr = JSON.parse(project.projectImages);
        if (Array.isArray(arr)) {
          for (const item of arr) {
            const candidate = (item && (item.url || item.name)) || item;
            const u = resolveMediaUrl(candidate);
            if (u) urls.push(u);
          }
        }
      } catch {
        const u = resolveMediaUrl(project.projectImages);
        if (u) urls.push(u);
      }
    }
    return urls;
  };

  const extractVideoUrls = (project) => {
    const urls = [];
    if (Array.isArray(project?.projectVideos)) {
      for (const item of project.projectVideos) {
        const candidate = (item && (item.url || item.name)) || item;
        const u = /^https?:\/\//i.test(candidate) ? candidate : resolveMediaUrl(candidate);
        if (u) urls.push(u);
      }
    } else if (typeof project?.projectVideos === 'string' && project.projectVideos.trim()) {
      try {
        const arr = JSON.parse(project.projectVideos);
        if (Array.isArray(arr)) {
          for (const item of arr) {
            const candidate = (item && (item.url || item.name)) || item;
            const u = /^https?:\/\//i.test(candidate) ? candidate : resolveMediaUrl(candidate);
            if (u) urls.push(u);
          }
        }
      } catch {
        const u = resolveMediaUrl(project.projectVideos);
        if (u) urls.push(u);
      }
    }
    return urls;
  };

  const getProjectThumb = (project) => {
    const candidates = [];
    if (project?.coverImage) candidates.push(project.coverImage);

    if (Array.isArray(project?.projectImages)) {
      const first = project.projectImages[0];
      candidates.push(first?.url || first?.name || first);
    } else if (typeof project?.projectImages === 'string' && project.projectImages.trim()) {
      const s = project.projectImages.trim();
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr) && arr.length > 0) {
          const first = arr[0];
          candidates.push(first?.url || first?.name || first);
        } else {
          candidates.push(s);
        }
      } catch {
        candidates.push(s);
      }
    }

    for (const c of candidates) {
      if (!c) continue;
      if (typeof c === 'string' && /^data:image\//i.test(c)) return c;
      const resolved = resolveMediaUrl(c);
      if (resolved) return resolved;
    }
    return '';
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || typeof formData.title !== 'string') {
      newErrors.title = 'Title is required and must be a string';
    }
    if (!formData.description || typeof formData.description !== 'string') {
      newErrors.description = 'Description is required and must be a string';
    }
    if (!['sell', 'rent'].includes(selectedPurpose)) {
      newErrors.purpose = 'Purpose must be either "sell" or "rent"';
    }
    if (!['home', 'plots', 'commercial'].includes(activePropertyTab)) {
      newErrors.propertyType = 'Property type must be "home", "plots", or "commercial"';
    }
    const validSubtypes = [
      'house',
      'flat',
      'upper',
      'lower',
      'farmhouse',
      'room',
      'penthouse',
      'residential',
      'commercial',
      'agricultural',
      'industrial',
      'office',
      'shop',
      'warehouse',
      'factory',
      'other',
    ];
    if (!validSubtypes.includes(activeSubtype)) {
      newErrors.propertySubtype = 'Invalid property subtype';
    }
    if (!formData.city || typeof formData.city !== 'string') {
      newErrors.city = 'City is required and must be a string';
    }
    if (!formData.location || typeof formData.location !== 'string') {
      newErrors.location = 'Location is required and must be a string';
    }
    if (!formData.areaSize || isNaN(parseFloat(formData.areaSize)) || parseFloat(formData.areaSize) <= 0) {
      newErrors.areaSize = 'Area size is required and must be a positive number';
    }
    if (!['marla', 'kanal', 'sq_ft', 'sq_yd'].includes(formData.areaUnit)) {
      newErrors.areaUnit = 'Area unit must be "marla", "kanal", "sq_ft", or "sq_yd"';
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price is required and must be a positive number';
    }
    if (!['PKR', 'USD', 'EUR'].includes(formData.currency)) {
      newErrors.currency = 'Currency must be "PKR", "USD", or "EUR"';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.mobile || !/^\+\d{1,3}\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid mobile number is required (e.g., +923001234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the form errors before submitting.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Keep names for existing images and add cover marker if selected
    const coverImage = projectImages.find((img) => img.isCover)?.name || '';
    const payload = {
      title: String(formData.title).trim(),
      description: String(formData.description).trim(),
      purpose: selectedPurpose,
      propertyType: activePropertyTab,
      propertySubtype: activeSubtype,
      city: String(formData.city).trim(),
      location: String(formData.location).trim(),
      areaSize: parseFloat(formData.areaSize),
      areaUnit: formData.areaUnit.toLowerCase(),
      price: parseFloat(formData.price),
      currency: formData.currency,
      availableOnInstallments: Boolean(formData.availableOnInstallments),
      readyForPossession: Boolean(formData.readyForPossession),
      bedrooms: String(selectedBedrooms),
      bathrooms: String(selectedBathrooms),
      amenities: formData.amenities,
      projectImages: projectImages.filter((x) => !x.file).map((x) => x.name),
      projectVideos: projectVideos.filter((x) => !x.file).map((x) => x.name),
      youtubeLinks: youtubeLinks.map((l) => l.url),
      coverImage: coverImage || undefined,
      email: String(formData.email).trim(),
      mobile: String(formData.mobile).trim(),
      landline: (formData.landline || '').trim(),
    };

    try {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      // Append files to FormData
      projectImages.forEach((image) => {
        if (image.file) fd.append('files', image.file, image.name);
      });
      projectVideos.forEach((video) => {
        if (video.file) fd.append('files', video.file, video.name);
      });

      // If editing, send multipart update-with-media to merge existing + new
      if (editingProjectId) {
        const response = await axios.put(`${API_BASE_URL}/admin/projects/${editingProjectId}/update-with-media`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.status === 200) {
          alert('Project updated successfully!');
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/admin/projects/create-with-media`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.status === 201) {
          alert('Project created successfully!');
        }
        setFormData({
          title: '',
          description: '',
          city: '',
          location: '',
          areaSize: '',
          areaUnit: 'marla',
          price: '',
          currency: 'PKR',
          availableOnInstallments: false,
          readyForPossession: false,
          email: '',
          mobile: '',
          landline: '',
          amenities: [],
        });
        setProjectImages([]);
        setProjectVideos([]);
        setYoutubeLinks([]);
        setSelectedBedrooms('Studio');
        setSelectedBathrooms('1');
        setActivePropertyTab('home');
        setActiveSubtype('house');
        setSelectedPurpose('sell');
        setEditingProjectId(null);
      }
    } catch (err) {
      if (err.response?.status === 400 && Array.isArray(err.response.data?.message)) {
        const apiErrors = err.response.data.message.reduce((acc, msg) => {
          const field = (msg.split(' ')[0] || '').replace(/[^a-zA-Z]/g, '');
          if (field) acc[field] = msg;
          return acc;
        }, {});
        setErrors(apiErrors);
        console.warn('Validation failed:', err.response.data?.message);
      } else {
        console.error('Error creating project:', err);
        alert('An error occurred while creating the project. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Begin editing an existing project (prefill basic fields)
  const handleEditProject = (project) => {
    if (!project) return;
    setActiveProjectsTab('create');
    setEditingProjectId(project.id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      city: project.city || '',
      location: project.location || '',
      areaSize: String(project.areaSize ?? ''),
      areaUnit: (project.areaUnit || 'marla'),
      price: String(project.price ?? ''),
      currency: project.currency || 'PKR',
      availableOnInstallments: Boolean(project.availableOnInstallments),
      readyForPossession: Boolean(project.readyForPossession),
      email: project.email || '',
      mobile: project.mobile || '',
      landline: project.landline || '',
      amenities: Array.isArray(project.amenities) ? project.amenities : [],
    });
    setSelectedPurpose(project.purpose || 'sell');
    setActivePropertyTab(project.propertyType || 'home');
    setActiveSubtype(project.propertySubtype || 'house');
    setSelectedBedrooms(String(project.bedrooms || 'Studio'));
    setSelectedBathrooms(String(project.bathrooms || '1'));
    // Build existing images into preview items
    try {
      const existingImages = [];
      if (Array.isArray(project?.projectImages)) {
        for (const item of project.projectImages) {
          const name = (item && (item.name || item.url)) || item;
          const url = resolveMediaUrl(name);
          existingImages.push({ id: `exist-${Math.random()}`, file: null, name: String(name), size: 0, url, isCover: project.coverImage === name });
        }
      } else if (typeof project?.projectImages === 'string' && project.projectImages.trim()) {
        try {
          const arr = JSON.parse(project.projectImages);
          if (Array.isArray(arr)) {
            for (const item of arr) {
              const name = (item && (item.name || item.url)) || item;
              const url = resolveMediaUrl(name);
              existingImages.push({ id: `exist-${Math.random()}`, file: null, name: String(name), size: 0, url, isCover: project.coverImage === name });
            }
          }
        } catch {
          const s = String(project.projectImages);
          existingImages.push({ id: `exist-${Math.random()}`, file: null, name: s, size: 0, url: resolveMediaUrl(s), isCover: project.coverImage === s });
        }
      }
      setProjectImages(existingImages);
    } catch { setProjectImages([]); }

    // Build existing videos into preview items
    try {
      const existingVideos = [];
      if (Array.isArray(project?.projectVideos)) {
        for (const item of project.projectVideos) {
          const name = (item && (item.name || item.url)) || item;
          const url = /^https?:\/\//i.test(String(name)) ? String(name) : resolveMediaUrl(String(name));
          existingVideos.push({ id: `existv-${Math.random()}`, file: null, name: String(name), size: 0, url });
        }
      }
      setProjectVideos(existingVideos);
    } catch { setProjectVideos([]); }
    setYoutubeLinks(Array.isArray(project.youtubeLinks) ? project.youtubeLinks.map((url, idx) => ({ id: idx + 1, url, title: `Video ${idx + 1}` })) : []);
    showToast('Loaded project into form. Update and click "Submit Project" to save.', 'info');
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    showToast('Edit cancelled.', 'info');
  };

  // Handle amenities addition with modal
  const handleAddAmenity = () => {
    setIsAmenityModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
      setIsAmenityModalOpen(false);
    }
  };

  return (
    <div className="projects-section">
      <h2>Projects Management</h2>

      {/* Sub Tabs within Projects */}
      <div className="property-tabs" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`tab-btn ${activeProjectsTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveProjectsTab('create')}
        >
          Create Project
        </button>
        <button
          type="button"
          className={`tab-btn ${activeProjectsTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveProjectsTab('list')}
        >
          All Projects
        </button>
      </div>

      {activeProjectsTab === 'create' && (
        <>
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
          <form className="project-form" onSubmit={handleSubmit}>
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
                {errors.purpose && <small className="text-danger">{errors.purpose}</small>}
              </div>

              <div className="form-group">
                <label>Select Property Type</label>
                <div className="property-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${activePropertyTab === 'home' ? 'active' : ''}`}
                    onClick={() => handlePropertyTabChange('home')}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activePropertyTab === 'plots' ? 'active' : ''}`}
                    onClick={() => handlePropertyTabChange('plots')}
                  >
                    Plots
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activePropertyTab === 'commercial' ? 'active' : ''}`}
                    onClick={() => handlePropertyTabChange('commercial')}
                  >
                    Commercial
                  </button>
                </div>
                {errors.propertyType && <small className="text-danger">{errors.propertyType}</small>}

                <div className="property-subtypes">
                  {propertySubtypes[activePropertyTab].map((sub) => (
                    <button
                      type="button"
                      key={sub.key}
                      className={`subtype-btn ${activeSubtype === sub.key ? 'active' : ''}`}
                      onClick={() => handleSubtypeChange(sub.key)}
                    >
                      <i className={sub.icon}></i>
                      {sub.label}
                    </button>
                  ))}
                </div>
                {errors.propertySubtype && <small className="text-danger">{errors.propertySubtype}</small>}
              </div>

              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select City</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                </select>
                {errors.city && <small className="text-danger">{errors.city}</small>}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Search Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && <small className="text-danger">{errors.location}</small>}
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
                  name="title"
                  className="form-control"
                  placeholder="Enter property title e.g. Beautiful House in DHA Phase 5"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Describe your property, its features, area it is in etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                {errors.description && <small className="text-danger">{errors.description}</small>}
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
                    <input
                      type="number"
                      name="areaSize"
                      className="form-control"
                      placeholder="Enter Unit"
                      value={formData.areaSize}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      required
                    />
                    <select
                      name="areaUnit"
                      className="form-control"
                      value={formData.areaUnit}
                      onChange={handleInputChange}
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="sq_ft">Sq Ft</option>
                      <option value="sq_yd">Sq Yd</option>
                    </select>
                  </div>
                  {errors.areaSize && <small className="text-danger">{errors.areaSize}</small>}
                  {errors.areaUnit && <small className="text-danger">{errors.areaUnit}</small>}
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="Enter Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      required
                    />
                    <select
                      name="currency"
                      className="form-control"
                      value={formData.currency}
                      onChange={handleInputChange}
                    >
                      <option>PKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                  {errors.price && <small className="text-danger">{errors.price}</small>}
                  {errors.currency && <small className="text-danger">{errors.currency}</small>}
                  <small className="text-muted">
                    <i className="fas fa-info-circle"></i>
                    Price Check
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="availableOnInstallments"
                    checked={formData.availableOnInstallments}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Enable if listing is available on installments
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="readyForPossession"
                    checked={formData.readyForPossession}
                    onChange={handleInputChange}
                  />
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
                      type="button"
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
                      type="button"
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
                <button type="button" className="btn btn-primary" onClick={handleAddAmenity}>
                  <i className="fas fa-plus"></i>
                  Add Amenities
                </button>
                {formData.amenities.length > 0 && (
                  <ul>
                    {formData.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="quality-tip">
                <i className="fas fa-check-circle"></i>
                <span>Add at least 5 amenities</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${(formData.amenities.length / 5) * 100}%` }}></div>
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
                    <button type="button" className="btn btn-primary" onClick={() => projectImageInputRef.current?.click()}>
                      <i className="fas fa-upload"></i>
                      Upload Images
                    </button>
                    <button type="button" className="btn btn-outline">
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
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() => setCoverImage(image.id)}
                              title="Set as cover image"
                            >
                              <i className="fas fa-star"></i>
                            </button>
                            <button
                              type="button"
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
                  <div className="progress-bar" style={{ width: `${(projectImages.length / 5) * 100}%` }}></div>
                </div>
              </div>

              <div className="video-section">
                <div className="section-header">
                  <i className="fas fa-video"></i>
                  <h4>Add Videos of your Property</h4>
                </div>
                <p>Add videos of your property from YouTube. Upload on YouTube and paste the link below.</p>
                <div className="video-upload-buttons">
                  <button type="button" className="btn btn-primary" onClick={() => projectVideoInputRef.current?.click()}>
                    <i className="fas fa-upload"></i>
                    Upload Video Files
                  </button>
                  <button type="button" className="btn btn-outline" onClick={handleYoutubeLinkAdd}>
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
                              type="button"
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
                            type="button"
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
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <div className="input-group">
                  <select
                    name="mobileCountryCode"
                    className="form-control"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile: e.target.value + prev.mobile.replace(/^\+\d{1,3}/, ''),
                      }))
                    }
                  >
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={formData.mobile.replace(/^\+\d{1,3}/, '')}
                    onChange={(e) => {
                      const countryCode = formData.mobile.match(/^\+\d{1,3}/)?.[0] || '+92';
                      setFormData((prev) => ({
                        ...prev,
                        mobile: countryCode + e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, mobile: '' }));
                    }}
                    required
                  />
                  <button type="button" className="btn btn-outline">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
              </div>

              <div className="form-group">
                <label>Landline</label>
                <div className="input-group">
                  <select
                    name="landlineCountryCode"
                    className="form-control"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        landline: e.target.value + (prev.landline?.replace(/^\+\d{1,3}/, '') || ''),
                      }))
                    }
                  >
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    type="tel"
                    name="landline"
                    className="form-control"
                    placeholder="Enter landline number"
                    value={formData.landline?.replace(/^\+\d{1,3}/, '') || ''}
                    onChange={(e) => {
                      const countryCode = formData.landline?.match(/^\+\d{1,3}/)?.[0] || '+92';
                      setFormData((prev) => ({
                        ...prev,
                        landline: e.target.value ? countryCode + e.target.value : '',
                      }));
                      setErrors((prev) => ({ ...prev, landline: '' }));
                    }}
                  />
                </div>
                {errors.landline && <small className="text-danger">{errors.landline}</small>}
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
              <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> {editingProjectId ? 'Update Project' : 'Submit Project'}
                  </>
                )}
              </button>
              {editingProjectId && (
                <button type="button" className="btn btn-outline" style={{ marginLeft: 10 }} onClick={handleCancelEdit}>Cancel</button>
              )}
            </div>
          </form>

          {/* Amenity Modal */}
          {isAmenityModalOpen && (
            <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
                <h3>Add Amenity</h3>
                <form onSubmit={handleModalSubmit}>
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Enter amenity (e.g., Parking Space)"
                    style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', marginRight: '10px' }}>
                      Add
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => setIsAmenityModalOpen(false)} style={{ padding: '8px 16px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {activeProjectsTab === 'list' && (
        <div className="projects-list">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>All Projects</h3>
              <span className="badge badge-success" style={{ background: '#27ae60', color: '#fff', padding: '5px 10px', borderRadius: 12 }}>{projects.length}</span>
            </div>
            <button type="button" className="btn btn-outline" onClick={fetchProjects} disabled={isListLoading} style={{ background: '#ecf0f1', borderColor: '#bdc3c7', color: '#2c3e50' }}>
              {isListLoading ? <><i className="fas fa-spinner fa-spin"></i> Refreshing...</> : <><i className="fas fa-sync"></i> Refresh</>}
            </button>
          </div>

          {listError && <p className="text-danger" style={{ color: '#e74c3c', marginBottom: 15 }}>{listError}</p>}
          {isListLoading && !listError && (
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}><i className="fas fa-spinner fa-spin"></i> Loading projects...</p>
          )}
          {!isListLoading && !listError && projects.length === 0 && (
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No projects found.</p>
          )}

          {!isListLoading && !listError && projects.length > 0 && (
            <div className="projects-table-container">
              <table className="attractive-table">
                <thead>
                  <tr style={{ background: '#63b330', color: '#fff' }}>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Media</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Title</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Purpose</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Type</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Subtype</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>City</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Location</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Area</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Price</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Bedrooms</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Bathrooms</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Installments</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Status</th>
                    <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Created</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const imageUrls = extractImageUrls(p);
                    const videoUrls = extractVideoUrls(p);
                    const thumb = imageUrls[0] || getProjectThumb(p);
                    return (
                    <tr key={p.id} style={{ background: '#fff', transition: 'background 0.3s', borderBottom: '1px solid #ecf0f1' }}>
                      <td style={{ padding: '8px', minWidth: 180 }}>
                        {imageUrls.length === 0 && videoUrls.length === 0 && '-'}
                        {(imageUrls.length > 0 || videoUrls.length > 0) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {imageUrls.slice(0, 3).map((url, idx) => (
                                <img key={idx} src={url} alt={`img-${idx}`} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                              ))}
                              {imageUrls.length > 3 && (
                                <span style={{ alignSelf: 'center', fontSize: 12, background: '#ecf0f1', color: '#2c3e50', padding: '2px 6px', borderRadius: 10 }}>+{imageUrls.length - 3}</span>
                              )}
                            </div>
                            {videoUrls.length > 0 && (
                              <span title={`${videoUrls.length} video(s)`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f6f8fa', color: '#2c3e50', border: '1px solid #e1e4e8', borderRadius: 6, padding: '2px 6px' }}>
                                <i className="fas fa-video"></i>{videoUrls.length}
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() => openMediaModal(p.title, imageUrls, videoUrls)}
                            >
                              View
                            </button>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.title}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.purpose}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.propertyType}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.propertySubtype}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.city}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.location}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.areaSize} {p.areaUnit}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{formatCurrency(p.currency, p.price)}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.bedrooms || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.bathrooms || '-'}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>{p.availableOnInstallments ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          className="badge"
                          style={{
                            padding: '4px 8px',
                            borderRadius: 8,
                            background:
                              p.status === 'approved' ? '#27ae60' : p.status === 'rejected' ? '#e74c3c' : '#f1c40f',
                            color: '#fff',
                            textTransform: 'capitalize',
                          }}
                        >
                          {p.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#7f8c8d' }}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                      <td style={{ padding: '12px' }}>
                        {(!p.status || p.status === 'pending') && (
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleApproveProject(p.id)}
                            title="Approve project"
                            style={{ marginRight: 8 }}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditProject(p)}
                          title="Edit project"
                          style={{ marginRight: 8 }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteProject(p.id)} title="Delete project">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {confirmState.open && (
        <div className="modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ background: '#fff', width: 400, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{confirmState.title}</h3>
            </div>
            <div style={{ padding: '18px 20px', color: '#2c3e50' }}>
              {confirmState.message}
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #eee' }}>
              <button type="button" className="btn btn-outline" onClick={closeConfirm}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => confirmState.onConfirm && confirmState.onConfirm()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {mediaModal.open && (
        <div className="modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ background: '#fff', width: '80%', maxWidth: 1000, maxHeight: '85vh', overflow: 'auto', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{mediaModal.title || 'Media'}</h3>
              <button type="button" className="btn btn-outline" onClick={closeMediaModal}>Close</button>
            </div>
            <div style={{ padding: 16 }}>
              {mediaModal.images.length > 0 && (
                <>
                  <h4 style={{ margin: '10px 0' }}>Images ({mediaModal.images.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                    {mediaModal.images.map((url, idx) => (
                      <img key={idx} src={url} alt={`img-${idx}`} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                    ))}
                  </div>
                </>
              )}
              {mediaModal.videos.length > 0 && (
                <>
                  <h4 style={{ margin: '16px 0 10px' }}>Videos ({mediaModal.videos.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                    {mediaModal.videos.map((url, idx) => (
                      <video key={idx} controls style={{ width: '100%', height: 180, borderRadius: 6, border: '1px solid #eee', background: '#000' }}>
                        <source src={url} />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                </>
              )}
              {mediaModal.images.length === 0 && mediaModal.videos.length === 0 && (
                <p style={{ color: '#7f8c8d' }}>No media available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;