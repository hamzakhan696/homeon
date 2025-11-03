import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function BookingsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null); // for modal
const downloadPDF = () => {
  const input = document.getElementById("booking-details-pdf");

  if (!input) return;

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Booking_${selectedBooking?.referenceId || "Details"}.pdf`);
  });
};

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
// Helper: show label/value in a grid column
const DetailRow = ({ label, value, col = "6" }) => (
  <div className={`col-md-${col}`}>
    <strong className="text-muted d-block small mb-1">{label}</strong>
    <p className="mb-0 text-dark">{value || '-'}</p>
  </div>
);

// Helper: image card with fallback
const ImageCard = ({ title, src }) => (
  <div className="col-md-6 text-center">
    <p className="mb-1 fw-semibold">{title}</p>
    {src ? (
      <img src={src} alt={title} className="img-fluid rounded border" style={{ width: "100%", height: 180, objectFit: "cover" }} />
    ) : (
      <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: 180, border: "1px dashed #ddd" }}>
        <small className="text-muted">No image</small>
      </div>
    )}
  </div>
);

// Helper: small badge
const Badge = ({ label = "", color = "secondary" }) => {
  if (!label) return null;
  return (
    <span className={`badge bg-${color} text-white text-uppercase`} style={{ fontSize: 12 }}>
      {label}
    </span>
  );
};

// Utility: format date safely
const formatDate = (v) => {
  if (!v) return '-';
  try {
    return new Date(v).toLocaleDateString();
  } catch {
    return v;
  }
};


  const formatCurrency = (cur, amount) => {
    if (!amount) return '-';
    const num = Number(amount);
    if (isNaN(num)) return `${cur || ''} ${amount}`.trim();
    return `${cur} ${num.toLocaleString()}`;
  };

  return (
<div className="bookings-section container-fluid">

  {!selectedBooking ? (
    <>
      {/* LIST VIEW CODE */}
      
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
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* States */}
      {err && <p className="text-danger">{err}</p>}
      {loading && !err && <p className="text-center"><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
      {!loading && !err && items.length === 0 && (
        <p className="text-center">No bookings found.</p>
      )}

      {/* TABLE */}
      {!loading && !err && items.length > 0 && (
        <div className="table-responsive shadow-sm rounded bg-white">
          <table className="table table-hover align-middle mb-0 text-center">
            <thead className="bg-success text-white">
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Project</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id}>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td>{b.fullName}</td>
                  <td>{b.projectTitle}</td>
                  <td>{b.city || '-'}</td>
                  <td>
                    <button
                      className="view-detail-btn"
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

    </>
  ) : (
    <>
      {/* DETAILS VIEW */}

      <button
        className="btn btn-outline-danger mb-3"
        onClick={() => setSelectedBooking(null)}
      >
        <i className="fas fa-arrow-left me-2"></i> Back to All Bookings
      </button>
  <div className="booking-details py-2" id="booking-details-pdf">
          <h3 className="text-success mb-3">Booking Details</h3>
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex align-items-start flex-column flex-md-row gap-3">
          <div style={{ width: 140 }}>
            {selectedBooking.applicantPhotoUrl ? (
              <img
                src={selectedBooking.applicantPhotoUrl}
                alt="Applicant"
                className="img-fluid rounded booking-profile"
              />
            ) : (
              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 140, height: 120, border: "1px dashed #ddd" }}>
                <i className="fas fa-user fa-2x text-muted"></i>
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{selectedBooking.fullName || "-"}</h5>

            <div className="mb-2">
              <small className="text-muted me-3"><strong>Father:</strong> {selectedBooking.fatherName || "-"}</small>
              <small className="text-muted"><strong>Occupation:</strong> {selectedBooking.occupation || "-"}</small>
            </div>

            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              <Badge label={selectedBooking.applicantType} color="success" />
              <Badge label={selectedBooking.gender} color="secondary" />
            </div>

            <div className="row g-2">
              <DetailRow label="Phone" value={selectedBooking.phone} col="6" />
              <DetailRow label="Secondary Phone" value={selectedBooking.secondaryPhone || "-"} col="6" />
              <DetailRow label="Email" value={selectedBooking.email} col="6" />
              <DetailRow label="City" value={selectedBooking.city} col="6" />
              <DetailRow label="CNIC / ID" value={selectedBooking.cnic || "-"} col="6" />
              <DetailRow label="DOB" value={formatDate(selectedBooking.dateOfBirth)} col="6" />
              <div className="col-12">
                <strong className="text-muted d-block mb-1">Address</strong>
                <p className="mb-0">{selectedBooking.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Applicant Documents</h6>
        <div className="row g-3">
          <ImageCard title="CNIC Front" className="img-fluid cnic-photo-custom" src={selectedBooking.applicantCnicFrontUrl} />
          <ImageCard title="CNIC Back" className="img-fluid cnic-photo-custom" src={selectedBooking.applicantCnicBackUrl} />
        </div>
      </div>
    </div>
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Nominee</h6>
        <div className="row g-3">
          <DetailRow label="Name" value={selectedBooking.nomineeFullName} col="6" />
          <DetailRow label="Father" value={selectedBooking.nomineeFatherName} col="6" />
          <DetailRow label="Relationship" value={selectedBooking.nomineeRelationship} col="6" />
          <DetailRow label="Phone" value={selectedBooking.nomineePrimaryPhone} col="6" />
          <DetailRow label="CNIC" value={selectedBooking.nomineeCnic} col="6" />
          <div className="col-12">
            <strong className="text-muted d-block mb-1">Address</strong>
            <p className="mb-0">{selectedBooking.nomineeAddress || "-"}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Nominee Documents</h6>
        <div className="row g-3">
          <ImageCard title="CNIC Front" className="img-fluid cnic-photo-custom" src={selectedBooking.nomineeCnicFrontUrl} />
          <ImageCard title="CNIC Back" className="img-fluid cnic-photo-custom" src={selectedBooking.nomineeCnicBackUrl} />
        </div>
      </div>
    </div>
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Project & Booking</h6>
        <div className="row g-3">
          <DetailRow label="Project" value={selectedBooking.projectTitle} col="6" />
          <DetailRow label="Location" value={selectedBooking.location} col="6" />
          <DetailRow label="Price" value={formatCurrency(selectedBooking.price, selectedBooking.currency)} col="6" />
          <DetailRow label="Reference ID" value={selectedBooking.referenceId} col="6" />
          <DetailRow label="Booking Date" value={formatDate(selectedBooking.createdAt)} col="6" />
          <DetailRow label="Message" value={selectedBooking.message || "-"} col="12" />
        </div>
      </div>
    </div>

  </div>
  <div className='d-flex justify-content-end'>
<button
  className="btn-custom mb-3"
  onClick={downloadPDF}
>
  <i className="fas fa-file-pdf me-2"></i> Download PDF
</button>
</div>
    </>
  )}

</div>

  );
}
