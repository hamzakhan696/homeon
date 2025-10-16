import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';

export default function BookingsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    fetch(`${API_BASE_URL}/admin/bookings`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setErr(e?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatCurrency = (cur, amount) => {
    if (amount === undefined || amount === null || amount === '') return '-';
    const num = Number(amount);
    if (Number.isNaN(num)) return `${cur || ''} ${amount}`.trim();
    return `${cur} ${num.toLocaleString()}`.trim();
  };

  return (
    <div className="bookings-section">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>All Bookings</h3>
          <span
            className="badge badge-success"
            style={{ background: '#27ae60', color: '#fff', padding: '5px 10px', borderRadius: 12 }}
          >
            {items.length}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={load}
          disabled={loading}
          style={{ background: '#ecf0f1', borderColor: '#bdc3c7', color: '#2c3e50' }}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync"></i> Refresh
            </>
          )}
        </button>
      </div>

      {err && <p className="text-danger" style={{ color: '#e74c3c', marginBottom: 15 }}>{err}</p>}
      {loading && !err && (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          <i className="fas fa-spinner fa-spin"></i> Loading bookings...
        </p>
      )}
      {!loading && !err && items.length === 0 && (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No bookings found.</p>
      )}

      {!loading && !err && items.length > 0 && (
        <div className="bookings-table-container">
          <table className="attractive-table">
            <thead>
              <tr style={{ background: '#63b330', color: '#fff' }}>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>ID</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Date</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Name</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Email</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Phone</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>CNIC</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Type</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Project</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>City</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Location</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Price</th>
                <th style={{ padding: '12px', borderRight: '1px solid #2980b9' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr
                  key={b.id}
                  style={{ background: '#fff', transition: 'background 0.3s', borderBottom: '1px solid #ecf0f1' }}
                >
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.id}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : '-'}
                  </td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.fullName}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.email}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.phone || '-'}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.cnic || '-'}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.applicantType || '-'}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>
                    #{b.projectId} - {b.projectTitle}
                  </td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.city || '-'}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>{b.location || '-'}</td>
                  <td style={{ padding: '12px', color: '#2c3e50' }}>
                    {formatCurrency(b.currency, b.price)}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      color: '#2c3e50',
                      maxWidth: 280,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {b.message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}