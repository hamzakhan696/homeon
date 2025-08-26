import React from 'react';

const PropertiesTab = () => {
  return (
    <div className="properties-section">
      <h2>Properties Management</h2>
      <p>Properties management interface will be implemented here.</p>
      
      {/* Add your properties management content here */}
      <div className="properties-content">
        <div className="properties-header">
          <h3>All Properties</h3>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Add New Property
          </button>
        </div>
        
        <div className="properties-filters">
          <div className="filter-group">
            <label>Filter by Type:</label>
            <select className="form-control">
              <option>All Types</option>
              <option>House</option>
              <option>Flat</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select className="form-control">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Sold</option>
              <option>Rented</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search:</label>
            <input type="text" className="form-control" placeholder="Search properties..." />
          </div>
        </div>
        
        <div className="properties-table">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Beautiful House in DHA</td>
                <td>House</td>
                <td>Lahore, DHA Phase 5</td>
                <td>PKR 25,000,000</td>
                <td><span className="badge badge-success">Active</span></td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Modern Flat in Gulberg</td>
                <td>Flat</td>
                <td>Lahore, Gulberg III</td>
                <td>PKR 8,500,000</td>
                <td><span className="badge badge-warning">Pending</span></td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
