import React from 'react';

const ReportsTab = () => {
  return (
   <div>
    <h2>Reports & Analytics</h2>
    <div className="reports-section">
      
      <div className="reports-content">
        <div className="reports-header">
          <h3>Analytics Dashboard</h3>
          <div className="date-filter">
            <label>Filter by Date:</label>
            <select className="form-control projects-input-custom mt-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
        
        <div className="reports-grid mt-3">
          <div className="report-card">
            <h3>Property Performance</h3>
            <div className="chart-placeholder">
              <i className="fas fa-chart-line"></i>
              <p>Property performance chart will be displayed here</p>
            </div>
            <div className="report-stats mt-2 d-flex justify-content-between">
              <div className="stat">
                <span className="label">Total Views</span>
                <span className="value ms-2">12,847</span>
              </div>
              <div className="stat">
                <span className="label">Avg. Time on Page</span>
                <span className="value ms-2">2m 34s</span>
              </div>
            </div>
          </div>
          
          <div className="report-card mt-3">
            <h3>Lead Generation</h3>
            <div className="chart-placeholder">
              <i className="fas fa-chart-pie"></i>
              <p>Lead generation chart will be displayed here</p>
            </div>
            <div className="report-stats mt-2 d-flex justify-content-between">
              <div className="stat">
                <span className="label">Total Leads</span>
                <span className="value ms-2">234</span>
              </div>
              <div className="stat">
                <span className="label">Conversion Rate</span>
                <span className="value ms-2">8.7%</span>
              </div>
            </div>
          </div>
          
          <div className="report-card mt-3">
            <h3>Revenue Analysis</h3>
            <div className="chart-placeholder">
              <i className="fas fa-chart-bar"></i>
              <p>Revenue analysis chart will be displayed here</p>
            </div>
            <div className="report-stats mt-2 d-flex justify-content-between">
              <div className="stat">
                <span className="label">Total Revenue</span>
                <span className="value ms-2">$2.4M</span>
              </div>
              <div className="stat">
                <span className="label">Growth Rate</span>
                <span className="value ms-2">+18%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="detailed-reports mt-3">
          <h3>Detailed Reports</h3>
          <div className="reports-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Last Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Property Report</td>
                  <td>2 days ago</td>
                  <td><span className="badge badge-success">Ready</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary">Download</button>
                    <button className="btn btn-sm btn-outline ms-2">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Lead Conversion Report</td>
                  <td>1 week ago</td>
                  <td><span className="badge badge-success">Ready</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary">Download</button>
                    <button className="btn btn-sm btn-outline ms-2">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Financial Summary</td>
                  <td>1 month ago</td>
                  <td><span className="badge badge-warning">Outdated</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary">Download</button>
                    <button className="btn btn-sm btn-outline ms-2">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="export-options">
          <h3>Export Options</h3>
          <div className="export-buttons">
            <button className="btn btn-outline">
              <i className="fas fa-file-pdf me-2"></i>
              Export as PDF
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-file-excel me-2"></i>
              Export as Excel
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-file-csv me-2"></i>
              Export as CSV
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-envelope me-2"></i>
              Email Report
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ReportsTab;
