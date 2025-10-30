import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { showToast } from '../../toast';

// API Base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.139:3002';
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
    advanceAmount: '',
    numberOfInstallments: '',
    monthlyInstallment: '',
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
      advanceAmount: formData.availableOnInstallments && formData.advanceAmount ? parseFloat(formData.advanceAmount) : null,
      numberOfInstallments: formData.availableOnInstallments && formData.numberOfInstallments ? parseInt(formData.numberOfInstallments) : null,
      monthlyInstallment: formData.availableOnInstallments && formData.monthlyInstallment ? parseFloat(formData.monthlyInstallment) : null,
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
          advanceAmount: '',
          numberOfInstallments: '',
          monthlyInstallment: '',
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
      advanceAmount: String(project.advanceAmount ?? ''),
      numberOfInstallments: String(project.numberOfInstallments ?? ''),
      monthlyInstallment: String(project.monthlyInstallment ?? ''),
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
    <div className="project-section-custom">
      <h3>Projects Management</h3>
      <div className="property-tabs " style={{ marginBottom: 16 }}>
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
     <div className=''>

      {activeProjectsTab === 'create' && (
        <>

          {/* Project Form */}
          <form className="project-form" onSubmit={handleSubmit}>
            {/* Location and Purpose Section */}
            <div className="form-section projects-section">
                            <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><g><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10Z" fill="#F7F7F7"></path><path fill-rule="evenodd" clip-rule="evenodd" d="m19.72 7.846.923.834-1.667 1.844-.922-.833 1.665-1.845Zm-4.79 5.303.923.834-1.665 1.844-.923-.833 1.666-1.845Zm.491-3.323L13.577 8.16l-.833.923 1.844 1.665.833-.922Zm19.515 26.433a1.795 1.795 0 1 0 2.538-2.538 1.795 1.795 0 0 0-2.538 2.538Zm.848-1.692a.596.596 0 1 1 .842.843.596.596 0 0 1-.842-.843Z" fill="#72b678"></path><path d="M37.047 21.547C37.047 15.73 32.316 11 26.5 11c-5.816 0-10.547 4.731-10.547 10.547 0 2.3.728 4.487 2.105 6.323l5.628 7.504A3.535 3.535 0 0 0 26.5 36.78c1.1 0 2.152-.526 2.814-1.407l5.628-7.504a10.46 10.46 0 0 0 2.105-6.323Z" fill="#F3F3F1"></path><path d="m28.14 34.67-5.629-7.503a9.333 9.333 0 0 1-1.87-5.62c0-4.577 3.28-8.387 7.617-9.21a9.375 9.375 0 0 0-11.133 9.21c0 2.108.696 4.054 1.87 5.62l5.629 7.504a2.34 2.34 0 0 0 3.634.144 2.362 2.362 0 0 1-.118-.144Z" fill="#E8E8E8"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M26.5 11c5.816 0 10.547 4.731 10.547 10.547 0 2.3-.728 4.487-2.105 6.323l-5.628 7.504A3.535 3.535 0 0 1 26.5 36.78c-1.1 0-2.152-.526-2.814-1.407l-5.628-7.504a10.46 10.46 0 0 1-2.105-6.323C15.953 15.73 20.685 11 26.5 11Zm.939 22.967 5.628-7.503a8.132 8.132 0 0 0 1.636-4.917c0-4.523-3.68-8.203-8.203-8.203s-8.203 3.68-8.203 8.203c0 1.79.566 3.49 1.636 4.917l5.628 7.504c.224.298.567.47.939.47s.715-.172.939-.47Zm3.748 4.69a1.172 1.172 0 0 1 0 2.343h-9.375a1.172 1.172 0 1 1 0-2.344h9.375Z" fill="#D0D0D0"></path><path d="M26.5 25.063a3.52 3.52 0 0 0 3.516-3.516A3.52 3.52 0 0 0 26.5 18.03a3.52 3.52 0 0 0-3.516 3.516 3.52 3.52 0 0 0 3.516 3.515Zm0-4.688c.646 0 1.172.526 1.172 1.172 0 .646-.526 1.172-1.172 1.172a1.173 1.173 0 0 1-1.172-1.172c0-.646.526-1.172 1.172-1.172Z" fill="#009f2b"></path></g></svg>
                <h4>Location and Purpose</h4>
              </div>
              <div className="custom-padding-proect-section">
              <div className="form-group">
               <div className="d-flex gap-3">
                <div>
                  <div className="project-custom-svg">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"></path></svg>
                </div>
                </div>
                <div>
                                <label>Select Purpose</label>
                <div className="radio-group">
                  <label className={`radio-option radio-option-cstm ${selectedPurpose === 'sell' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="purpose"
                      value="sell"
                      checked={selectedPurpose === 'sell'}
                      onChange={() => handlePurposeChange('sell')}
                    />
                    <i className="fas fa-home me-2"></i>
                    Sell
                  </label>
                  <label className={`radio-option radio-option-cstm ${selectedPurpose === 'rent' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="purpose"
                      value="rent"
                      checked={selectedPurpose === 'rent'}
                      onChange={() => handlePurposeChange('rent')}
                    />
                    <i className="fas fa-key me-2"></i>
                    Rent
                  </label>
                </div>
                </div>
                </div>
                {errors.purpose && <small className="text-danger">{errors.purpose}</small>}
              </div>

              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 3 16v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zm-8 18H5v-5.586l3-3 3 3V20zm8 0h-6v-4a.999.999 0 0 0 .707-1.707L9 9.586V4h10v16z"></path><path d="M11 6h2v2h-2zm4 0h2v2h-2zm0 4.031h2V12h-2zM15 14h2v2h-2zm-8 1h2v2H7z"></path></svg>
                    </div>
                  </div>
                  <div>
                     <label>Select Property Type</label>
<div className="property-tabs1">
  <button
    type="button"
    className={`tab-btn1 ${activePropertyTab === 'home' ? 'active' : ''}`}
    onClick={() => handlePropertyTabChange('home')}
  >
    Home
  </button>
  <button
    type="button"
    className={`tab-btn1 ${activePropertyTab === 'plots' ? 'active' : ''}`}
    onClick={() => handlePropertyTabChange('plots')}
  >
    Plots
  </button>
  <button
    type="button"
    className={`tab-btn1 ${activePropertyTab === 'commercial' ? 'active' : ''}`}
    onClick={() => handlePropertyTabChange('commercial')}
  >
    Commercial
  </button>
</div>


                {errors.propertyType && <small className="text-danger">{errors.propertyType}</small>}

                <div className="property-subtypes mt-3">
                  {propertySubtypes[activePropertyTab].map((sub) => (
                    <button
                      type="button"
                      key={sub.key}
                      className={`radio-option radio-option-cstm ${activeSubtype === sub.key ? 'active' : ''}`}
                      onClick={() => handleSubtypeChange(sub.key)}
                    >
                      <i className={sub.icon}></i>
                      {sub.label}
                    </button>
                  ))}
                </div>
                {errors.propertySubtype && <small className="text-danger">{errors.propertySubtype}</small>}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                <label>City</label>
                <select
                  name="city"
                  className="form-control projects-input-custom"
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
                </div>
              </div>

              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="m20.5 3-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99 3-1.01v11.7l-3 1.16V6.46zm14 11.08-3 1.01V6.86l3-1.16v11.84z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control projects-input-custom"
                  placeholder="Search Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && <small className="text-danger">{errors.location}</small>}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Ad Information Section */}
            <div className="form-section projects-section">
              <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path d="M29.053 19.677h-2.409v1.2a1.2 1.2 0 01-1.2 1.2h-6.628a1.2 1.2 0 01-1.2-1.2v-1.2h-2.413a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h13.85a2.416 2.416 0 002.409-2.409V22.086a2.416 2.416 0 00-2.409-2.409z" fill="#F3F3F1"></path><path d="M26.645 18.473v2.409a1.2 1.2 0 01-1.2 1.2h-6.629a1.2 1.2 0 01-1.2-1.2v-2.409h2.108a2.409 2.409 0 014.818 0h2.103z" fill="#009f2b"></path><path d="M32.968 43.162a6.925 6.925 0 100-13.85 6.925 6.925 0 000 13.85z" fill="#E7F3EF"></path><path d="M15.504 37.141V22.086a2.41 2.41 0 012.108-2.379v-.03h-2.409a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h2.71a2.416 2.416 0 01-2.409-2.409zm13.85-16.26v-1.174c-.1-.017-.2-.027-.3-.03h-2.41v1.2a1.2 1.2 0 01-1.2 1.2h2.71a1.2 1.2 0 001.2-1.196z" fill="#D5DBE1"></path><path d="M20.322 20.882v-2.409h2.108a2.41 2.41 0 011.054-1.987 2.389 2.389 0 00-3.056.286 2.416 2.416 0 00-.708 1.701h-2.108v2.409a1.2 1.2 0 001.2 1.2h2.71a1.2 1.2 0 01-1.2-1.2zm12.646 23.184a7.83 7.83 0 117.829-7.829 7.838 7.838 0 01-7.829 7.829zm0-13.851a6.022 6.022 0 106.022 6.022 6.029 6.029 0 00-6.022-6.021v-.001z" fill="#009f2b"></path><path d="M31.763 39.549a.902.902 0 01-.638-.265l-2.409-2.409 1.278-1.278 1.726 1.73 3.579-4.09 1.36 1.19-4.213 4.814a.906.906 0 01-.65.308h-.033z" fill="#009f2b"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18.817 22.989h6.624a2.11 2.11 0 002.102-2.108v-.3h1.511a1.508 1.508 0 011.505 1.505v3.722h1.806v-3.722a3.316 3.316 0 00-3.312-3.312h-1.51v-.302a.9.9 0 00-.9-.9h-1.33a3.312 3.312 0 00-6.374 0h-1.33a.9.9 0 00-.9.9v.302h-1.506a3.317 3.317 0 00-3.312 3.312v15.055a3.316 3.316 0 003.312 3.312h7.756v-1.807h-7.756a1.508 1.508 0 01-1.505-1.505V22.086a1.508 1.508 0 011.505-1.505h1.506v.3a2.11 2.11 0 002.108 2.108zm-.301-2.108v-1.505l1.213-.001a.9.9 0 00.9-.9 1.506 1.506 0 013.011 0 .9.9 0 00.9.9h1.2v1.506a.3.3 0 01-.3.3h-6.624a.301.301 0 01-.3-.3z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.407 24.795h11.442v1.807H16.407v-1.807zm0 3.614h8.635v1.807h-8.635v-1.807zm6.55 3.613h-6.55v1.807h6.55v-1.807z" fill="#D0D0D0"></path><path d="M42.302 31.118a1.807 1.807 0 110-3.614 1.807 1.807 0 010 3.614zm0-2.409a.6.6 0 100 1.2.6.6 0 000-1.2z" fill="#72b678"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.876 7.934h-1.2v2.409h1.2V7.934zm-5.415 3.914h2.409v1.2h-2.409v-1.2zm6.925 0h2.409v1.2h-2.409v-1.2z" fill="#72b678"></path></svg>
                <h4>Ad Information</h4>
              </div>
<div className="custom-padding-proect-section">
              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M5 4v3h5.5v12h3V7H19V4z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control projects-input-custom"
                  placeholder="Enter property title e.g. Beautiful House in DHA Phase 5"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control projects-input-custom"
                  rows="4"
                  placeholder="Describe your property, its features, area it is in etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                {errors.description && <small className="text-danger">{errors.description}</small>}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Price and Area Section */}
            <div className="form-section projects-section">
              <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path d="M12.8 16.4a1.807 1.807 0 11.005-3.615 1.807 1.807 0 01-.005 3.614zm0-2.4a.6.6 0 10-.074 1.198.6.6 0 00.074-1.199z" fill="#A4AFC1"></path><path d="M38.973 25.916A3.591 3.591 0 0040.1 23.3v-8.4a2.4 2.4 0 00-2.4-2.4h-8.4a3.6 3.6 0 00-2.616 1.126L13.756 27.05a2.4 2.4 0 00.047 3.346l8.4 8.4a2.4 2.4 0 003.346.047l13.424-12.927z" fill="#F3F3F1"></path><path d="M35 19.1a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#2FDF84"></path><path d="M33.2 39.5a6.9 6.9 0 100-13.8 6.9 6.9 0 000 13.8z" fill="#E7F3EF"></path><path d="M24.903 38.797l-8.855-8.855c-.442-.442-.821-.585-.83-1.21-.009-.624.282-.732 1.238-1.681l12.928-13.425A3.588 3.588 0 0132 12.5h-2.7a3.6 3.6 0 00-2.616 1.126L13.756 27.05a2.4 2.4 0 00.047 3.346l8.4 8.4a2.388 2.388 0 003.043.284 2.429 2.429 0 01-.343-.283z" fill="#E6E6E6"></path><path d="M36.2 17.6c.002-.22.054-.435.15-.631a1.5 1.5 0 100 1.262 1.468 1.468 0 01-.15-.631z" fill="#00B871"></path><path d="M33.2 40.4a7.8 7.8 0 117.8-7.8 7.809 7.809 0 01-7.8 7.8zm0-13.8a6 6 0 106 6 6.007 6.007 0 00-6-6z" fill="#009f2b"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M34.1 29.3h-1.8v2.4h-2.4v1.8h2.4v2.4h1.8v-2.4h2.4v-1.8h-2.4v-2.4z" fill="#009f2b"></path><path d="M23.9 40.4a3.238 3.238 0 01-2.338-.98l-8.39-8.392A3.225 3.225 0 0112.2 28.7c.001-.847.328-1.66.913-2.272L26.035 13a4.465 4.465 0 013.265-1.4h8.4a3.3 3.3 0 013.3 3.3v8.4c.004.39-.048.778-.156 1.153l-1.727-.506a2.28 2.28 0 00.083-.647v-8.4a1.5 1.5 0 00-1.5-1.5h-8.4a2.682 2.682 0 00-1.963.848L14.408 27.68A1.47 1.47 0 0014 28.7a1.447 1.447 0 00.436 1.048l8.408 8.408a1.49 1.49 0 001.58.343l.68 1.667a3.205 3.205 0 01-1.2.234H23.9z" fill="#BDBDBD"></path><path d="M35 20a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0-3a.6.6 0 100 1.199.6.6 0 000-1.2z" fill="#BDBDBD"></path></svg>
                <h4>Price and Area</h4>
              </div>
<div className="custom-padding-proect-section">
                
                <div className="form-group">
                  <div className="d-flex gap-3">
                    <div>
                      <div className="project-custom-svg">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none"><path d="m13.453 20 1.045-2.764.529.854 4.782-3.001-.58-.93H22l-1.046 2.764-.507-.811-4.782 3.001.554.887h-2.766Zm-5.67 0 .58-.93-4.782-3.009-.535.862L2 14.159h2.775l-.554.88 4.782 3 .507-.803L10.557 20H7.784Zm3.73-3.719-8.62-5.187a.96.96 0 0 1-.345-.35.986.986 0 0 1 .332-1.32l8.629-5.283A.938.938 0 0 1 12 4c.174 0 .344.05.493.141l8.63 5.283a.96.96 0 0 1 .342.354.984.984 0 0 1-.342 1.316l-8.63 5.187a.936.936 0 0 1-.973 0h-.007Zm-6.739-6.028 7.227 4.345 7.226-4.345-7.226-4.429-7.227 4.429Z" fill="currentColor"></path></svg>
                      </div>
                      </div>
                      <div className="w-100">
 <label>Area Size</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="areaSize"
                      className="form-control projects-input-custom w-md-75 w-50"
                      placeholder="Enter Unit"
                      value={formData.areaSize}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      required
                    />
                    <select
                      name="areaUnit"
                      className="form-control projects-input-custom"
                      value={formData.areaUnit}
                      onChange={handleInputChange}
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="sq_ft">Sq Ft</option>
                      <option value="sq_yd">Sq Yd</option>
                    </select>
                        <i className="fas fa-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                  </div>
                  {errors.areaSize && <small className="text-danger">{errors.areaSize}</small>}
                  {errors.areaUnit && <small className="text-danger">{errors.areaUnit}</small>}
                      </div>
                    </div>
                
                </div>

                <div className="form-group">
                                    <div className="d-flex gap-3">
                    <div>
                      <div className="project-custom-svg">
                       <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM11.6113 4.22157L3.83316 11.9997L12.3184 20.485L20.0966 12.7069L19.036 5.28223L11.6113 4.22157ZM13.7327 10.5855C12.9516 9.80448 12.9516 8.53815 13.7327 7.7571C14.5137 6.97606 15.78 6.97606 16.5611 7.7571C17.3421 8.53815 17.3421 9.80448 16.5611 10.5855C15.78 11.3666 14.5137 11.3666 13.7327 10.5855Z"></path></svg>
                      </div>
                      </div>
                      <div className="w-100">
                  <label>Price</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="price"
                      className="form-control projects-input-custom w-md-75 w-50"
                      placeholder="Enter Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      required
                    />
                    <select
                      name="currency"
                      className="form-control projects-input-custom disabled-color"
                      value={formData.currency}
                      onChange={handleInputChange}
  disabled={true} 
                    >
                      <option>PKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                     <i className="fas fa-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                  </div>
                  {errors.price && <small className="text-danger">{errors.price}</small>}
                  {errors.currency && <small className="text-danger">{errors.currency}</small>}
                  <div className="mt-2">
                    <div className="d-flex justify-content-end ">
                                        <small className="text-muted project-custom-svg">
                    <i className="fas fa-info-circle"></i>
                    Price Check
                  </small>
                    </div>
                  </div>
                      </div>
                  </div>
                </div>
    <div className="form-group">
      <div className="d-flex gap-3">
        <div>
          <div className="project-custom-svg">
 <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none"><path d="M7.78 13.31a2.686 2.686 0 0 0 2.531 2.814 2.686 2.686 0 0 0 2.531-2.813 2.686 2.686 0 0 0-2.531-2.812A2.686 2.686 0 0 0 7.78 13.31Zm3.938 0A1.568 1.568 0 0 1 10.312 15a1.568 1.568 0 0 1-1.406-1.688 1.568 1.568 0 0 1 1.406-1.687 1.568 1.568 0 0 1 1.406 1.687Zm9.281-.983a2.672 2.672 0 0 0-2.531-2.665v-.851a.563.563 0 0 0-.562-.562H16.5V6.562A.563.563 0 0 0 15.937 6H3.562A.563.563 0 0 0 3 6.563v.563a.562.562 0 1 0 1.124 0h11.25v1.126H3.562A.563.563 0 0 0 3 8.815v9a.563.563 0 0 0 .562.563h10.687a.562.562 0 1 0 .001-1.125H6.887a3.378 3.378 0 0 0-2.762-2.761V12.14a3.377 3.377 0 0 0 2.762-2.762h7.7c.045.271.122.536.231.788a.56.56 0 0 0 .739.294.563.563 0 0 0 .295-.74v-.004a2.258 2.258 0 0 1-.112-.338h1.613v.472a2.666 2.666 0 0 0-1.467 3.539 2.676 2.676 0 1 0 3.778 1.259 2.67 2.67 0 0 0 1.335-2.321ZM5.738 17.249H4.124v-1.613a2.254 2.254 0 0 1 1.614 1.613Zm-1.614-6.261V9.374h1.614a2.254 2.254 0 0 1-1.614 1.613Zm13.807 6.082c-.224.12-.475.181-.729.18a1.544 1.544 0 0 1-.662-2.942 2.658 2.658 0 0 0 2.029.679 1.54 1.54 0 0 1-.638 2.082Zm.4-3.2a1.547 1.547 0 1 1 1.43-.953 1.547 1.547 0 0 1-1.434.957l.004-.004Zm-3.516-.563a.562.562 0 1 1-.166-.394.562.562 0 0 1 .162.398l.004-.004Zm-7.875 0a.561.561 0 1 1-.165-.394.564.564 0 0 1 .162.398l.003-.004Z" fill="currentColor"></path></svg>
          </div>
        </div>
        <div className="w-100">
          <label className="checkbox-label checkbox-label-projects1 d-flex justify-content-between align-items-center">
            <input
              type="checkbox"
              name="availableOnInstallments"
              checked={formData.availableOnInstallments}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            <div>
              <p className="custom-p">Installment available</p>
              <span className="custom-span">Enable if listing is available on installments</span>
            </div>
          </label>
        </div>
      </div>
    </div>
        {formData.availableOnInstallments && (
          <div className="advance-inputs mt-3">
                <div className="form-group">
      <div className="d-flex gap-3">
        <div>
          <div className="project-custom-svg">
 <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none"><path d="m10.552 21.462-7-6.928a1.856 1.856 0 0 1 0-2.643l.63-.624 1.166 1.16-.793.784 7.332 7.262 6.919-6.845.559-7.822-4.336.31-1.545-1.53 5.493-.39a1.896 1.896 0 0 1 1.56.638c.328.374.493.862.459 1.357l-.547 7.464a1.83 1.83 0 0 1-.547 1.188l-6.674 6.611a1.886 1.886 0 0 1-1.337.546 1.886 1.886 0 0 1-1.339-.538Zm-1.065-7.803L5.019 9.231a.42.42 0 0 1-.093-.458.42.42 0 0 1 .093-.136l.881-.872a.43.43 0 0 1 .606 0l2.358 2.333V3.424A.434.434 0 0 1 9.29 3h1.244a.434.434 0 0 1 .426.424v6.57l2.065-2.044a.43.43 0 0 1 .606 0l.882.872a.425.425 0 0 1 0 .601l-4.282 4.234a.505.505 0 0 1-.368.153.532.532 0 0 1-.379-.155l.003.004Z" fill="currentColor"></path></svg>
          </div>
        </div>
            <div className="w-100">
                       <label>Advance Amount</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="advanceAmount"
                      className="form-control projects-input-custom w-75"
                      placeholder="Enter Advance Amount"
                      min="0"
                      step="1"
                      value={formData.advanceAmount}
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      name="currency"
                      className="form-control projects-input-custom disabled-color"
                      value="Pkr"
  disabled={true} 
                    >
                      <option>PKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                     <i className="fas fa-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                  </div>
            </div>
        </div>
        </div>
                        <div className="form-group">
      <div className="d-flex gap-3">
        <div>
          <div className="project-custom-svg">
 <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z"></path></svg>
          </div>
        </div>
            <div className="w-100">
                       <label>No of Installments</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="numberOfInstallments"
                      className="form-control projects-input-custom w-75"
                      placeholder="Enter Number of Installments"
                      min="1"
                      step="1"
                      value={formData.numberOfInstallments}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
            </div>
        </div>
        </div>
                        <div className="form-group">
      <div className="d-flex gap-3">
        <div>
          <div className="project-custom-svg">
 <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none"><path d="M5.752 20.99a2.554 2.554 0 0 1-1.864-.644A2.683 2.683 0 0 1 3 18.548V8.358c.055-.695.375-1.34.89-1.796a2.552 2.552 0 0 1 1.862-.641h3.856v1.968H5.752c-.497 0-.826.282-.826.469v3.461h2.2c-.007.008-.027.017-.033.028l-.807.823a1.211 1.211 0 0 0-.337.84.956.956 0 0 0 .054.277H4.927v4.766c0 .191.329.469.826.469h12.5c.498 0 .828-.278.828-.47v-4.76h-.996a1.205 1.205 0 0 0-.322-.938l-.8-.822a1.13 1.13 0 0 0-.296-.208h2.415V8.363c0-.188-.33-.47-.827-.47H14.8V5.927h3.455a2.544 2.544 0 0 1 1.86.64c.513.457.831 1.102.885 1.797v10.19a2.678 2.678 0 0 1-.884 1.798 2.546 2.546 0 0 1-1.861.643L5.752 20.99Zm5.994-2.996-4.093-4.2a.403.403 0 0 1-.116-.284.402.402 0 0 1 .116-.287l.807-.827a.388.388 0 0 1 .552 0l2.165 2.213V3.393a.397.397 0 0 1 .241-.364.378.378 0 0 1 .15-.028h1.137a.378.378 0 0 1 .275.113.393.393 0 0 1 .115.28V14.52l1.897-1.945a.38.38 0 0 1 .552 0l.807.828a.4.4 0 0 1 .086.435.4.4 0 0 1-.086.13l-3.922 4.021a.457.457 0 0 1-.679 0l-.004.005Z" fill="currentColor"></path></svg>
          </div>
        </div>
            <div className="w-100">
                       <label>Monthly Installments</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="monthlyInstallment"
                      className="form-control projects-input-custom w-75"
                      placeholder="Enter Monthly Installment"
                      min="0"
                      step="1"
                      value={formData.monthlyInstallment}
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      name="currency"
                      className="form-control projects-input-custom disabled-color"
                      value="Pkr"
  disabled={true} 
                    >
                      <option>PKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                     <i className="fas fa-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                  </div>
            </div>
        </div>
        </div>
          </div>
        )}
              <div className="form-group">
                           <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                   <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                                    <label className="checkbox-label checkbox-label-projects1 d-flex justify-content-between">
                  <input
                    type="checkbox"
                    name="readyForPossession"
                    checked={formData.readyForPossession}
                    onChange={handleInputChange}
                  />
                                    <span className="checkmark"></span>
    <div>
                                      <p className="custom-p">Ready for Possession</p>
                  <span className="custom-span">Enable if listing is ready for possession</span>
                  </div>
                </label>
                  </div>
                  </div>
              </div>
              </div>
            </div>

            {/* Features and Amenities Section */}
            <div className="form-section projects-section">
              <div className="section-header">
          <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path d="M37.871 18.501a1.885 1.885 0 11-.003-3.77 1.885 1.885 0 01.003 3.77zm0-2.5a.623.623 0 10-.077 1.244.623.623 0 00.077-1.244z" fill="#BDBDBD"></path><path d="M36.112 23.363l-3.55-3.388v-6.787h-3.75v3.213l-4.687-4.463-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h3.125v8.75a1.876 1.876 0 001.875 1.875h13.75a1.25 1.25 0 001.25-1.25v-9.375h3.125a.618.618 0 00.625-.625.606.606 0 00-.2-.45z" fill="#F3F3F1"></path><path d="M32.875 40.065a7.188 7.188 0 100-14.376 7.188 7.188 0 000 14.376z" fill="#E7F3EF"></path><path d="M31.625 16.401v-3.213h-2.813v.535l2.813 2.678zM14.75 23.813a.604.604 0 01.2-.45l10.582-10.085-1.407-1.34-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h2.813a.618.618 0 01-.625-.625zm3.75 9.375v-8.75h-2.813v8.75a1.876 1.876 0 001.875 1.875h2.813a1.876 1.876 0 01-1.875-1.875z" fill="#E8E8E8"></path><path d="M32.875 41.002A8.125 8.125 0 1141 32.877a8.134 8.134 0 01-8.125 8.125zm0-14.375a6.25 6.25 0 100 12.503 6.25 6.25 0 000-12.504v.001z" fill="#009f2b"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M33.876 29.938a.938.938 0 11-1.876 0 .938.938 0 011.876 0zm-.001 2.499H32v4.375h1.875v-4.375z" fill="#009f2b"></path><path d="M21.313 36.001h-3.75a2.815 2.815 0 01-2.813-2.812v-7.813h-2.187A1.565 1.565 0 0111 23.814a1.544 1.544 0 01.511-1.148L23.478 11.26a.94.94 0 011.294 0l3.1 2.954v-1.026a.938.938 0 01.938-.938h3.75a.938.938 0 01.938.938v6.388l1.148 1.1-1.3 1.355-1.438-1.375a.938.938 0 01-.289-.678v-5.852H29.75v2.275a.938.938 0 01-1.584.679l-4.041-3.847-10.772 10.268h2.335a.938.938 0 01.938.938v8.75a.938.938 0 00.938.938h3.75l-.001 1.874zm-8.519-11.967l-.009.009a.064.064 0 00.009-.009z" fill="#D6D6D6"></path></svg>
                <h4>Features and Amenities</h4>
              </div>
<div className="custom-padding-proect-section">
              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22zM14 7h4c.55 0 1 .45 1 1v2h-6V8c0-.55.45-1 1-1zM5 8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2H5V8z"></path></svg>
                    </div>
                  </div>
                  <div>
                <label>Bedrooms</label>
                <div className="button-group">
                  {['Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map((num, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`radio-option radio-option-cstm ${selectedBedrooms === num ? 'active' : ''}`}
                      onClick={() => handleBedroomChange(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                          <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 0 0-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 0 0-1-1zm-1 3c0 2.206-1.794 4-4 4H8c-2.206 0-4-1.794-4-4v-1h16v1z"></path></svg>
                    </div>
                  </div>
                  <div>
                <label>Bathrooms</label>
                <div className="button-group">
                  {['1', '2', '3', '4', '5', '6', '6+'].map((num, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`radio-option radio-option-cstm ${selectedBathrooms === num ? 'active' : ''}`}
                      onClick={() => handleBathroomChange(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                  </div>
                  </div>
              </div>

              <div className="form-group">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 3 1 11.4l1.21 1.59L4 11.62V21h16v-9.38l1.79 1.36L23 11.4 12 3zm6 16H6v-8.9l6-4.58 6 4.58V19zm-9-5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm3-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1z"></path></svg>
                    </div>
                  </div>
                    <div className="d-flex justify-content-between w-100 features-amenities">
                      <div>
                          <p className="custom-p">Feature and Amenities</p>
 <span className="custom-span">Add additional features e.g. parking spaces, waste disposal, internet etc.</span>
                      </div>
<div>                
  <button type="button" className="btn-custom" onClick={handleAddAmenity}>
                  Add Amenities
                </button>
                  </div>
                    </div>
                </div>
              
              </div>

              <div className="quality-tip">
                <i className="fas fa-check-circle"></i>
                <span>Add at least 5 amenities</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${(formData.amenities.length / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="get-amenities">
                {formData.amenities.length > 0 && (
                  <ul>
                    {formData.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                )}
              </div>
              </div>
            </div>

            {/* Property Images Section */}
            <div className="form-section projects-section">
              <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path d="M29.053 19.677h-2.409v1.2a1.2 1.2 0 01-1.2 1.2h-6.628a1.2 1.2 0 01-1.2-1.2v-1.2h-2.413a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h13.85a2.416 2.416 0 002.409-2.409V22.086a2.416 2.416 0 00-2.409-2.409z" fill="#F3F3F1"></path><path d="M26.645 18.473v2.409a1.2 1.2 0 01-1.2 1.2h-6.629a1.2 1.2 0 01-1.2-1.2v-2.409h2.108a2.409 2.409 0 014.818 0h2.103z" fill="#009f2b"></path><path d="M32.968 43.162a6.925 6.925 0 100-13.85 6.925 6.925 0 000 13.85z" fill="#E7F3EF"></path><path d="M15.504 37.141V22.086a2.41 2.41 0 012.108-2.379v-.03h-2.409a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h2.71a2.416 2.416 0 01-2.409-2.409zm13.85-16.26v-1.174c-.1-.017-.2-.027-.3-.03h-2.41v1.2a1.2 1.2 0 01-1.2 1.2h2.71a1.2 1.2 0 001.2-1.196z" fill="#D5DBE1"></path><path d="M20.322 20.882v-2.409h2.108a2.41 2.41 0 011.054-1.987 2.389 2.389 0 00-3.056.286 2.416 2.416 0 00-.708 1.701h-2.108v2.409a1.2 1.2 0 001.2 1.2h2.71a1.2 1.2 0 01-1.2-1.2zm12.646 23.184a7.83 7.83 0 117.829-7.829 7.838 7.838 0 01-7.829 7.829zm0-13.851a6.022 6.022 0 106.022 6.022 6.029 6.029 0 00-6.022-6.021v-.001z" fill="#009f2b"></path><path d="M31.763 39.549a.902.902 0 01-.638-.265l-2.409-2.409 1.278-1.278 1.726 1.73 3.579-4.09 1.36 1.19-4.213 4.814a.906.906 0 01-.65.308h-.033z" fill="#009f2b"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18.817 22.989h6.624a2.11 2.11 0 002.102-2.108v-.3h1.511a1.508 1.508 0 011.505 1.505v3.722h1.806v-3.722a3.316 3.316 0 00-3.312-3.312h-1.51v-.302a.9.9 0 00-.9-.9h-1.33a3.312 3.312 0 00-6.374 0h-1.33a.9.9 0 00-.9.9v.302h-1.506a3.317 3.317 0 00-3.312 3.312v15.055a3.316 3.316 0 003.312 3.312h7.756v-1.807h-7.756a1.508 1.508 0 01-1.505-1.505V22.086a1.508 1.508 0 011.505-1.505h1.506v.3a2.11 2.11 0 002.108 2.108zm-.301-2.108v-1.505l1.213-.001a.9.9 0 00.9-.9 1.506 1.506 0 013.011 0 .9.9 0 00.9.9h1.2v1.506a.3.3 0 01-.3.3h-6.624a.301.301 0 01-.3-.3z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.407 24.795h11.442v1.807H16.407v-1.807zm0 3.614h8.635v1.807h-8.635v-1.807zm6.55 3.613h-6.55v1.807h6.55v-1.807z" fill="#D0D0D0"></path><path d="M42.302 31.118a1.807 1.807 0 110-3.614 1.807 1.807 0 010 3.614zm0-2.409a.6.6 0 100 1.2.6.6 0 000-1.2z" fill="#72b678"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.876 7.934h-1.2v2.409h1.2V7.934zm-5.415 3.914h2.409v1.2h-2.409v-1.2zm6.925 0h2.409v1.2h-2.409v-1.2z" fill="#72b678"></path></svg>
                <h4>Property Images and Videos</h4>
              </div>
<div className="custom-padding-proect-section">
              <div className="upload-section">
                  <div className="d-flex gap-3">
    <div>
      <div className="project-custom-svg">
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
      </div>
    </div>
    <div className="w-100">
                        <label className="custom-project-label">Upload Images of your Property</label>
       <div className="upload-area mt-2">
                  <div className="d-flex align-items-center justify-content-between upload-area-custom-direction ">
                  <div>
                   <svg
  width="51"
  height="51"
  viewBox="0 0 51 51"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M51 25.5C51 11.417 39.583 0 25.5 0S0 11.417 0 25.5 11.417 51 25.5 51 51 39.583 51 25.5z"
    style={{ fill: 'rgb(231, 243, 239)' }}
  />
  <path
    d="M28.545 11.329l1.413-1.875.937.705-1.413 1.876-.937-.706zm-4.324-1.048l-.708.938 1.873 1.415.709-.937-1.874-1.415zm5.39 4.07l-.709.937 1.873 1.415.709-.937-1.874-1.415zm-1.33 22.687a1.761 1.761 0 101.957-2.928 1.761 1.761 0 00-1.957 2.928zm.652-1.952a.587.587 0 11.652.977.587.587 0 01-.652-.977z"
    style={{ fill: 'rgb(164, 175, 193)' }}
  />
  <path
    d="M39.424 16.639v15.849a3.225 3.225 0 01-3.228 3.228H22.765l-.986.986-4.626 4.626a.873.873 0 01-.963.188.87.87 0 01-.54-.81v-4.989h-1.174a3.314 3.314 0 01-1.667-.458 3.24 3.24 0 01-1.561-2.771V16.639a3.483 3.483 0 013.522-3.228h21.425a3.226 3.226 0 013.229 3.228z"
    style={{ fill: 'rgb(243, 243, 241)' }}
  />
  <path
    d="M18.879 35.717h-1.174a3.314 3.314 0 01-1.667-.458 3.24 3.24 0 01-1.561-2.771V16.639a3.484 3.484 0 013.521-3.228H14.77a3.483 3.483 0 00-3.522 3.228v15.849a3.24 3.24 0 001.561 2.771c.505.297 1.08.456 1.667.458h1.172v4.994a.87.87 0 00.54.81.873.873 0 00.963-.188l1.726-1.726.002-3.89z"
    style={{ fill: 'rgb(213, 219, 225)' }}
  />
  <path
    d="M19.466 19.281a2.348 2.348 0 11-4.696 0 2.348 2.348 0 014.696 0zm9.98.2c.545 0 1.068.215 1.455.599l8.52 8.523v3.89a3.225 3.225 0 01-3.228 3.228h-13.43l-.986.986-4.626 4.626a.873.873 0 01-.963.188.87.87 0 01-.54-.81v-4.993h-1.172a3.314 3.314 0 01-1.667-.458 3.24 3.24 0 01-1.561-2.771v-1.538l6.764-6.762a2.069 2.069 0 012.911 0l1.479 1.479 5.588-5.588a2.07 2.07 0 011.456-.599z"
    style={{ fill: 'rgb(126, 216, 170)' }}
  />
  <path
    d="M14.183 33.737v1.095c0 .29.039.577.115.856a3.34 3.34 0 01-1.489-.433 3.24 3.24 0 01-1.561-2.771v-1.1c0-.277.11-.544.306-.74l5.717-5.718a3.115 3.115 0 014.391 0l.445.92c.271.272.458-.043.672-.405.109-.183.225-.378.362-.515l4.109-4.109a3.115 3.115 0 014.391 0l1.038 1.038a2.056 2.056 0 00-1.754.571l-4.849 4.849a1.046 1.046 0 01-1.479 0 3.115 3.115 0 00-4.391 0l-5.717 5.722a1.047 1.047 0 00-.306.74zm4.402 4.328v1.831l-1.432 1.432a.873.873 0 01-.963.188.87.87 0 01-.54-.81v-3.174c.016.01.031.024.046.037.015.014.03.027.048.038.505.297 1.08.456 1.667.458h1.174z"
    style={{ fill: 'rgb(0, 166, 81)' }}
  />
  <path
    d="M16.54 41.587a.88.88 0 01-.88-.88v-4.99h-1.176a3.231 3.231 0 01-3.228-3.228v-15.85a3.483 3.483 0 013.522-3.228h21.425a3.231 3.231 0 013.228 3.228v15.849a3.23 3.23 0 01-3.228 3.228h-13.43l-5.612 5.612a.875.875 0 01-.622.258v.001zm-1.762-26.415a1.772 1.772 0 00-1.76 1.467v12.544l4.999-5a2.061 2.061 0 012.911 0l1.479 1.479 5.588-5.588a2.061 2.061 0 012.911 0l6.764 6.764V16.64a1.47 1.47 0 00-1.467-1.467H14.778zM37.67 29.33v3.156a1.47 1.47 0 01-1.467 1.467H22.41a.88.88 0 00-.622.258l-4.368 4.368v-3.744a.882.882 0 00-.88-.88h-2.055a1.47 1.47 0 01-1.467-1.467v-.81l6.241-6.248a.3.3 0 01.423 0l2.1 2.1a.881.881 0 001.246 0l6.21-6.21a.3.3 0 01.423 0l8.01 8.01zm-20.544-7.697a2.348 2.348 0 11-.006-4.696 2.348 2.348 0 01.006 4.696zm0-2.935a.587.587 0 10.543.361.59.59 0 00-.543-.365v.004z"
    fillRule="evenodd"
  />
</svg>

                  </div>
                  <div>
                  <div className="upload-buttons">
                    <button type="button" className="btn-custom-projects" onClick={() => projectImageInputRef.current?.click()}>

                      Upload Images
                    </button>
                    <button type="button" className="btn-custom-projects1">
                      Image Bank
                    </button>
                  </div>
                  <small>Max size 5MB, .jpg .png only</small>
                  </div>
                  <div>
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
                  </div>
                                  {projectImages.length > 0 && (
                  <div className="uploaded-files mt-3">
                    <h4>Uploaded Images ({projectImages.length})</h4>
                    <div className="file-grid">
                      {projectImages.map((image) => (
                        <div key={image.id} className="file-item">
                          <img src={image.url} alt={image.name} />
                          <div className="file-info">
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
                  <input
                    ref={projectImageInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleProjectImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                              <div className="quality-tip">
                <i className="fas fa-check-circle"></i>
                <span>Add at least 5 more images</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${(projectImages.length / 5) * 100}%` }}></div>
                </div>
              </div>   
    </div>
  </div>
              </div>


              <div className="video-section">
                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path></svg>
                    </div>
                  </div>
                  <div>
                  <label className="custom-project-label mb-0">Add Videos of your Property</label>
                <span className="custom-span">Add videos of your property from YouTube. Upload on YouTube and paste the link below.</span>
                <div className="video-upload-buttons mt-3">
                  <button type="button" className="btn btn-primary" onClick={() => projectVideoInputRef.current?.click()}>
                    Upload Video Files
                  </button>
                  <button type="button" className="btn btn-outline" onClick={handleYoutubeLinkAdd}>
                    Add YouTube Link
                  </button>
                </div>
                <small className="custom-span">Max size 50MB for video files. Supported formats: MP4, AVI, MOV, WMV</small>
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
              </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="form-section projects-section">
              <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path d="M33.717 35.854v4.52a1.433 1.433 0 01-1.571 1.406A21.228 21.228 0 0112.59 22.238a1.43 1.43 0 011.406-1.552l4.414-.032a1.417 1.417 0 011.38 1.067l.922 3.662a1.406 1.406 0 01-.522 1.471l-2.256 1.68a17.756 17.756 0 007.807 7.852l1.734-2.3a1.425 1.425 0 011.48-.522l3.689.916a1.413 1.413 0 011.073 1.374z" fill="#F3F3F1"></path><path d="M32.996 41.582a1.4 1.4 0 01-.845.2 21.25 21.25 0 01-19.562-19.55 1.422 1.422 0 011.4-1.541l4.424-.037a.484.484 0 01.186.025l-2.125.012a1.421 1.421 0 00-1.4 1.541 21.226 21.226 0 0017.922 19.35z" fill="#D5DBE1"></path><path d="M32.264 42.713c-.063 0-.127 0-.189-.007a22.263 22.263 0 01-20.41-20.4 2.4 2.4 0 01.625-1.8 2.306 2.306 0 011.7-.752l4.414-.031a2.35 2.35 0 012.288 1.772l.922 3.664a2.327 2.327 0 01-.872 2.445l-1.614 1.2a16.94 16.94 0 006.348 6.38l1.251-1.657a2.353 2.353 0 012.448-.865l3.689.916a2.34 2.34 0 011.783 2.273v4.521a2.3 2.3 0 01-.739 1.706 2.43 2.43 0 01-1.639.635h-.005zM18.413 21.586l-4.405.031a.457.457 0 00-.345.153.523.523 0 00-.135.4 20.387 20.387 0 0018.691 18.676.535.535 0 00.418-.139.45.45 0 00.148-.337v-4.52a.48.48 0 00-.368-.464l-3.689-.914a.485.485 0 00-.511.179l-1.735 2.3a.936.936 0 01-1.168.268 18.793 18.793 0 01-8.217-8.266.933.933 0 01.277-1.164l2.256-1.68a.473.473 0 00.179-.493l-.922-3.664a.486.486 0 00-.473-.362l-.001-.004zm14.372 1.864h1.864v5.592h-1.864V23.45z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M28.96 11.167l-.88-.88-1.757 1.758.879.879 1.757-1.757zm-5.053 5.053l-.879-.88-1.757 1.758.879.879 1.757-1.757zm-1.977-5.931l1.757 1.757-.879.879-1.757-1.757.879-.88z" fill="#72b678"></path><path d="M33.717 29.553a7.707 7.707 0 100-15.414 7.707 7.707 0 000 15.414z" fill="#E7F3EF"></path><path d="M33.717 30.556a8.713 8.713 0 118.712-8.712 8.722 8.722 0 01-8.712 8.712zm0-15.413a6.7 6.7 0 106.7 6.7 6.71 6.71 0 00-6.7-6.7z" fill="#009f2b"></path><path d="M32.377 25.532a1 1 0 01-.71-.295l-2.681-2.68 1.422-1.422 1.921 1.921 3.987-4.552 1.513 1.324-4.691 5.361a1.01 1.01 0 01-.724.343h-.037z" fill="#009f2b"></path></svg>
                <h4>Contact Information</h4>
              </div>
<div className="custom-padding-proect-section">
              <div className="form-group">
                                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
<label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control projects-input-custom"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                </div>
              </div>

              <div className="form-group">
                                                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                                    <label>Mobile</label>
                <div className="input-group">
                  <select
                    name="mobileCountryCode"
                    className="form-control projects-input-custom"
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
                    className="form-control projects-input-custom"
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
                  <button type="button" className="btn btn-outline-cstm">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                    </div>
                  </div>
              </div>

              <div className="form-group">
                                                                <div className="d-flex gap-3">
                  <div>
                    <div className="project-custom-svg">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                    </div>
                  </div>
                  <div className="w-100">
                <label>Landline</label>
                <div className="input-group">
                  <select
                    name="landlineCountryCode"
                    className="form-control projects-input-custom"
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
                    className="form-control projects-input-custom"
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
              </div>
              </div>
            </div>

            {/* Platform Selection Section */}
            <div className="form-section projects-section">
              <div className="section-header">
                <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#F7F7F7"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M37.466 9.836l.835-.835 1.67 1.67-.835.835-1.67-1.67zm4.591 1.253l1.67-1.67.835.835-1.67 1.67-.835-.835zm1.043 2.714l-.835.835 1.67 1.67.835-.835-1.67-1.67z" fill="#A4AFC1"></path><path d="M39.456 19.441v17.713a2.369 2.369 0 01-2.362 2.362H15.248a2.37 2.37 0 01-2.362-2.362V19.441h26.57z" fill="#F3F3F1"></path><path d="M39.456 17.67v1.771h-26.57V17.67a2.37 2.37 0 012.362-2.362h21.846a2.369 2.369 0 012.362 2.362z" fill="#009f2b"></path><path d="M18.946 34.984a.59.59 0 00.435.99h1.771v4.723a1.181 1.181 0 001.181 1.181h7.676a1.18 1.18 0 001.181-1.181v-4.723h1.771a.59.59 0 00.435-.99l-7.225-7.867-7.225 7.867z" fill="#E7F3EF"></path><path d="M15.543 37.154V19.441h-2.657v17.713a2.369 2.369 0 002.362 2.362h2.657a2.37 2.37 0 01-2.362-2.362z" fill="#D5DBE1"></path><path d="M17.905 15.308h-2.657a2.37 2.37 0 00-2.362 2.362v1.771h2.657V17.67a2.37 2.37 0 012.362-2.362z" fill="#009f2b"></path><path d="M30.004 42.764h-7.672a2.069 2.069 0 01-2.067-2.067v-3.838h-.886a1.476 1.476 0 01-1.088-2.474l7.225-7.867a.91.91 0 011.3 0l7.225 7.867a1.475 1.475 0 01-1.086 2.474h-.886v3.838a2.069 2.069 0 01-2.065 2.067zm-9.956-7.676h1.1a.886.886 0 01.886.886v4.724a.3.3 0 00.3.3h7.67a.3.3 0 00.3-.3v-4.724a.886.886 0 01.886-.886h1.1l-6.118-6.663-6.124 6.663z" fill="#009f2b"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M37.094 40.401h-1.772V38.63h1.771a1.478 1.478 0 001.476-1.476V20.327H13.771v16.827a1.478 1.478 0 001.476 1.476h1.771v1.771h-1.771A3.25 3.25 0 0112 37.154V17.669a3.25 3.25 0 013.247-3.247h21.847a3.25 3.25 0 013.247 3.247v19.485a3.25 3.25 0 01-3.247 3.247zM13.771 18.556h24.798v-.887a1.478 1.478 0 00-1.476-1.476H15.247a1.478 1.478 0 00-1.476 1.476v.887zm17.713 10.037h-1.771v2.952h1.771v-2.952z" fill="#D0D0D0"></path></svg>
                <h4>Platform Selection</h4>
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
              <button type="submit" className="btn-custom" disabled={isLoading}>
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
                      <td style={{ padding: '12px', color: '#2c3e50' }}>
                        {p.availableOnInstallments ? (
                          <div>
                            <div>Yes</div>
                            {p.advanceAmount && (
                              <small style={{ color: '#666' }}>
                                Advance: {formatCurrency(p.currency, p.advanceAmount)}
                              </small>
                            )}
                            {p.monthlyInstallment && (
                              <div>
                                <small style={{ color: '#666' }}>
                                  Monthly: {formatCurrency(p.currency, p.monthlyInstallment)}
                                </small>
                              </div>
                            )}
                          </div>
                        ) : 'No'}
                      </td>
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
    </div>
  );
};

export default ProjectsTab;