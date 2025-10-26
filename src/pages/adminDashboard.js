import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/adminDashboard.css';
import OverviewTab from '../components/admin/OverviewTab';
import PropertiesTab from '../components/admin/PropertiesTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import BlogTab from '../components/admin/BlogTab';
import ReportsTab from '../components/admin/ReportsTab';
import SettingsTab from '../components/admin/SettingsTab';
import BookingsTab from '../components/admin/BookingsTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

 const [dynamicCollapse, setDynamicCollapse] = useState(false);
  const sidebarRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setDynamicCollapse(true);
      setSidebarCollapsed(false);
    } else {
      setDynamicCollapse(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);



  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div ref={sidebarRef}
        className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${dynamicCollapse ? "dynamic-collapse" : ""}`}>
        <div className="sidebar-header">
          <img src="assets/logo.webp" alt="Homeon Logo" className="sidebar-logo" />
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''}>
              <button onClick={() => setActiveTab('overview')}>
                <i className="fas fa-tachometer-alt"></i>
                  <span className="d-lg-none">Overview</span>
  {!sidebarCollapsed && <span className="d-none d-lg-inline">Overview</span>}
              </button>
            </li>
            <li className={activeTab === 'properties' ? 'active' : ''}>
              <button onClick={() => setActiveTab('properties')}>
                <i className="fas fa-home"></i>
                <span className="d-lg-none">Properties</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Properties</span>}
              </button>
            </li>
            <li className={activeTab === 'projects' ? 'active' : ''}>
              <button onClick={() => setActiveTab('projects')}>
                <i className="fas fa-building"></i>
                <span className="d-lg-none">Projects</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Projects</span>}
              </button>
            </li>
            <li className={activeTab === 'blog' ? 'active' : ''}>
              <button onClick={() => setActiveTab('blog')}>
                <i className="fas fa-blog"></i>
                <span className="d-lg-none">Blog</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Blog</span>}
              </button>
            </li>
            <li className={activeTab === 'bookings' ? 'active' : ''}>
              <button onClick={() => setActiveTab('bookings')}>
                <i className="fas fa-calendar-check"></i>
                <span className="d-lg-none">Bookings</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Bookings</span>}
              </button>
            </li>
            <li className={activeTab === 'reports' ? 'active' : ''}>
              <button onClick={() => setActiveTab('reports')}>
                <i className="fas fa-chart-bar"></i>
                <span className="d-lg-none">Reports</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Reports</span>}
              </button>
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''}>
              <button onClick={() => setActiveTab('settings')}>
                <i className="fas fa-cog"></i>
                <span className="d-lg-none">Settings</span>
                {!sidebarCollapsed && <span className="d-none d-lg-inline">Settings</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-main">
        <header className="admin-header d-flex">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
  onClick={(e) => {
    e.stopPropagation();
    setSidebarCollapsed(prev => !prev);
    setDynamicCollapse(false);
  }}
            >
                        Dashboard
              <i className="fas fa-bars ms-2"></i>
            </button>
          </div>
          
          <div className="header-right">
            <div className="admin-profile">
              <img src="assets/astronaut.jpg" alt="Admin" className="admin-avatar" />
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

                {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'properties' && <PropertiesTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'blog' && <BlogTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 