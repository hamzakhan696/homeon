import React from 'react';

const OverviewTab = () => {
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
  );
};

export default OverviewTab;
