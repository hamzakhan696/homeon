import React, { useState } from 'react';

const SettingsTab = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const handleSettingsTabChange = (tab) => {
    setActiveSettingsTab(tab);
  };

  return (
    <div className="settings-section">
      <h2>Settings</h2>
      
      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeSettingsTab === 'general' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('general')}
          >
            <i className="fas fa-cog"></i>
            General
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'security' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('security')}
          >
            <i className="fas fa-shield-alt"></i>
            Security
          </button>
          <button 
            className={`tab-btn ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleSettingsTabChange('notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </button>
        </div>
        
        <div className="settings-panel">
          {activeSettingsTab === 'general' && (
            <div className="general-settings">
              <h3>General Settings</h3>
              
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" className="form-control" defaultValue="Homeon Real Estate" />
              </div>
              
              <div className="form-group">
                <label>Website URL</label>
                <input type="url" className="form-control" defaultValue="https://homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" className="form-control" defaultValue="salam@homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" className="form-control" defaultValue="0325-5255255" />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea className="form-control" rows="3" defaultValue="Lahore, Pakistan"></textarea>
              </div>
              
              <div className="form-group">
                <label>Timezone</label>
                <select className="form-control">
                  <option>Asia/Karachi (UTC+5)</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date Format</label>
                <select className="form-control">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              
              <button className="btn btn-primary">
                <i className="fas fa-save"></i>
                Save General Settings
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'profile' && (
            <div className="profile-settings">
              <h3>Profile Settings</h3>
              
              <div className="profile-image-section">
                <div className="current-image">
                  <img src="assets/astronaut.jpg" alt="Profile" />
                  <button className="btn btn-outline btn-sm">
                    <i className="fas fa-camera"></i>
                    Change Photo
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" defaultValue="Admin User" />
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" defaultValue="admin" />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" defaultValue="admin@homeon.pk" />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-control" rows="4" placeholder="Tell us about yourself..."></textarea>
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input type="text" className="form-control" defaultValue="Administrator" disabled />
              </div>
              
              <button className="btn btn-primary">
                <i className="fas fa-save"></i>
                Update Profile
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'security' && (
            <div className="security-settings">
              <h3>Security Settings</h3>
              
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" placeholder="Enter current password" />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" placeholder="Enter new password" />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" placeholder="Confirm new password" />
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
              
              <button className="btn btn-primary">
                <i className="fas fa-shield-alt"></i>
                Update Security Settings
              </button>
            </div>
          )}
          
          {activeSettingsTab === 'notifications' && (
            <div className="notification-settings">
              <h3>Notification Settings</h3>
              
              <div className="notification-category">
                <h4>Email Notifications</h4>
                
                <div className="form-group">
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
                  <select className="form-control">
                    <option>Never</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
              
              <button className="btn btn-primary">
                <i className="fas fa-save"></i>
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
