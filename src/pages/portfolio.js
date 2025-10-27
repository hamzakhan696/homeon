import React, { useEffect, useState } from 'react';
import '../css/portfolio.css'
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiGet } from '../api';
import { getProjectThumb } from '../media';
import { showToast } from '../toast';
import { useLocation } from 'react-router-dom';
const Portfolio = () => {
    const scrollLeft = () => {
    const myTab = document.getElementById("myTab");
    myTab.scrollTo({
      left: myTab.scrollLeft - 100,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const myTab = document.getElementById("myTab");
    myTab.scrollTo({
      left: myTab.scrollLeft + 100,
      behavior: "smooth",
    });
  };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const locationHook = useLocation();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams(locationHook.search);
        const filters = Object.fromEntries(params.entries());
        const hasFilters = Array.from(params.keys()).length > 0 && Object.values(filters).some(v => v);
        if (hasFilters) {
          const base = process.env.REACT_APP_API_URL || 'http://192.168.10.30:3002';
          const res = await fetch(`${base}/admin/projects/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
            city: filters.city || undefined,
            location: filters.location || undefined,
            propertyType: filters.propertyType || undefined,
            bedrooms: filters.bedrooms || undefined,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            minArea: filters.minArea ? Number(filters.minArea) : undefined,
            maxArea: filters.maxArea ? Number(filters.maxArea) : undefined,
          })});
          const data = await res.json();
          if (mounted) setItems(Array.isArray(data) ? data : []);
        } else {
          const d = await apiGet('/projects');
          if (mounted) setItems(Array.isArray(d) ? d : []);
        }
      } catch (e) {
        if (mounted) setErr('Failed to load');
        showToast('Failed to load projects','error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [locationHook.search]);

  return (
    <div className='overflow-hidden'>
        <div className='contactUs-bg'>
    <NavBar/>
    <div className="dlab-bnr-inr d-flex align-items-center">
        <div className="container">
        <div className="dlab-bnr-inr-entry text-md-start text-center">
        <h1>PORTFOLIO</h1>
    <nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
        <ul className="breadcrumb">
        <li className="breadcrumb-item"><NavLink to={'/home'}><i className="las fa-home me-2"></i>Home</NavLink></li>
        <li className="breadcrumb-item active" aria-current="page">Portfolio</li>
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
     <div className='container mt-5'>
     <h2 class="title m-b10 text-center">OUR BEST PROJECTS</h2>
     </div>
           <div className="container-fluid p-0 mt-4 portfolio">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 p-0">
            <div className="bg-white">
              <div className="container portfolio-main">
                <div className='row d-flex justify-content-center'>
                  <div className='col-lg-8 col-12'>
                  <div className="scroll-buttons d-lg-none d-flex align-items-center">
                  <img
                    onClick={scrollRight}
                    className="ms-1 me-1 pe-2  mt-5 pt-2 frame-2-portfolio"
                    src="assets/Frameright.svg"
                    alt=""
                  />
                  <img
                    className="ms-2 me-1 mt-4 frame-3-position"
                    onClick={scrollLeft}
                    src="assets/Frameleft.svg"
                    alt=""
                  />
                </div>
                <ul
                  className="nav nav-tabs custom-nav-tabs nav-fill custom-nav-fill ms-lg-0 ms-4 me-lg-0 me-4"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item custom-nav-item" role="presentation">
                    <button
                      className="nav-link custom-nav-link active"
                      id="faq_tab_1-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#faq_tab_1"
                      type="button"
                      role="tab"
                      aria-controls="faq_tab_1"
                      aria-selected="true"
                    >
                      <div className="d-flex flex-column lh-lgg portfolio-tabs">
                        <span>All</span>
                      </div>
                    </button>
                  </li>
                  <li className="nav-item custom-nav-item" role="presentation">
                    <button
                      className="nav-link custom-nav-link"
                      id="faq_tab_2-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#faq_tab_2"
                      type="button"
                      role="tab"
                      aria-controls="faq_tab_2"
                      aria-selected="false"
                    >
                      <div className="d-flex flex-column lh-lgg portfolio-tabs">
                        <span>ABSTRACT</span>
                      </div>
                    </button>
                  </li>
                  <li className="nav-item custom-nav-item" role="presentation">
                    <button
                      className="nav-link custom-nav-link"
                      id="faq_tab_3-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#faq_tab_3"
                      type="button"
                      role="tab"
                      aria-controls="faq_tab_3"
                      aria-selected="false"
                    >
                      <div className="d-flex flex-column lh-lgg portfolio-tabs">
                        <span>FOOD</span>
                      </div>
                    </button>
                  </li>
                  <li className="nav-item custom-nav-item" role="presentation">
                    <button
                      className="nav-link custom-nav-link"
                      id="faq_tab_4-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#faq_tab_4"
                      type="button"
                      role="tab"
                      aria-controls="faq_tab_4"
                      aria-selected="false"
                    >
                      <div className="d-flex flex-column lh-lgg portfolio-tabs">
                        <span>MOCKUP</span>
                      </div>
                    </button>
                  </li>
                  <li className="nav-item custom-nav-item" role="presentation">
                    <button
                      className="nav-link custom-nav-link"
                      id="faq_tab_5-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#faq_tab_5"
                      type="button"
                      role="tab"
                      aria-controls="faq_tab_5"
                      aria-selected="false"
                    >
                      <div className="d-flex flex-column lh-lgg portfolio-tabs">
                        <span>TECHNOLOGY</span>
                      </div>
                    </button>
                  </li>
                </ul>
                  </div>
                </div>
              </div>
              <div
                className="tab-content container-fluid p-0"
                id="myTabContent"
              >
                <div
                  className="tab-pane fade active show px-3 px-lg-0"
                  id="faq_tab_1"
                  role="tabpanel"
                  aria-labelledby="faq_tab_1-tab"
                >
                 <div className="clearfix">
        <div className='row mt-5 mb-5'>
          {loading && <p style={{ textAlign:'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>}
          {!loading && err && <p className='text-danger' style={{ textAlign:'center' }}>{err}</p>}
          {!loading && !err && items.map((p) => (
            <div key={p.id} className='col-lg-3 col-md-4 col-6 p-0'>
              <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1" onClick={() => navigate(`/project/${p.id}`)} style={{ cursor:'pointer' }}>
                <img src={getProjectThumb(p) || 'assets/image-coming-soon-placeholder.png'} alt={p.title} className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</span>
                    <h3 className="port-title mt-2">{p.title}</h3>
                    <button className="btn-custom portfolio-btn mt-2">View Project</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && !err && items.length === 0 && (
            <p style={{ textAlign:'center' }}>No projects yet.</p>
          )}
        </div>
    </div>
                </div>
                <div
                  className="tab-pane fade px-3 px-lg-0"
                  id="faq_tab_2"
                  role="tabpanel"
                  aria-labelledby="faq_tab_2-tab"
                >
<div className='row mt-5 mb-5'>
<div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio10.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio11.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio12.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio7.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
</div>
                </div>
                <div
                  className="tab-pane fade px-3 px-lg-0"
                  id="faq_tab_3"
                  role="tabpanel"
                  aria-labelledby="faq_tab_3-tab"
                >
  <div className='row mt-5 mb-5'>
<div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio10.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio11.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio12.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio7.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
</div>
                </div>
                <div
                  className="tab-pane fade px-3 px-lg-0"
                  id="faq_tab_4"
                  role="tabpanel"
                  aria-labelledby="faq_tab_4-tab"
                >
<div className='row mt-5 mb-5'>
<div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio10.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio11.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio12.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio7.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
</div>
                </div>
                <div
                  className="tab-pane fade px-3 px-lg-0"
                  id="faq_tab_5"
                  role="tabpanel"
                  aria-labelledby="faq_tab_5-tab"
                >
<div className='row mt-5 mb-5'>
<div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio10.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio11.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio12.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6 p-0'>
          <div className="dlab-media dlab-img-overlay1 dlab-img-effect portbox1">
                <img src='assets/portfolio7.jpg' alt="portfolio" className='img-fluid' />
                <div className="overlay-bx">
                  <div className="portinner">
                    <span>July 3, 2016 in Travelling</span>
                    <h3 className="port-title mt-2">
                      Design is where science
                    </h3>
                    <button className="btn-custom portfolio-btn mt-2">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
          </div>
</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
<Footer/>
</div>
  );
};

export default Portfolio;
