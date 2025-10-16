import React, { useState } from 'react';
import '../css/homepage.css'
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay} from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { showToast } from '../toast';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");
  const [city, setCity] = useState('Lahore');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [beds, setBeds] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');

  const tabsData = {
    "1": {
      title: "Initial Consultation",
      description: "We'll spend our first meeting getting to know you and your project...",
      image: "assets/consulting-1.webp",
    },
    "2": {
      title: "Project Planning",
      description: "Proper planning helps us move the project along swiftly...",
      image: "assets/-house-plans.jpeg",
    },
    "3": {
      title: "Working on the Construction Project",
      description: "We begin implementing the project and keep you updated...",
      image: "assets/new-house-construction-building-site_293060-2814.avif",
    },
    "4": {
      title: "Presenting the Final Result",
      description: "We present the finished project and ensure your satisfaction...",
      image: "assets/final-result.jpg",
    },
  };
  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate('/contact');
  };
  const handleInstallments = () =>{
    window.scrollTo(0, 0);
    navigate('/currentProject')
  }
  const handleCommercial = () =>{
    window.scrollTo(0, 0);
    navigate('/deyaar-1')
  }
  const readMore = () =>{
    window.scrollTo(0, 0);
    navigate('/blog')
  }
  return (
    <div>
    <NavBar/>
    <div className="banner-three" >
						<div className="container">
							<div className="row align-items-center banner-inner" >
								<div className="col-md-6">
									<div className="content-blog">
										<div className="banner-content">
											<h1 className=" title  m-b20">FIND YOUR DREAM <br/> PROPERTY WITH <br/>HOMEON</h1>
											<button  onClick={handleClick} className="btn-custom d-flex justify-content-center">Book A Site Visit</button>
										</div>
									</div>	
								</div>
								<div className="col-md-6">
									<div className="zameen-filter-container">
										<div className="zameen-filter-header">
											<h3>Find Your Property</h3>
											<p>Search from thousands of properties</p>
										</div>
										
										<div className="zameen-filter-main">
											{/* First Row - City and Location */}
											<div className="zameen-filter-row">
												<div className="zameen-filter-field">
													<label className="zameen-field-label">City</label>
													<select 
														className="zameen-select" 
														value={city} 
														onChange={(e)=>setCity(e.target.value)}
													>
														<option value="Lahore">Lahore</option>
														<option value="Karachi">Karachi</option>
														<option value="Islamabad">Islamabad</option>
														<option value="Rawalpindi">Rawalpindi</option>
													</select>
												</div>
												<div className="zameen-filter-field">
													<label className="zameen-field-label">Location</label>
													<input 
														type="text" 
														className="zameen-input" 
														value={location} 
														onChange={(e)=>setLocation(e.target.value)} 
														placeholder="Enter location" 
													/>
												</div>
											</div>
											
											{/* Second Row - Property Type and Beds */}
											<div className="zameen-filter-row">
												<div className="zameen-filter-field">
													<label className="zameen-field-label">Property Type</label>
													<select 
														className="zameen-select" 
														value={propertyType} 
														onChange={(e)=>setPropertyType(e.target.value)}
													>
														<option value="">All Types</option>
														<option value="home">Homes</option>
														<option value="plots">Plots</option>
														<option value="commercial">Commercial</option>
													</select>
												</div>
												<div className="zameen-filter-field">
													<label className="zameen-field-label">Bedrooms</label>
													<select 
														className="zameen-select" 
														value={beds} 
														onChange={(e)=>setBeds(e.target.value)}
													>
														<option value="All">All</option>
														<option value="Studio">Studio</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
														<option value="6">6</option>
														<option value="7">7</option>
														<option value="8">8</option>
														<option value="9">9</option>
														<option value="10">10</option>
														<option value="10+">10+</option>
													</select>
												</div>
											</div>
											
											{/* Third Row - Price Range */}
											<div className="zameen-filter-row">
												<div className="zameen-filter-field">
													<label className="zameen-field-label">Price Range (PKR)</label>
													<div className="zameen-range-inputs">
														<input 
															type="number" 
															className="zameen-range-input" 
															placeholder="Min Price" 
															value={minPrice} 
															onChange={(e)=>setMinPrice(e.target.value)} 
														/>
														<span className="zameen-range-separator">to</span>
														<input 
															type="number" 
															className="zameen-range-input" 
															placeholder="Max Price" 
															value={maxPrice} 
															onChange={(e)=>setMaxPrice(e.target.value)} 
														/>
													</div>
												</div>
											</div>
											
											{/* Fourth Row - Area Range */}
											<div className="zameen-filter-row">
												<div className="zameen-filter-field">
													<label className="zameen-field-label">Area Range (Marla)</label>
													<div className="zameen-range-inputs">
														<input 
															type="number" 
															className="zameen-range-input" 
															placeholder="Min Area" 
															value={minArea} 
															onChange={(e)=>setMinArea(e.target.value)} 
														/>
														<span className="zameen-range-separator">to</span>
														<input 
															type="number" 
															className="zameen-range-input" 
															placeholder="Max Area" 
															value={maxArea} 
															onChange={(e)=>setMaxArea(e.target.value)} 
														/>
													</div>
												</div>
											</div>
											
											{/* Find Button */}
											<div className="zameen-filter-actions">
												<button 
													type="button" 
													onClick={async ()=>{
														const payload = {
															city: city || undefined,
															location: location || undefined,
															propertyType: propertyType || undefined,
															bedrooms: beds !== 'All' ? beds : undefined,
															minPrice: minPrice ? Number(minPrice) : undefined,
															maxPrice: maxPrice ? Number(maxPrice) : undefined,
															minArea: minArea ? Number(minArea) : undefined,
															maxArea: maxArea ? Number(maxArea) : undefined,
														};
														
														// Remove undefined values from payload
														Object.keys(payload).forEach(key => {
															if (payload[key] === undefined) {
																delete payload[key];
															}
														});
														
														const base = process.env.REACT_APP_API_URL || 'http://172.23.128.1:3002';
														try {
															const res = await fetch(`${base}/admin/projects/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
															const data = await res.json();
															if (Array.isArray(data) && data.length > 0) {
																const query = new URLSearchParams({
																	city: city || '',
																	location: location || '',
																	propertyType: propertyType || '',
																	bedrooms: beds || '',
															minPrice: String(minPrice || ''),
															maxPrice: String(maxPrice || ''),
															minArea: String(minArea || ''),
															maxArea: String(maxArea || ''),
																}).toString();
																navigate(`/portfolio?${query}`);
															} else {
																showToast('No matching project found', 'info');
															}
														} catch (e) { showToast('Search failed', 'error'); }
													}} 
													className="zameen-find-btn"
												>
													<i className="fas fa-search me-2"></i>
													Find Properties
												</button>
											</div>
											
											{/* Additional Options */}
											<div className="zameen-filter-options">
												<button 
													className="zameen-option-btn" 
													onClick={() => {
														setCity('Lahore');
														setLocation('');
														setPropertyType('');
														setBeds('All');
														setMinPrice('');
														setMaxPrice('');
														setMinArea('');
														setMaxArea('');
														showToast('Search filters reset', 'info');
													}}
												>
													Reset Search
												</button>
												<button 
													className="zameen-option-btn"
													onClick={() => showToast('Currency: PKR (Pakistani Rupees)', 'info')}
												>
													Currency: PKR
												</button>
												<button 
													className="zameen-option-btn"
													onClick={() => showToast('Area Unit: Marla', 'info')}
												>
													Area: Marla
												</button>
											</div>
										</div>
									</div>
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
   <section className="container py-5">
   <div className="text-container">
  <h2 className="heading">
    Welcome to <span className="highlight">HomeOn</span> –
    Your Real Estate Partner in Pakistan and Beyond
  </h2>
  <p className="intro">
    At <span className="highlight">HomeOn</span>, we simplify real estate for 
    <span className="emphasis"> Pakistani nationals</span>, both at home and abroad.
  </p>
  <ul className="features">
    <li>Invest in <span className="highlight">residential</span> or <span className="highlight">commercial</span> properties.</li>
    <li>Receive <span className="emphasis">personalized assistance</span> for informed decisions.</li>
    <li>Market and sell across <strong>Lahore, Karachi, Islamabad, and Multan</strong>.</li>
    <li>Enjoy <span className="highlight">flexible installment plans</span>.</li>
  </ul>
</div>
<div className='container mt-5 mb-3'>
<div className="row row-50 align-items-center justify-content-center justify-content-xl-between">
      <div className="col-md-6 col-12 wow fadeInLeft">
        <h3>How We Work</h3>
        <div className="tabs-custom tabs-horizontal tabs-line tabs-line-big text-center text-md-left" id="tabs-6">
        <ul className="nav nav-tabs construction-ul">
  {Object.keys(tabsData).map((key) => (
    <li className="nav-item home_page_1" role="presentation" key={key}>
      <a
        className={`nav-link nav-link-big ${activeTab === key ? "active" : ""}`}
        onClick={() => setActiveTab(key)}
      >
        {key.padStart(2, "0")}
      </a>
    </li>
  ))}
</ul>

          <div className="tab-content mt-4 text-start">
            <div className="tab-pane tab-home-cstm fade active show">
              <h5 className="font-weight-normal">{tabsData[activeTab].title}</h5>
              <p>{tabsData[activeTab].description}</p>
              <div className="group-md group-middle">
                <button className="btn-custom" onClick={() => alert("Get in touch clicked!")}>
                  Get in touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-12 mt-md-0 mt-3 text-center wow fadeInUp" data-wow-delay=".1s">
        <div className="figure-classic figure-classic-pattern figure-classic-right">
          <img src={tabsData[activeTab].image} alt={tabsData[activeTab].title} className="img-fluid" />
        </div>
      </div>
    </div>

     </div>
      <div className="mb-4">
      <div className="specification-heading mt-lg-0 mt-5" data-content="FEATURED PROJECTS">
  Featured Projects
</div>
        <div className="row g-4 mt-2 d-flex justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card homepage-card" onClick={handleInstallments}>
              <img src='assets/Elevation1.webp' className="card-img-top" alt="5 Marla Duplex Villas" />
              <div className="card-body">
                <h5 className="card-title">5 Marla Duplex Villas</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card homepage-card" onClick={handleCommercial}>
              <img src='assets/abs-pearl-one-tower-overview.webp' className="Commercial Building" alt="Premium Commercial Plazas" />
              <div className="card-body">
                <h5 className="card-title">Premium Commercial Plazas</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card homepage-card">
              <img src='assets/2-Bed_Apartments-tower.webp' className="City Appartments" alt="Luxurious Apartments" />
              <div className="card-body">
                <h5 className="card-title">Luxurious Apartments</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
    <div className="container-fluid pg2-section4-bg">
<div className="row">
  <div className="col-12">
    <h2 className="pg2-s1-heading text-center text-white s4-h-pg2 mt-5">Why Choose HomeOn?</h2>
  <div class="timeline mt-5">
  <div class="container1 left">
    <div className='icon'>01</div>
    <div class="content">
      <div className="timeline2-bg">
      <h5 className="timeline2-heading2">Firsthand Insight for Overseas Pakistanis</h5>
      <div className="">
<p className='mb-0'>Our offices in the UK, UAE, Canada, and the US provide direct assistance for those wanting to invest in Pakistani real estate.</p>
      </div>
      </div>
    </div>
  </div>
  <div class="container1 right">
  <div className='icon'>02</div>
    <div class="content">
    <div className="timeline2-bg">
      <h5 className="timeline2-heading2">Property Management Services</h5>
      <div>
        <p className='mb-0'>Managing your properties remotely can be challenging. HomeOn ensures that your assets are well-maintained and profitable.</p>
      </div>
      </div>
    </div>
  </div>
  <div class="container1 left ">
  <div className='icon'>03</div>
    <div class="content">
    <div className="timeline2-bg">
      <h5 className="timeline2-heading2">Turnkey Construction Solutions</h5>
      <div>
        <p className='mb-0'>From design to handover, we manage your residential or commercial construction projects with efficiency and transparency.</p>
      </div>
      </div>
    </div>
  </div>
</div>
<div className="timeline3 mt-5">
  <div className="row d-flex justify-content-center">
    <div className="col-md-8 col-12">
      <div className="d-flex justify-content-center">
      <div className="meta-date2 d-flex justify-content-center align-items-center">
          <span className="date">01</span>
        </div>
        </div>
    <div className="timeline2-bg mt-5">
    <h5 className="timeline2-heading2">Firsthand Insight for Overseas Pakistanis</h5>
      <div className="">
<p className='mb-0'>Our offices in the UK, UAE, Canada, and the US provide direct assistance for those wanting to invest in Pakistani real estate.</p>
      </div>
      </div>
    </div>
  </div>
  <div className="row d-flex justify-content-center mt-5">
    <div className="col-md-8 col-12 ">
      <div className="d-flex justify-content-center">
      <div className="meta-date2 d-flex justify-content-center align-items-center">
          <span className="date">02</span>
        </div>
        </div>
        <div className="timeline2-bg mt-5">
        <h5 className="timeline2-heading2">Property Management Services</h5>
      <div>
        <p className='mb-0'>Managing your properties remotely can be challenging. HomeOn ensures that your assets are well-maintained and profitable.</p>
      </div>
      </div>
    </div>
  </div>
  <div className="row d-flex justify-content-center mt-5">
    <div className="col-md-8 col-12">
      <div className="d-flex justify-content-center">
      <div className="meta-date2 d-flex justify-content-center align-items-center">
          <span className="date">03</span>
        </div>
        </div>
        <div className="timeline2-bg mt-5 mb-5">
        <h5 className="timeline2-heading2">Turnkey Construction Solutions</h5>
      <div>
        <p className='mb-0'>From design to handover, we manage your residential or commercial construction projects with efficiency and transparency.</p>
      </div>
      </div>
    </div>
  </div>
</div>
  </div>
</div>
</div>
	 <div className='container mt-3'>			
	 <div  className="specification-heading  mt-lg-0 mt-5" data-content="ABOUT US">
   ABOUT US
   </div>
	 </div>
	 <div className='container-fluid px-0 about-pg1'>
	 					<section className="content-inner about-box d-lg-block d-none" data-content="ABOUT US" id="sidenav_aboutUs">	
						<div className="about-bg"></div>
						<div className="container">
							<div className="row">
								<div className="col-md-7 col-lg-6 z-index-5">
									<div className="section-head">
										<div className="title-about_us">
										<h2>Who We Are</h2>
										</div>
										<div className="dlab-separator mt-3" ></div>
										<h4 className="mb-3" >SEE WHY OUR RESIDENTS CALL OUR COMMUNITY HOME.</h4>
										<p >
                    HomeOn is a full-service real estate company that caters to the needs of Pakistani nationals— whether they’re looking to invest from within Pakistan or overseas. With years of experience in real estate consultancy, property management, and turnkey construction services, we have positioned ourselves as a one-stop solution for all your real estate needs.
										</p>
                    <p>Our mission is to bridge the gap between overseas and local investors through transparency, guidance, and complete solutions.</p>
									<p>Our vision is to make real estate investing accessible, simple, and secure for all.
                  </p>
                  </div>
									<button  className="btn-custom mt-3" >About Us</button>
								</div>
								<div className="col-md-5 col-lg-6"></div>
							</div>
						</div>
					</section>
          <div className="container d-lg-none d-block">
							<div className="row">
								<div className="col-12 col-lg-6 z-index-5">
									<div className="section-head">
										<div className="title-about_us">
										<h2>Projects Overview</h2>
										</div>
										<div className="dlab-separator mt-3" ></div>
										<h4 className="mb-3" >SEE WHY OUR RESIDENTS CALL OUR COMMUNITY HOME.</h4>
										<p >
											Surround yourself with fresh energy, high-tech amenities, and elevated style. Indulge in extraordinary amenities, relax in appealing social spaces, and cultivate your ideal life. We're the fresh look in this historic district - a vibrant new community for movers and shakers.
										</p>
										<p>
											A bold new life awaits you at HomeOn, a brand new community of apartment homes situated at the cutting edge of modern design. Residents of HomeOn enjoy luxury living with a sparkling swimming pool, fitness center and indoor game, parking garage and temple. Discover a HomeOn from our convenient location. Nothing quite complements a comfortable, stylish home like an array of luxury amenities.
										</p>
									</div>
									<button  className="btn-custom " >About Us</button>
								</div>
								<div className="col-12">
                  <img src='assets/about2.webp' alt='Homeon-Introduction' className='img-fluid'/>
                </div>
							</div>
						</div>
            <div className='custom-position-about-pg1 d-lg-none d-block'>
                    <img src='assets/about1.webp' alt='about-img' className='img-fluid'/>
                  </div>
	 </div>	
   <div className='container mt-3'>			
	 <div  className="specification-heading  mt-lg-0 mt-5" data-content="OUR SERVICES">
   OUR SERVICES
   </div>
	 </div>
   <div className='container-fluid mt-5'>
    <div className='row'>
      <div className="service-area">
        <div className='container'>
        <div className='row'>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home">
            <Link to="/consultancy"  className="service-link">
            <div class="media">
            <img src="assets/consulting.png" alt="Consulting" className='img-fluid'/>
          </div>
          <div class="info">
            <a >
          <h4 class="title"> Real Estate Consultancy</h4>
          </a>
          <p className='mb-0'>Personalized real estate consultancy for optimal property investments and returns.</p>
          </div>
          </Link>
          </div>
          </div>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home">
          <Link to="/projectSelling"  className="service-link">
            <div class="media">
            <img src="assets/user-generated-content.png" alt="Project Marketing" className='img-fluid'/>
          </div>
          <div class="info1">
            <a>
          <h4 class="title">Project Marketing & Selling</h4>
          </a>
          <p className='mb-0'>Marketing residential and commercial real estate with flexible installment plans.</p>
          </div>
          </Link>
          </div>
          </div>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home">
          <Link to="/propertyManagement"  className="service-link">
            <div class="media">
            <img src="assets/property.png" alt="Property Management" className='img-fluid'/>
          </div>
          <div class="info">
            <a>
          <h4 class="title">Property Management</h4>
          </a>
          <p className='mb-0'>HomeOn offers rental management, maintenance, and tenant screening in Pakistan.</p>
          </div>
          </Link>
          </div>
          </div>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home">
          <Link to="/turnKey"  className="service-link">
            <div class="media">
            <img src="assets/work-in-progress.png" alt="Turnkey Construction Services" className='img-fluid'/>
          </div>
          <div class="info1">
            <a >
          <h4 class="title">Turnkey Construction Services</h4>
          </a>
          <p className='mb-0'>
          HomeOn provides turnkey construction, from design to final handover.</p>
          </div>
          </Link>
          </div>
          </div>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home">
            <div class="media">
            <img src="assets/call.png" alt="Overseas Services" className='img-fluid'/>
          </div>
          <div class="info">
            <a>
          <h4 class="title"> Overseas Services</h4>
          </a>
          <p className='mb-0'>HomeOn supports overseas Pakistanis with direct insights for confident investments.</p>
          </div>
          </div>
          </div>
          <div className='col-lg-4 col-md-4 col-6 px-0'>
          <div class="service-box service-box-home" onClick={handleInstallments}>
            <div class="media">
            <img src="assets/smart-home.png" alt="Smart Home" className='img-fluid'/>
          </div>
          <div class="info1">
            <a>
          <h4 class="title">House on installlments </h4>
          </a>
          <p className='mb-0'>
          Affordable housing with flexible installment plans for easier home ownership.</p>
          </div>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
   </div>
   <div className='container mt-3'>			
	 <div  className="specification-heading  mt-lg-0 mt-5" data-content="NEWS & EVENT">
   NEWS & EVENT
   </div>
   <div className='row'>
                    <div className='col-md-6 col-12'>
                    <p className="specification-text">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form
										</p>
                    </div>
                    <div className='col-md-6 col-12 d-flex align-items-center justify-content-end'>
                    <button  className="btn-custom d-flex justify-content-center">View All Services</button>
                    </div>
                  </div>
                  <Swiper
  className="mt-4"
  modules={[Autoplay]} // Include Navigation and Autoplay modules
  spaceBetween={20}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  breakpoints={{
    // when window width is >= 640px
    640: {
      slidesPerView: 1, // 1 slide visible
      spaceBetween: 20,
    },
    // when window width is >= 768px
    768: {
      slidesPerView: 2, // 2 slides visible
      spaceBetween: 30,
    },
    // when window width is >= 1024px
    1024: {
      slidesPerView: 3, // 3 slides visible
      spaceBetween: 40,
    },
  }}
>
  <SwiperSlide>
    <div className="">
      <div className="dlab-card blog-grid">
        <div className="dlab-media">
          <img src="assets/news1.webp" alt="Property Investment" className="img-fluid" />
        </div>
        <div className="dlab-info">
          <div className="dlab-meta">
            <ul>
              <li className="post-date d-flex align-items-center">
                <i className="las la-calendar-alt"></i>
                <p className="mb-0">January 5, 2025</p>
              </li>
              <li className="post-user d-flex align-items-center">
                <i className="las la-user"></i>
                <p className="mb-0">By HomeOn Team</p>
              </li>
            </ul>
          </div>
          <h3 className="dlab-title">
            <a>Discover Prime Apartments for Investment in Islamabad</a>
          </h3>
          <p>Discover luxury apartments with investor-friendly installment plans.</p>
          <div className="dlab-readmore">
            <a className="readmore" onClick={readMore}>
              <i className="las la-plus"></i> Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>

  <SwiperSlide>
    <div className="">
      <div className="dlab-card blog-grid">
        <div className="dlab-media">
          <img src="assets/news2.webp" alt="Housing Projects" className="img-fluid" />
        </div>
        <div className="dlab-info">
          <div className="dlab-meta">
            <ul>
              <li className="post-date d-flex align-items-center">
                <i className="las la-calendar-alt"></i>
                <p className="mb-0">January 10, 2025</p>
              </li>
              <li className="post-user d-flex align-items-center">
                <i className="las la-user"></i>
                <p className="mb-0">By HomeOn Experts</p>
              </li>
            </ul>
          </div>
          <h3 className="dlab-title">
            <a>Upcoming Housing Projects in Karachi</a>
          </h3>
          <p>Explore affordable housing projects in Karachi offering secure and high-return investments.</p>
          <div className="dlab-readmore">
            <a className="readmore" onClick={readMore}>
              <i className="las la-plus"></i> Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>

  <SwiperSlide>
    <div className="">
      <div className="dlab-card blog-grid">
        <div className="dlab-media">
          <img src="assets/news3.webp" alt="Commercial Properties" className="img-fluid" />
        </div>
        <div className="dlab-info">
          <div className="dlab-meta">
            <ul>
              <li className="post-date d-flex align-items-center">
                <i className="las la-calendar-alt"></i>
                <p className="mb-0">January 15, 2025</p>
              </li>
              <li className="post-user d-flex align-items-center">
                <i className="las la-user"></i>
                <p className="mb-0">By HomeOn Insights</p>
              </li>
            </ul>
          </div>
          <h3 className="dlab-title">
            <a>Invest in Commercial Properties in Lahore</a>
          </h3>
          <p>Secure your future with high-demand commercial spaces in Lahore, offering excellent rental yields.</p>
          <div className="dlab-readmore">
            <a className="readmore" onClick={readMore}>
              <i className="las la-plus"></i> Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>
</Swiper>

                  </div>
<Footer/>
</div>
  );
};

export default HomePage;
