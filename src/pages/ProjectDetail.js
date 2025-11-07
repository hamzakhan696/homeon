import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { apiGet, apiJson, apiDelete, API_BASE_URL } from '../api';
import { resolveMediaUrl } from '../media';
import { showToast } from '../toast';
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import '../css/projectDetail.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
export default function ProjectDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
const sliderSettings = {
  centerMode: true,
  centerPadding: "200px", // ✅ Yeh adjust karega left/right half visibility
  slidesToShow: 1,
  infinite: true,
  speed: 700,
  autoplay: true,
  autoplaySpeed: 2500,
  dots: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        centerMode: true,
        centerPadding: "150px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 992,
      settings: {
        centerMode: true,
        centerPadding: "100px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        centerMode: true,
        centerPadding: "50px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        centerMode: false, // ✅ Mobile pr sirf 1 full slide
        centerPadding: "0px",
        slidesToShow: 1,
      },
    },
  ],
};
const [selectedImage, setSelectedImage] = useState(null);

const openModal = (img) => {
  setSelectedImage(img);
};

const closeModal = () => {
  setSelectedImage(null);
};
	const [p, setP] = useState(null);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState('');
const [applicantPhoto, setApplicantPhoto] = useState(null);
const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
const [cnicBackPreview, setCnicBackPreview] = useState(null);
const [showBookingForm, setShowBookingForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [secondaryPhone, setSecondaryPhone] = useState('');
  const [isSecondaryValid, setIsSecondaryValid] = useState(true);
   const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
const [nomineeCnicFrontPreview, setNomineeCnicFrontPreview] = useState(null);
  const [nomineeCnicBackPreview, setNomineeCnicBackPreview] = useState(null);
const [nomineePrimary, setNomineePrimary] = useState('');
  const [isNomineePrimaryValid, setIsNomineePrimaryValid] = useState(true);

  const [nomineeSecondary, setNomineeSecondary] = useState('');
  const [isNomineeSecondaryValid, setIsNomineeSecondaryValid] = useState(true);
  const validateEmail = (value) => {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };
  	useEffect(() => {
		if (phoneNumber) {
		  setIsPhoneValid(isValidPhoneNumber(phoneNumber));
		}
	  }, [phoneNumber]);
	    	useEffect(() => {
		if (phoneNumber) {
		  setIsSecondaryValid(isValidPhoneNumber(phoneNumber));
		}
	  }, [phoneNumber]);
	      	useEffect(() => {
		if (phoneNumber) {
		  setIsNomineeSecondaryValid(isValidPhoneNumber(phoneNumber));
		}
	  }, [phoneNumber]);
	  	useEffect(() => {
		if (phoneNumber) {
		  setIsNomineePrimaryValid(isValidPhoneNumber(phoneNumber));
		}
	  }, [phoneNumber]);
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
			{!showBookingForm && p && (
  <>
			<div className='container-fluid project-detail px-0 mt-5 mb-5'>
				{loading && <p style={{ textAlign:'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
				{!loading && err && <p className='text-danger' style={{ textAlign:'center' }}>{err}</p>}
				{!loading && !err && p && (
					<div className="row">
						<div className='col-12'>
							<div>
								<h3 className='title-project-details mb-3 mx-5'>Product Details</h3>
<Slider {...sliderSettings} className="project-main-slider">
  {p.projectImages && p.projectImages.length > 0 ? (
    p.projectImages.map((img, index) => (
      <div key={index} className="slider-image-container">
        <img
          src={img}
          alt={`Project ${index}`}
          className="slider-image"
          onClick={() => openModal(img)}
          style={{ cursor: "pointer" }}
        />
      </div>
    ))
  ) : (
    <div className="slider-image-container">
      <img
        src="assets/image-coming-soon-placeholder.png"
        alt="No Image"
        className="slider-image"
        onClick={() => openModal("assets/image-coming-soon-placeholder.png")}
        style={{ cursor: "pointer" }}
      />
    </div>
  )}
</Slider>

{selectedImage && (
  <div className="custom-modal">
    <div className="modal-content">
      <img src={selectedImage} className="modal-image" alt="Full View" />
      <button className="close-btn-cstm" onClick={closeModal}>
        &times;
      </button>
    </div>
  </div>
)}
</div>

<div className='container mt-3'>
	<div className='row'>
<div className='col-12 property-details-wrapper'>

  {/* Top Badges */}
  <div className='d-flex align-items-center gap-3 top-badges'>
    <a className='feature-btn-projct-details premium-badge'>FEATURED</a>
    <a className="purpose-btn-projct-details premium-purpose">FOR {p.purpose?.toUpperCase()}</a>
    <span className='premium-date'>
      <i className="far fa-calendar-alt me-2"></i>
      {new Date(p.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  </div>

  {/* Title & Location */}
  <h2 className='premium-title mt-3'>{p.title}</h2>
  <p className='premium-location'>
    <i className="fas fa-map-marker-alt me-2"></i>{p.location}
  </p>

  {/* Description */}
  <div className='premium-section'>
    <h3 className="premium-heading">Description</h3>
    <p>{p.description}</p>
  </div>

  {/* Property Details */}
  <div className='premium-section'>
    <h3 className="premium-heading">Property Details</h3>
    <div className='details-card glass-card'>
      <div className='row'>
        
        <div className='col-6'>
          <p><i class="fas fa-expand-arrows-alt me-2"></i>Area: <span>{parseInt(p.areaSize)} {p.areaUnit}</span></p>
          <p><i class="fas fa-bed me-2"></i>Beds: <span>{p.bedrooms}</span></p>
          <p><i class="fas fa-bath me-2"></i>Baths: <span>{p.bathrooms}</span></p>
        </div>

        <div className='col-6'>
          <p><i class="fas fa-info-circle me-2"></i>Property Status: <span>{p.purpose}</span></p>
          <p><i class="fas fa-hand-holding-usd me-2"></i>Price: <span>{p.currency} {Number(p.price).toLocaleString()}</span></p>
        </div>

      </div>
    </div>
  </div>

  {/* Installments */}
  {(p.availableOnInstallments || p.monthlyInstallment || p.numberOfInstallments || p.readyForPossession) && (
    <div className="premium-section">
      <h3 className="premium-heading">Installment Plan</h3>

      <div className="glass-card installment-card">

        <div className="installment-item">
          <span>Available on Installments:</span>
          <span className={p.availableOnInstallments ? "badge-yes" : "badge-no"}>
            {p.availableOnInstallments ? "Yes" : "No"}
          </span>
        </div>

        {p.monthlyInstallment && (
          <div className="installment-item">
            <span>Monthly Installment:</span>
            <span className="installment-value">
              {p.currency} {Number(p.monthlyInstallment).toLocaleString()}
            </span>
          </div>
        )}

        {p.numberOfInstallments && (
          <div className="installment-item">
            <span>No. of Installments:</span>
            <span className="installment-value">{p.numberOfInstallments}</span>
          </div>
        )}

        <div className="installment-item">
          <span>Ready for Possession:</span>
          <span className={p.readyForPossession ? "badge-yes" : "badge-no"}>
            {p.readyForPossession ? "Yes" : "No"}
          </span>
        </div>

      </div>
    </div>
  )}

  {/* Amenities */}
  {p.amenities?.length > 0 && (
    <div className="premium-section">
      <h3 className="premium-heading">Amenities</h3>
      <ul className="amenities-list glass-card p-3">
        {p.amenities.map((item, index) => (
          <li key={index}><i class="fas fa-check me-2"></i>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Videos */}
  {p.projectVideos?.length > 0 && (
    <div className="premium-section">
      <h3 className="premium-heading">Project Videos</h3>
      <div className="video-gallery">
        {p.projectVideos.map((video, index) => (
          <video key={index} width="300" height="200" controls className="video-card"></video>
        ))}
      </div>
    </div>
  )}

  {/* YouTube */}
  {p.youtubeLinks?.length > 0 && (
    <div className="premium-section">
      <h3 className="premium-heading">YouTube Videos</h3>
      <div className="video-gallery">
        {p.youtubeLinks.map((url, index) => {
          const embedUrl = url.replace("watch?v=", "embed/");
          return (
            <iframe
              key={index}
              width="300"
              height="200"
              src={embedUrl}
              className="video-card"
              allowFullScreen
            ></iframe>
          );
        })}
      </div>
    </div>
  )}

</div>

		</div>
	</div>
	</div>
							</div>
					
				)}
			</div>
	</>		)}
{showBookingForm && p && (
  <>
<div className='container'>
		<h5 className="modal-title mt-4">Booking Form</h5>
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
										const fd = new FormData();
										Object.entries(payload).forEach(([k,v])=> fd.append(k, v == null ? '' : String(v)));
										if (form.applicantCnicFront?.files?.[0]) fd.append('applicantCnicFront', form.applicantCnicFront.files[0]);
										if (form.applicantCnicBack?.files?.[0]) fd.append('applicantCnicBack', form.applicantCnicBack.files[0]);
                                        if (form.nomineeCnicFront?.files?.[0]) fd.append('nomineeCnicFront', form.nomineeCnicFront.files[0]);
										if (form.nomineeCnicBack?.files?.[0]) fd.append('nomineeCnicBack', form.nomineeCnicBack.files[0]);
                                        if (form.applicantPhoto?.files?.[0]) fd.append('applicantPhoto', form.applicantPhoto.files[0]);
										const response = await fetch(`${API_BASE_URL}/admin/bookings/create-with-cnic`, { method: 'POST', body: fd });
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
										<h6 className="booking-form-title mt-3 mb-3">
											<i className="fas fa-user me-2"></i>APPLICANT INFORMATION
										</h6>
										<div className="row">
											<div className='d-flex align-items-center flex-lg-row flex-column'>
											<div className="col-lg-4 col-md-6 col-12">
												<label className="form-label">Type of Applicant</label>
<div className="d-flex gap-4">
  <div className="form-check custom-radio">
    <input
      className="form-check-input"
      type="radio"
      name="applicantType"
      value="LOCAL"
      id="local"
    />
    <label className="form-check-label" htmlFor="local">
      LOCAL
    </label>
  </div>

  <div className="form-check custom-radio">
    <input
      className="form-check-input"
      type="radio"
      name="applicantType"
      value="OVERSEAS"
      id="overseas"
    />
    <label className="form-check-label" htmlFor="overseas">
      OVERSEAS
    </label>
  </div>
</div>

											</div>
											<div className="col-lg-4 col-md-6 col-12">
												<label className="form-label">Gender</label>
												<div className="d-flex gap-3">
													<div className="form-check custom-radio">
														<input className="form-check-input" type="radio" name="gender" value="MALE" id="male" />
														<label className="form-check-label" htmlFor="male">MALE</label>
													</div>
													<div className="form-check custom-radio">
														<input className="form-check-input" type="radio" name="gender" value="FEMALE" id="female" />
														<label className="form-check-label" htmlFor="female">FEMALE</label>
													</div>
												</div>
											</div>
											<div className='col-lg-4 col-md-6 col-12'>
																								  {applicantPhoto && (
  <div className="mt-2">
    <img
      src={applicantPhoto}
      alt="Applicant Preview"
      className="img-thumbnail"
    />
  </div>
)}
											</div>
											</div>
											<div className="col-md-6 mt-3">
												<div className='form-group'>
												<label className="form-label">Full Name</label>
												<input name="fullName" className="form-control projects-input-custom" required />
											</div>
											</div>
																						<div className="col-md-6 mt-3">
  <div className='form-group'>
  <label className="form-label">Applicant Photo</label>
  <input
    type="file"
    name="applicantPhoto"
    accept="image/jpeg,image/jpg,image/png"
    className="form-control projects-input-custom"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setApplicantPhoto(URL.createObjectURL(file));
      }
    }}
  />
</div>
</div>
<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Reference ID</label>
												<input name="referenceId" className="form-control projects-input-custom" placeholder="Enter reference ID" />
											</div>
											</div>
											<div className="col-md-6">
													<div className='form-group'>
												<label className="form-label">S/O, D/O, W/O</label>
												<input name="fatherName" className="form-control projects-input-custom" placeholder="Father/Husband name" />
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">CNIC No</label>
												<input name="cnic" className="form-control projects-input-custom" placeholder="12345-1234567-1" />
											</div>
											</div>
																						<div className="col-md-6">
																							<div className='form-group'>
												<label className="form-label">Date of Birth</label>
												<input type="date" name="dateOfBirth" className="form-control projects-input-custom" />
												</div>
											</div>
<div className="col-md-6">
  <div className="form-group">
    <label className="form-label">Applicant CNIC Front</label>
    <input
      type="file"
      name="applicantCnicFront"
      accept="image/jpeg,image/jpg,image/png"
      className="form-control projects-input-custom"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) setCnicFrontPreview(URL.createObjectURL(file));
      }}
    />
  </div>

  {/* ✅ Preview */}
  {cnicFrontPreview && (
    <img
      src={cnicFrontPreview}
      alt="CNIC Front Preview"
      className="img-thumbnail mt-2"
      style={{ height: "120px", width: "200px", objectFit: "cover" }}
    />
  )}
</div>

<div className="col-md-6">
  <div className="form-group">
    <label className="form-label">Applicant CNIC Back</label>
    <input
      type="file"
      name="applicantCnicBack"
      accept="image/jpeg,image/jpg,image/png"
      className="form-control projects-input-custom"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) setCnicBackPreview(URL.createObjectURL(file));
      }}
    />
  </div>

  {/* ✅ Preview */}
  {cnicBackPreview && (
    <img
      src={cnicBackPreview}
      alt="CNIC Back Preview"
      className="img-thumbnail mt-2"
      style={{ height: "120px", width: "200px", objectFit: "cover" }}
    />
  )}
</div>

                                            <div className="col-md-6">
										  <div className='form-group'>
      <label className="form-label">Primary Phone</label>
      <PhoneInput
        name="phone"
        international
        defaultCountry="PK"
        value={phoneNumber}
        onChange={(value) => {
          setPhoneNumber(value);
        }}
        className={`form-control projects-input-custom projects-input-custom1 ${!isPhoneValid ? 'is-invalid' : ''}`}
        required
      />
      {!isPhoneValid && <div className="invalid-feedback">Please enter a valid phone number.</div>}
    </div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												 <div className='form-group'>
        <label className="form-label">Secondary Phone</label>
        <PhoneInput
          name="secondaryPhone"
          international
          defaultCountry="PK"
          value={secondaryPhone}
          onChange={(value) => {
            setSecondaryPhone(value);
			            setIsSecondaryValid(isValidPhoneNumber(value));
          }}
          className={`form-control projects-input-custom projects-input-custom1 ${!isSecondaryValid ? 'is-invalid' : ''}`}
        />
        {!isSecondaryValid && <div className="invalid-feedback">Please enter a valid phone number.</div>}
      </div>
												</div>
											</div>
										 <div className="col-md-6">
      <div className='form-group'>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
		  placeholder='Enter Your Email Address'
          className={`form-control projects-input-custom ${!isEmailValid ? 'is-invalid' : ''}`}
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            setIsEmailValid(validateEmail(val));
          }}
          required
        />
        {!isEmailValid && <div className="invalid-feedback">Please enter a valid email address.</div>}
      </div>
    </div>
												<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Occupation</label>
												<input name="occupation" className="form-control projects-input-custom" placeholder="Enter occupation" />
											</div>
											</div>
											<div className="col-12">
												<div className='form-group'>
												<label className="form-label">Address</label>
												<textarea name="address" className="form-control projects-input-custom" rows="2" placeholder="Enter complete address"></textarea>
											</div>
											</div>
									
										</div>
									</div>

									{/* NOMINEE/JOINT APPLICATION SECTION */}
									<div className="mb-4">
										<h6 className="booking-form-title mb-3">
											<i className="fas fa-users me-2"></i>NOMINEE / JOINT APPLICATION INFORMATION
										</h6>
										<div className="row">
											<div className="col-md-6">
												<label className="form-label">Type of Nominee/Joint Applicant</label>
												<div className="d-flex gap-3">
													  <div className="form-check custom-radio">
    <input
      className="form-check-input"
      type="radio"
      name="nomineeType"
      value="LOCAL"
     id="nomineeLocal"
    />
    <label className="form-check-label" htmlFor="nomineeLocal">
      LOCAL
    </label>
  </div>
  													  <div className="form-check custom-radio">
    <input
      className="form-check-input"
      type="radio"
      name="nomineeType"
      value="OVERSEAS"
     id="nomineeOverseas"
    />
    <label className="form-check-label" htmlFor="nomineeOverseas">
      OVERSEAS
    </label>
  </div>

												</div>
											</div>
											<div className="col-md-6">
												<label className="form-label">Gender</label>
												<div className="d-flex gap-3">
													<div className="form-check custom-radio">
														<input className="form-check-input" type="radio" name="nomineeGender" value="MALE" id="nomineeMale" />
														<label className="form-check-label" htmlFor="nomineeMale">MALE</label>
													</div>
													<div className="form-check custom-radio">
														<input className="form-check-input" type="radio" name="nomineeGender" value="FEMALE" id="nomineeFemale" />
														<label className="form-check-label" htmlFor="nomineeFemale">FEMALE</label>
													</div>
												</div>
											</div>
											<div className="col-md-6 mt-3">
												<div className='form-group'>
												<label className="form-label">Full Name</label>
												<input name="nomineeFullName" className="form-control projects-input-custom" placeholder="Nominee full name" />
											</div>
											</div>
											<div className="col-md-6 mt-3">
												<div className='form-group'>
												<label className="form-label">S/O, D/O, W/O</label>
												<input name="nomineeFatherName" className="form-control projects-input-custom" placeholder="Father/Husband name" />
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">CNIC No</label>
												<input name="nomineeCnic" placeholder='12333-21312323-2' className="form-control projects-input-custom" />
										</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Date of Birth</label>
												<input type="date" name="nomineeDateOfBirth" className="form-control projects-input-custom" />
											</div>
											</div>
 <div className="col-md-6">
        <div className='form-group'>
          <label className="form-label">Nominee CNIC Front</label>
          <input
            type="file"
            name="nomineeCnicFront"
            accept="image/jpeg,image/jpg,image/png"
            className="form-control projects-input-custom"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setNomineeCnicFrontPreview(URL.createObjectURL(file));
            }}
          />
        </div>
        {/* Preview */}
        {nomineeCnicFrontPreview && (
          <img
            src={nomineeCnicFrontPreview}
            alt="Nominee CNIC Front Preview"
            className="img-thumbnail mt-2"
            style={{ height: "120px", width: "200px", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="col-md-6">
        <div className='form-group'>
          <label className="form-label">Nominee CNIC Back</label>
          <input
            type="file"
            name="nomineeCnicBack"
            accept="image/jpeg,image/jpg,image/png"
            className="form-control projects-input-custom"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setNomineeCnicBackPreview(URL.createObjectURL(file));
            }}
          />
        </div>
        {/* Preview */}
        {nomineeCnicBackPreview && (
          <img
            src={nomineeCnicBackPreview}
            alt="Nominee CNIC Back Preview"
            className="img-thumbnail mt-2"
            style={{ height: "120px", width: "200px", objectFit: "cover" }}
          />
        )}
      </div>
											    <div className="col-md-6">
        <div className='form-group'>
          <label className="form-label">Primary Phone</label>
          <PhoneInput
            name="nomineePrimaryPhone"
            international
            defaultCountry="PK"
            value={nomineePrimary}
            onChange={(value) => {
              setNomineePrimary(value);
              setIsNomineePrimaryValid(isValidPhoneNumber(value));
            }}
            className={`form-control projects-input-custom projects-input-custom1 ${!isNomineePrimaryValid ? 'is-invalid' : ''}`}
            required
          />
          {!isNomineePrimaryValid && <div className="invalid-feedback">Please enter a valid phone number.</div>}
        </div>
      </div>

      <div className="col-md-6">
        <div className='form-group'>
          <label className="form-label">Secondary Phone</label>
          <PhoneInput
            name="nomineeSecondaryPhone"
            international
            defaultCountry="PK"
            value={nomineeSecondary}
            onChange={(value) => {
              setNomineeSecondary(value);
              setIsNomineeSecondaryValid(isValidPhoneNumber(value));
            }}
            className={`form-control projects-input-custom projects-input-custom1 ${!isNomineeSecondaryValid ? 'is-invalid' : ''}`}
          />
          {!isNomineeSecondaryValid && <div className="invalid-feedback">Please enter a valid phone number.</div>}
        </div>
      </div>
											<div className="col-12">
												<div className='form-group'>
												<label className="form-label">Address</label>
												<textarea name="nomineeAddress" className="form-control projects-input-custom" rows="2" placeholder="Enter complete address"></textarea>
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Relationship with Applicant</label>
												<input name="nomineeRelationship" className="form-control projects-input-custom" placeholder="e.g., Father, Mother, Spouse" />
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Occupation</label>
												<input name="nomineeOccupation" className="form-control projects-input-custom" placeholder="Enter occupation" />
											</div>
											</div>
										</div>
									</div>

									{/* PROJECT INFORMATION SECTION */}
									<div className="mb-4">
										<h6 className="booking-form-title mb-3">
											<i className="fas fa-building me-2"></i>PROJECT INFORMATION
										</h6>
										<div className="row g-3">
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Project</label>
												<input className="form-control projects-input-custom" value={p.title} readOnly />
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">City</label>
												<input className="form-control projects-input-custom" value={p.city} readOnly />
											</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Location</label>
												<input className="form-control projects-input-custom" value={p.location} readOnly />
										</div>
											</div>
											<div className="col-md-6">
												<div className='form-group'>
												<label className="form-label">Price</label>
												<input className="form-control projects-input-custom" value={`${p.currency} ${Number(p.price).toLocaleString()}`} readOnly />
											</div>
											</div>
											<div className="col-12">
												<div className='form-group'>
												<label className="form-label">Message</label>
												<textarea name="message" className="form-control projects-input-custom" rows="3" placeholder="Any notes or additional information"></textarea>
											</div>
											</div>
										</div>
									</div>

									<div className="mt-3 d-flex justify-content-end">
										<button type="submit" className="btn-custom">Submit Booking</button>
									</div>
								</form>
</div>
					
								  </>
)}
			<Footer/>
		</div>
	);
}
