import React, { useState, useEffect } from 'react';
import '../css/contactUs.css';
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { NavLink, useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';

const ScheduleMeeting = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [fullName, setFullName] = useState('');
  const [meetingPurpose, setMeetingPurpose] = useState('sale');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  useEffect(() => {
    if (email) {
      setIsEmailValid(emailRegex.test(email));
    }
  }, [email]);
  
  useEffect(() => {
    if (phoneNumber) {
      setIsPhoneValid(isValidPhoneNumber(phoneNumber));
    }
  }, [phoneNumber]);

  toastr.options = {
    positionClass: "toast-top-right",
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPhoneValid || !isEmailValid || !fullName || !preferredTime) {
      toastr.error('Please fill all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        fullName,
        email,
        phone: phoneNumber,
        meetingPurpose,
        preferredTime,
        message: message || null,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://192.168.100.13:3002'}/admin/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Meeting scheduled:', data);
      
      toastr.success('Meeting request submitted successfully!');
      navigate('/thankYou');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toastr.error('Failed to submit meeting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className='contactUs-bg'>
        <NavBar />
        <div className="dlab-bnr-inr d-flex align-items-center">
          <div className="container">
            <div className="dlab-bnr-inr-entry text-md-start text-center">
              <h1>SCHEDULE A MEETING</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to={'/'}>
                      <i className="las fa-home me-2"></i>Home
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Schedule a Meeting</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className='whatsapp-position-custom'>
        <a href="https://wa.me/923255255255" className='whatsapp' target='_blank'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="70"
            height="70"
            viewBox="0 0 48 48"
            className="whatsapp-logo"
          >
            <path
              fill="#fff"
              d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"
            ></path>
            <path
              fill="#fff"
              d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"
            ></path>
            <path
              fill="#40c351"
              d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"
            ></path>
            <path
              fill="#40c351"
              d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"
            ></path>
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row d-flex align-items-center">
          <div className="col-lg-4 col-md-5 col-12">
            <div className="section-head m-b30">
              <h2 className="title">Schedule Your Meeting</h2>
              <div className="dlab-separator1"></div>
              <h6 className="title-small">BOOK YOUR APPOINTMENT</h6>
            </div>
            <div className="contact-question mt-4">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <h4 className="title">Address</h4>
                <p>2nd Floor 61 Nishter Commercial, Bahria Town, Lahore</p>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <h4 className="title">Email</h4>
                <p>salam@homeon.pk</p>
              </li>
              <li>
                <i className="fa fa-phone-alt"></i>
                <h4 className="title">Phone</h4>
                <p>0325-5255255</p>
              </li>
            </div>
          </div>

          <div className="col-lg-8 col-md-7 col-12 mt-md-0 mt-3">
            <form onSubmit={handleSubmit} className="contact-box dzForm p-a30 border-1">
              <h3 className="title-box">
                Fill out the form below to schedule a meeting with us
              </h3>
              <div className="row px-4 mb-4 mt-4">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    {!fullName && (
                      <div className="text-danger">Full Name is required</div>
                    )}
                    <div className="input-group">
                      <input
                        name="fullName"
                        type="text"
                        className={`form-control ${!fullName ? 'is-invalid' : ''}`}
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    {!isEmailValid && email && (
                      <div className="text-danger">Please enter a valid email address.</div>
                    )}
                    <div className="input-group">
                      <input
                        name="email"
                        type="email"
                        className={`form-control ${!isEmailValid ? 'is-invalid' : ''}`}
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    {!isPhoneValid && phoneNumber && (
                      <div className="text-danger">Please enter a valid phone number.</div>
                    )}
                    <div className="input-group">
                      <PhoneInput
                        name="phone"
                        international
                        defaultCountry="PK"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        className={`form-control ${!isPhoneValid ? 'is-invalid' : ''}`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    {!preferredTime && (
                      <div className="text-danger">Preferred time is required</div>
                    )}
                    <div className="input-group">
                      <input
                        name="preferredTime"
                        type="text"
                        className={`form-control ${!preferredTime ? 'is-invalid' : ''}`}
                        placeholder="Preferred Time (e.g., Monday 2 PM)"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <div className="input-group">
                      <label className="form-label mb-2">Meeting Purpose:</label>
                      <select
                        name="meetingPurpose"
                        className="form-control"
                        value={meetingPurpose}
                        onChange={(e) => setMeetingPurpose(e.target.value)}
                        required
                      >
                        <option value="sale">For Sale</option>
                        <option value="purchase">For Purchase</option>
                        <option value="advice">For Advice</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <div className="input-group">
                      <textarea
                        name="message"
                        rows="4"
                        className="form-control"
                        placeholder="Additional Message (Optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <button 
                    type="submit" 
                    className="btn-custom"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Schedule Meeting'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScheduleMeeting;

