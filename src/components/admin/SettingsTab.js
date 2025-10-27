import React, { useState } from 'react';

const SettingsTab = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const handleSettingsTabChange = (tab) => {
    setActiveSettingsTab(tab);
  };

  return (
    <div>
      <h2>Settings</h2>
      
      <div className="settings-content settings-section">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeSettingsTab === 'general' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('general')}
          >
            <i className="fas fa-cog me-2"></i>
            General
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('profile')}
          >
            <i className="fas fa-user me-2"></i>
            Profile
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'security' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('security')}
          >
            <i className="fas fa-shield-alt me-2"></i>
            Security
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('notifications')}
          >
            <i className="fas fa-bell me-2"></i>
            Notifications
          </button>
        </div>
        
        <div className="settings-panel">
          {activeSettingsTab === 'general' && (
            <div className="general-settings mt-3">
              <h4>General Settings</h4>
              
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" className="form-control projects-input-custom" defaultValue="Homeon Real Estate" />
              </div>
              
              <div className="form-group">
                <label>Website URL</label>
                <input type="url" className="form-control projects-input-custom" defaultValue="https://homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" className="form-control projects-input-custom" defaultValue="salam@homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" className="form-control projects-input-custom" defaultValue="0325-5255255" />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea className="form-control projects-input-custom" rows="3" defaultValue="Lahore, Pakistan"></textarea>
              </div>
              
              <div className="form-group">
                <label>Timezone</label>
                <select className="form-control projects-input-custom">
                  <option>Asia/Karachi (UTC+5)</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date Format</label>
                <select className="form-control projects-input-custom">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              
              <button className="btn-custom">
                <i className="fas fa-save me-2"></i>
                Save General Settings
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'profile' && (
            <div className="profile-settings mt-3">
              <h4>Profile Settings</h4>
              
              <div className="profile-image-section">
                <div className="current-image">
                  <img src="assets/astronaut.jpg" alt="Profile" className='img-fluid' />
                  <button className="btn btn-outline">
                    <i className="fas fa-camera me-2"></i>
                    Change Photo
                  </button>
                </div>
              </div>
              
              <div className="form-group mt-2">
                <label>Full Name</label>
                <input type="text" className="form-control projects-input-custom" defaultValue="Admin User" />
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control projects-input-custom" defaultValue="admin" />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control projects-input-custom" defaultValue="admin@homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-control projects-input-custom" rows="4" placeholder="Tell us about yourself..."></textarea>
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input type="text" className="form-control projects-input-custom" defaultValue="Administrator" disabled />
              </div>
              
              <button className="btn-custom">
                <i className="fas fa-save me-2"></i>
                Update Profile
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'security' && (
            <div className="security-settings mt-3">
              <h4>Security Settings</h4>
              
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control projects-input-custom" placeholder="Enter current password" />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control projects-input-custom" placeholder="Enter new password" />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control projects-input-custom" placeholder="Confirm new password" />
              </div>
              
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li><i className="fas fa-check text-success"></i> At least 8 characters</li>
                  <li><i className="fas fa-check text-success"></i> Include uppercase letter</li>
                  <li><i className="fas fa-check text-success"></i> Include lowercase letter</li>
                  <li><i className="fas fa-check text-success"></i> Include number</li>
                  <li><i className="fas fa-times text-danger"></i> Include special character</li>
                </ul>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Enable two-factor authentication
                </label>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Require password change every 90 days
                </label>
              </div>
              
              <button className="btn-custom">
                <i className="fas fa-shield-alt me-2"></i>
                Update Security Settings
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'notifications' && (
            <div className="notification-settings mt-3">
              <h4>Notification Settings</h4>
              
              <div className="notification-category">
                <label>Email Notifications</label>
                
                <div className="form-group mt-2">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    New property inquiries
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    Property status updates
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    New user registrations
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Weekly reports
                  </label>
                </div>
              </div>
              
              <div className="notification-category">
                <h4>Push Notifications</h4>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    Real-time alerts
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    System maintenance
                  </label>
                </div>
              </div>
              
              <div className="notification-category">
                <h4>Frequency</h4>
                
                <div className="form-group">
                  <label>Daily Digest</label>
                  <select className="form-control projects-input-custom">
                    <option>Never</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
              
              <button className="btn-custom">
                <i className="fas fa-save me-2"></i>
                Save Notification Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
