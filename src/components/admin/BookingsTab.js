import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';

export default function BookingsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null); // for modal

  const load = () => {
    setLoading(true);
    setErr('');

    fetch(`${API_BASE_URL}/admin/bookings`)
      .then((r) => r.json())
      .then((d) => {
        console.log('📦 API Response:', d);
        setItems(Array.isArray(d) ? d : []);
      })
      .catch((e) => setErr(e?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatCurrency = (cur, amount) => {
    if (!amount) return '-';
    const num = Number(amount);
    if (isNaN(num)) return `${cur || ''} ${amount}`.trim();
    return `${cur} ${num.toLocaleString()}`;
  };

  return (
    <div className="bookings-section container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <h3 className="mb-0 text-dark">All Bookings</h3>
          <span className="badge bg-success rounded-pill">{items.length}</span>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i> Refresh
            </>
          )}
        </button>
      </div>

      {/* States */}
      {err && <p className="text-danger mb-3">{err}</p>}
      {loading && !err && (
        <p className="text-center text-secondary">
          <i className="fas fa-spinner fa-spin"></i> Loading bookings...
        </p>
      )}
      {!loading && !err && items.length === 0 && (
        <p className="text-center text-muted">No bookings found.</p>
      )}

      {/* Table */}
      {!loading && !err && items.length > 0 && (
        <div className="table-responsive shadow-sm rounded bg-white">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-success text-white text-center">
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Project</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
                  <td>{b.fullName}</td>
                  <td>{b.projectTitle}</td>
                  <td>{b.city || '-'}</td>
                  <td>
                    <button
                      className="view-detail-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#bookingDetailsModal"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <i className="fas fa-eye me-1"></i> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="bookingDetailsModal"
        tabIndex="-1"
        aria-labelledby="bookingDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="bookingDetailsModalLabel">
                Booking Details
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBooking ? (
                <div className="container-fluid">
                  <div className="row g-3">
                    {Object.entries(selectedBooking).map(([key, value]) => (
                      <div className="col-md-6" key={key}>
                        <strong className="text-capitalize d-block text-muted">{key.replace(/([A-Z])/g, ' $1')}</strong>
                        <p className="mb-2">{value || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">Select a booking to view details.</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
