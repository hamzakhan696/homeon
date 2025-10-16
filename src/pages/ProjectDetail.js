import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { apiGet, apiJson, apiDelete } from '../api';
import { resolveMediaUrl } from '../media';
import { showToast } from '../toast';
import NavBar from '../layout/header';
import Footer from '../layout/footer';

export default function ProjectDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [p, setP] = useState(null);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState('');

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		apiGet(`/admin/projects/${id}`)
			.then((d) => mounted && setP(d))
			.catch((e) => mounted && setErr(e?.message || 'Failed to load'))
			.finally(() => mounted && setLoading(false));
		return () => { mounted = false; };
	}, [id]);

	async function handleDelete() {
		if (!window.confirm('Delete this project?')) return;
		await apiDelete(`/admin/projects/${id}`);
		navigate('/portfolio');
	}

	async function handleSave() {
		await apiJson('PUT', `/admin/projects/${id}`, p);
		const fresh = await apiGet(`/admin/projects/${id}`);
		setP(fresh);
		alert('Saved');
	}

	const gallery = Array.isArray(p?.projectImages) ? p.projectImages : [];

	return (
		<div className='overflow-hidden'>
			<div className='contactUs-bg'>
				<NavBar/>
				<div className="dlab-bnr-inr d-flex align-items-center">
					<div className="container">
						<div className="dlab-bnr-inr-entry text-md-start text-center">
							<h1>PROJECT DETAILS</h1>
							<nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
								<ul className="breadcrumb">
									<li className="breadcrumb-item"><NavLink to={'/'}><i className="las fa-home me-2"></i>Home</NavLink></li>
									<li className="breadcrumb-item"><NavLink to={'/portfolio'}>Portfolio</NavLink></li>
									<li className="breadcrumb-item active" aria-current="page">Details</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>
			<div className='container mt-5 mb-5'>
				{loading && <p style={{ textAlign:'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
				{!loading && err && <p className='text-danger' style={{ textAlign:'center' }}>{err}</p>}
				{!loading && !err && p && (
					<div className="row">
						<div className="col-md-7">
							{gallery.length > 0 ? (
								<>
									<img src={resolveMediaUrl(gallery[0])} alt={p.title} style={{ width:'100%', height:380, objectFit:'cover', borderRadius:8 }} />

									<div className="row" style={{ marginTop: 10 }}>
										{gallery.slice(1, 7).map((g, i) => (
											<div key={i} className="col-4" style={{ marginBottom: 10 }}>
												<img src={resolveMediaUrl(g)} alt={`img-${i}`} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:6 }} />
											</div>
										))}
									</div>
								</>
							) : (
								<div className="placeholder" style={{ height:380, background:'#f2f2f2', borderRadius:8 }} />
							)}
						</div>
						<div className="col-md-5">
							<h2 style={{ marginTop: 0 }}>{p.title}</h2>
							<p>{p.description}</p>
							<div style={{ display:'grid', gridTemplateColumns:'120px 1fr', rowGap:8 }}>
								<strong>Purpose</strong><span>{p.purpose}</span>
								<strong>Type</strong><span>{p.propertyType} / {p.propertySubtype}</span>
								<strong>Location</strong><span>{p.city}, {p.location}</span>
								<strong>Area</strong><span>{p.areaSize} {p.areaUnit}</span>
								<strong>Price</strong><span>{p.currency} {Number(p.price).toLocaleString()}</span>
								<strong>Bedrooms</strong><span>{p.bedrooms || '-'}</span>
								<strong>Bathrooms</strong><span>{p.bathrooms || '-'}</span>
								<strong>Amenities</strong><span>{Array.isArray(p.amenities) ? p.amenities.join(', ') : '-'}</span>
							</div>
							<div style={{ marginTop: 16 }}>
								<button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#bookingModal">Book Now</button>
							</div>

						</div>
					</div>
				)}
			</div>

			<div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-xl modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Book Project</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							{p && (
								<form id="bookingForm" onSubmit={async (e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const submitBtn = form.querySelector('button[type="submit"]');
									submitBtn.disabled = true;
									submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
									const payload = {
										// Basic information
										fullName: form.fullName.value,
										email: form.email.value,
										phone: form.phone.value,
										message: form.message.value,
										projectId: Number(p.id),
										projectTitle: p.title,
										city: p.city,
										location: p.location,
										price: Number(p.price),
										currency: p.currency,
										
										// Additional applicant information
										applicantType: form.applicantType?.value || null,
										gender: form.gender?.value || null,
										referenceId: form.referenceId?.value || null,
										fatherName: form.fatherName?.value || null,
										cnic: form.cnic?.value || null,
										dateOfBirth: form.dateOfBirth?.value || null,
										secondaryPhone: form.secondaryPhone?.value || null,
										address: form.address?.value || null,
										occupation: form.occupation?.value || null,
										
										// Nominee/Joint Applicant Information
										nomineeType: form.nomineeType?.value || null,
										nomineeGender: form.nomineeGender?.value || null,
										nomineeFullName: form.nomineeFullName?.value || null,
										nomineeFatherName: form.nomineeFatherName?.value || null,
										nomineeCnic: form.nomineeCnic?.value || null,
										nomineeDateOfBirth: form.nomineeDateOfBirth?.value || null,
										nomineePrimaryPhone: form.nomineePrimaryPhone?.value || null,
										nomineeSecondaryPhone: form.nomineeSecondaryPhone?.value || null,
										nomineeAddress: form.nomineeAddress?.value || null,
										nomineeRelationship: form.nomineeRelationship?.value || null,
										nomineeOccupation: form.nomineeOccupation?.value || null,
									};
									try {
										const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://192.168.1.194:3002'}/admin/bookings`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify(payload),
										});
										
										if (!response.ok) {
											throw new Error(`HTTP error! status: ${response.status}`);
										}
										
										if (window.bootstrap && window.bootstrap.Modal) {
											const el = document.getElementById('bookingModal');
											const modal = window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el);
											modal.hide();
										}
										showToast('Booking submitted successfully. We will contact you soon.','success');
										form.reset();
									} catch (error) {
										console.error('Booking submission error:', error);
										showToast('Failed to submit booking. Please try again.','error');
									} finally {
										submitBtn.disabled = false;
										submitBtn.innerHTML = 'Submit Booking';
									}
								}}>
									{/* APPLICANT SECTION */}
									<div className="mb-4">
										<h6 className="text-primary mb-3" style={{ borderBottom: '2px solid #63b330', paddingBottom: '8px' }}>
											<i className="fas fa-user me-2"></i>APPLICANT INFORMATION
										</h6>
										<div className="row g-3">
											<div className="col-md-6">
												<label className="form-label">Type of Applicant</label>
												<div className="d-flex gap-3">
													<div className="form-check">
														<input className="form-check-input" type="radio" name="applicantType" value="LOCAL" id="local" />
														<label className="form-check-label" htmlFor="local">LOCAL</label>
													</div>
													<div className="form-check">
														<input className="form-check-input" type="radio" name="applicantType" value="OVERSEAS" id="overseas" />
														<label className="form-check-label" htmlFor="overseas">OVERSEAS</label>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<label className="form-label">Gender</label>
												<div className="d-flex gap-3">
													<div className="form-check">
														<input className="form-check-input" type="radio" name="gender" value="MALE" id="male" />
														<label className="form-check-label" htmlFor="male">MALE</label>
													</div>
													<div className="form-check">
														<input className="form-check-input" type="radio" name="gender" value="FEMALE" id="female" />
														<label className="form-check-label" htmlFor="female">FEMALE</label>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<label className="form-label">Reference ID</label>
												<input name="referenceId" className="form-control" placeholder="Enter reference ID" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Full Name</label>
												<input name="fullName" className="form-control" required />
											</div>
											<div className="col-md-6">
												<label className="form-label">S/O, D/O, W/O</label>
												<input name="fatherName" className="form-control" placeholder="Father/Husband name" />
											</div>
											<div className="col-md-6">
												<label className="form-label">CNIC No</label>
												<input name="cnic" className="form-control" placeholder="12345-1234567-1" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Date of Birth</label>
												<input type="date" name="dateOfBirth" className="form-control" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Primary Phone</label>
												<input name="phone" className="form-control" required />
											</div>
											<div className="col-md-6">
												<label className="form-label">Secondary Phone</label>
												<input name="secondaryPhone" className="form-control" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Email Address</label>
												<input type="email" name="email" className="form-control" required />
											</div>
											<div className="col-12">
												<label className="form-label">Address</label>
												<textarea name="address" className="form-control" rows="2" placeholder="Enter complete address"></textarea>
											</div>
											<div className="col-md-6">
												<label className="form-label">Occupation</label>
												<input name="occupation" className="form-control" placeholder="Enter occupation" />
											</div>
										</div>
									</div>

									{/* NOMINEE/JOINT APPLICATION SECTION */}
									<div className="mb-4">
										<h6 className="text-primary mb-3" style={{ borderBottom: '2px solid #63b330', paddingBottom: '8px' }}>
											<i className="fas fa-users me-2"></i>NOMINEE / JOINT APPLICATION INFORMATION
										</h6>
										<div className="row g-3">
											<div className="col-md-6">
												<label className="form-label">Type of Nominee/Joint Applicant</label>
												<div className="d-flex gap-3">
													<div className="form-check">
														<input className="form-check-input" type="radio" name="nomineeType" value="LOCAL" id="nomineeLocal" />
														<label className="form-check-label" htmlFor="nomineeLocal">LOCAL</label>
													</div>
													<div className="form-check">
														<input className="form-check-input" type="radio" name="nomineeType" value="OVERSEAS" id="nomineeOverseas" />
														<label className="form-check-label" htmlFor="nomineeOverseas">OVERSEAS</label>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<label className="form-label">Gender</label>
												<div className="d-flex gap-3">
													<div className="form-check">
														<input className="form-check-input" type="radio" name="nomineeGender" value="MALE" id="nomineeMale" />
														<label className="form-check-label" htmlFor="nomineeMale">MALE</label>
													</div>
													<div className="form-check">
														<input className="form-check-input" type="radio" name="nomineeGender" value="FEMALE" id="nomineeFemale" />
														<label className="form-check-label" htmlFor="nomineeFemale">FEMALE</label>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<label className="form-label">Full Name</label>
												<input name="nomineeFullName" className="form-control" placeholder="Nominee full name" />
											</div>
											<div className="col-md-6">
												<label className="form-label">S/O, D/O, W/O</label>
												<input name="nomineeFatherName" className="form-control" placeholder="Father/Husband name" />
											</div>
											<div className="col-md-6">
												<label className="form-label">CNIC No</label>
												<input name="nomineeCnic" className="form-control" placeholder="12345-1234567-1" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Date of Birth</label>
												<input type="date" name="nomineeDateOfBirth" className="form-control" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Primary Phone</label>
												<input name="nomineePrimaryPhone" className="form-control" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Secondary Phone</label>
												<input name="nomineeSecondaryPhone" className="form-control" />
											</div>
											<div className="col-12">
												<label className="form-label">Address</label>
												<textarea name="nomineeAddress" className="form-control" rows="2" placeholder="Enter complete address"></textarea>
											</div>
											<div className="col-md-6">
												<label className="form-label">Relationship with Applicant</label>
												<input name="nomineeRelationship" className="form-control" placeholder="e.g., Father, Mother, Spouse" />
											</div>
											<div className="col-md-6">
												<label className="form-label">Occupation</label>
												<input name="nomineeOccupation" className="form-control" placeholder="Enter occupation" />
											</div>
										</div>
									</div>

									{/* PROJECT INFORMATION SECTION */}
									<div className="mb-4">
										<h6 className="text-primary mb-3" style={{ borderBottom: '2px solid #63b330', paddingBottom: '8px' }}>
											<i className="fas fa-building me-2"></i>PROJECT INFORMATION
										</h6>
										<div className="row g-3">
											<div className="col-md-6">
												<label className="form-label">Project</label>
												<input className="form-control" value={p.title} readOnly />
											</div>
											<div className="col-md-6">
												<label className="form-label">City</label>
												<input className="form-control" value={p.city} readOnly />
											</div>
											<div className="col-md-6">
												<label className="form-label">Location</label>
												<input className="form-control" value={p.location} readOnly />
											</div>
											<div className="col-md-6">
												<label className="form-label">Price</label>
												<input className="form-control" value={`${p.currency} ${Number(p.price).toLocaleString()}`} readOnly />
											</div>
											<div className="col-12">
												<label className="form-label">Message</label>
												<textarea name="message" className="form-control" rows="3" placeholder="Any notes or additional information"></textarea>
											</div>
										</div>
									</div>

									<div className="mt-3 d-flex justify-content-end">
										<button type="submit" className="btn btn-primary" style={{ background:'#63b330', borderColor:'#63b330' }}>Submit Booking</button>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer/>
		</div>
	);
}


