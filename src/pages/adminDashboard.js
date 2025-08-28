import React, { useState, useEffect } from 'react';
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
            <li className={activeTab === 'bookings' ? 'active' : ''}>
              <button onClick={() => setActiveTab('bookings')}>
                <i className="fas fa-calendar-check"></i>
                {!sidebarCollapsed && <span>Bookings</span>}
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