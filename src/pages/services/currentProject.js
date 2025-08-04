import React, { useEffect, useState,useRef } from 'react';
import '../../css/currentProject.css'
import NavBar from '../../layout/header';
import Footer from '../../layout/footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay} from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const CurrentProject = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(1);
    const handleButtonClick = (buttonIndex) => {
      setActiveButton(buttonIndex);
    };
  const [activeTab, setActiveTab] = useState('1');
  const scrollRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [activeTab1, setActiveTab1] = useState("1");
  const getImageForActiveTab = () => {
    switch (activeTab) {
      case '1':
        return { src: 'assets/site-plan-1.jpeg', alt: '25’ x 45’ East Plan' };
      case '2':
        return { src: 'assets/site-plan-2.jpeg', };
      case '3':
        return { src: 'assets/site-plan-3.jpeg',};
      case '4':
        return { src: 'assets/master-plan.jpeg', };
      case '5':
        return { src: 'assets/site-plan-5.jpeg',  };
      case '6':
        return { src: 'assets/site-plan-6.jpeg',};
      default:
        return { src: 'assets/default-image.jpeg', };
    }
  };
  const tabsData = {
    "1": {
      title: "Modern Elevation",
      description: "Experience sleek, contemporary designs that add a unique charm to your home.",
      image: "assets/Elevation1.webp",
    },
    "2": {
      title: "Spanish Elevation",
      description: "Immerse yourself in the timeless charm of Spanish classical architecture with this stunning elevation design.",
      image: "assets/Elevation2.jpg",
    },
    "3": {
      title: "Traditional Elevation",
      description: "Feel the essence of tradition with these meticulously designed elevations.",
      image: "assets/Elevation3.jpg",
    },
  };
  const readMore = () =>{
    window.scrollTo(0, 0);
    navigate('/blog')
  }
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const autoScroll = () => {
      if (!isUserScrolling && scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollWidth) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const interval = setInterval(autoScroll, 50);
    return () => clearInterval(interval);
  }, [isUserScrolling]);

  const handleScrollStart = () => {
    setIsUserScrolling(true);
  };

  const handleScrollStop = () => {
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  const toggle = (tab) => {
      if (activeTab !== tab) setActiveTab(tab);
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
        <div className='contactUs-bg'>
    <NavBar/>
    <div className="dlab-bnr-inr d-flex align-items-center">
        <div className="container">
        <div className="dlab-bnr-inr-entry text-md-start text-center">
        <h1>CURRENT PROJECTS</h1>
    <nav aria-label="breadcrumb" className="breadcrumb-row d-flex d-md-block justify-content-center">
        <ul className="breadcrumb">
        <li className="breadcrumb-item"><a href=""><i className="las fa-cogs me-2"></i>Services</a></li>
        <li className="breadcrumb-item active" aria-current="page">Current Projects</li>
    </ul>
    </nav>
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
     </div>
         <div className='container'>
     <div  className="specification-heading  mt-lg-0 mt-5" data-content="INSTALLMENT HOUSING">
     INSTALLMENT HOUSING
     </div>
     </div>
     <div className="container mb-3">
      <div className="row row-50 align-items-center justify-content-center justify-content-xl-between">
        <div className="col-md-6 col-12 wow fadeInLeft">
          <h3>Front Elevation</h3>
          <div className="tabs-custom tabs-horizontal tabs-line tabs-line-big text-center text-md-left" id="tabs-6">
            <ul className="nav nav-tabs construction-ul">
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link nav-link-big ${activeTab1 === "1" ? "active" : ""}`}
                  onClick={() => setActiveTab1("1")}
                >
                  01
                </a>
              </li>
              <li className="nav-item ms-5" role="presentation">
                <a
                  className={`nav-link nav-link-big ${activeTab1 === "2" ? "active" : ""}`}
                  onClick={() => setActiveTab1("2")}
                >
                  02
                </a>
              </li>
              <li className="nav-item ms-5" role="presentation">
                <a
                  className={`nav-link nav-link-big ${activeTab1 === "3" ? "active" : ""}`}
                  onClick={() => setActiveTab1("3")}
                >
                  03
                </a>
              </li>
            </ul>
            <div className="mt-4 text-start">
              <h4>{tabsData[activeTab1].title}</h4>
              <p>{tabsData[activeTab1].description}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12 mt-md-0 mt-3 text-center wow fadeInUp" data-wow-delay=".1s">
          <div className="figure-classic figure-classic-pattern figure-classic-right tab-content">
            <div
              className={`tab-pane tab-home-cstm  fade ${activeTab1 === "1" ? "active show" : ""}`}
              id="tabs-6-1"
            >
              <img src={tabsData["1"].image} alt="Elevation 1" className="img-fluid" />
            </div>
            <div
              className={`tab-pane tab-home-cstm fade ${activeTab1 === "2" ? "active show" : ""}`}
              id="tabs-6-2"
            >
              <img src={tabsData["2"].image} alt="Elevation 2" className="img-fluid" />
            </div>
            <div
              className={`tab-pane tab-home-cstm fade ${activeTab1 === "3" ? "active show" : ""}`}
              id="tabs-6-3"
            >
              <img src={tabsData["3"].image} alt="Elevation 3" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
	<div className='container mt-3'>			
					<div  className="specification-heading" data-content="SPECIFICATIONS">
          SPECIFICATIONS
          </div>
					<p className="specification-text">Discover the comprehensive specifications of the property, featuring a range of amenities such as spacious bedrooms, modern bathrooms, stylish kitchens, inviting living rooms, and more to enhance your living experience</p>
          <div class="row faqs-box spno">
<div class="col-lg-9 col-12">
<div className="faq-media faq-media1 wow fadeInLeft">
                {activeButton===1 &&
                <div>
                <a>
                    <img src="assets/Interior-1.jpeg" id="Capmap1" className="img-fluid" alt="Description of spec1" />
                </a>
                </div>
}
{activeButton===2 &&
<div>
                <a>
                    <img src="assets/Interior-2.jpeg" id="Capmap2" className="img-fluid" alt="Description of spec2" />
                </a>
                </div>
                
}
{activeButton===3 &&
<div>
<a>
                    <img src="assets/Interior-3.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===4 &&
  <div>
                <a>
                    <img src="assets/Interior-4.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===5 &&
  <div>
                <a>
                    <img src="assets/Interior-5.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===6 &&
  <div>
                <a>
                    <img src="assets/Interior-6.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===7 &&
  <div>
                <a>
                    <img src="assets/Interior-7.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===8 &&
  <div>
                <a>
                    <img src="assets/Interior-8.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
</div>
}
{activeButton===9 &&
  <div>
                <a>
                    <img src="assets/Interior-9.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===10 &&
  <div>
                <a>
                    <img src="assets/Interior-10.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
{activeButton===11 &&
  <div>
                <a>
                    <img src="assets/Interior-11.jpeg" id="Capmap3" className="img-fluid" alt="Description of spec3" />
                </a>
                </div>
}
</div>

</div>
<div className='col-lg-3 col-12 specification-accordion'>
<div className="mb-4 wow fadeInUp d-flex text-end d-lg-block d-none" data-wow-duration="2s" data-wow-delay="0.6s">
						<button className="btn-custom">View All Services</button>
					</div>
          <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(1)}>
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        STRUCTURE
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Earthquake-resistant R.C.C frame structure for enhanced safety and durability.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header"onClick={() => handleButtonClick(2)}>
      <button class="accordion-button collapsed"  type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        EXTERIOR FINISH
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        High-quality weather-resistant paint with a textured finish for a modern look.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(3)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        DOOR
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Premium-grade doors with advanced locking systems for safety and elegance.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(4)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        FLOOR
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Vitrified tiles and wooden flooring for aesthetic appeal and durability.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(5)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
        KITCHEN
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Modular kitchen with granite countertops and stainless steel sink.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(6)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
        ELECTRIFICATION
      </button>
    </h2>
    <div id="collapseSix" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Concealed copper wiring and modular switches with ample power points.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(7)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
        INTERIOR FINISH
      </button>
    </h2>
    <div id="collapseSeven" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Smooth plastered walls with premium emulsion paint for a sleek finish.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(8)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
        BATHROOMS & PLUMBING
      </button>
    </h2>
    <div id="collapseEight" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        Designer bathrooms with branded sanitary fittings and concealed plumbing.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(9)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
        WATER SUPPLY
      </button>
    </h2>
    <div id="collapseNine" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        24/7 water supply with a dedicated overhead tank and borewell connection.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" onClick={() => handleButtonClick(10)}>
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
        WINDOW
      </button>
    </h2>
    <div id="collapseTen" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        UPVC windows with toughened glass for superior insulation and durability.
      </div>
    </div>
  </div>
</div>

<div className="mt-4 wow fadeInUp d-flex justify-content-start d-lg-none d-block" data-wow-duration="2s" data-wow-delay="0.6s">
						<button className="btn-custom">View All Services</button>
					</div>
</div>
</div>
	 </div>
   <div className='container mt-5'>
     <div  className="specification-heading  mt-lg-0 mt-5" data-content="LOCATION FEATURES">
     LOCATION FEATURES
     </div>
     </div>
     <div className="container">
<div className="row">
  <div className="col-12">
  <section id="conference-timeline">
  <div>
    <div className="conference-center-line"></div>
    <div className="conference-timeline-content">
      <div className="timeline-article">
        <div className="content-left-container">
          <div className="content-left content1-s2">
          <div class="content">
      <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">1 Minute From</h5>
      <div className="">
<p className='mb-0'>from Winter Land and Food Court</p>
      </div>
      </div>
    </div>
          </div>
        </div>
        <div className="content-right-container">
          <div className="content-right content2-s2">
<img src='assets/location-highlight1.png' className='img-fluid'/>
          </div>
        </div>
        <div className="meta-date d-flex justify-content-center align-items-center">
          <span className="date">01</span>
        </div>
      </div>
      <div className="timeline-article">
        <div className="content-left-container d-flex justify-content-end">
          <div className="content-left content3-s2">
          <img src='assets/loc-highlight2.png' className='img-fluid'/>
          </div>
        </div>
        <div className="content-right-container">
          <div className="content-right content3-s3">
          <div class="content">
    <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">3 Minutes From</h5>
      <div>
        <p className='mb-0'>from Bahria Hospital and Imtiaz Mall</p>
      </div>
      </div>
    </div>
          </div>
        </div>
        <div className="meta-date d-flex justify-content-center align-items-center">
          <span className="date">02</span>
        </div>
      </div>
      <div className="timeline-article">
        <div className="content-left-container">
          <div className="content-left content4-s3">
          <div class="content">
    <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">5 Minutes From</h5>
      <div>
        <p className='mb-0'>from Ring Road, Raiwind Road, and Canal Road</p>
      </div>
      </div>
    </div>
          </div>
        </div>
        <div className="content-right-container">
          <div className="content-right content6-s3">
         <img src='assets/loc-highlight3.png' className='img-fluid'/>
          </div>
        </div>
        <div className="meta-date d-flex justify-content-center align-items-center">
          <span className="date">03</span>
        </div>
      </div>
    </div>
    </div>
  </section>
  <div className="container conference-timeline2 d-md-none d-block">
  <div className="row mt-5">
    <div className="col-12">
      <div className="text-center d-flex justify-content-center">
      <div className="meta-date1 d-flex justify-content-center align-items-center">
          <span className="date">01</span>
        </div>
      </div>
    </div>
  </div>
  <div className="row mt-5 d-flex text-center justify-content-center text-align-center">
    <div className="col-md-8 col-12">
    <div class="content">
      <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">30 Seconds From</h5>
      <div className="">
<p className='mb-0'>from Winter Land and Food Court</p>
      </div>
      </div>
    </div>
    </div>
  </div>
  <div className="row d-flex justify-content-center">
  <div className="col-lg-8 col-md-8 mt-3">
    <div className="">
    <img src='assets/location-highlight1.png' className='img-fluid'/>
          </div>
    </div>
  </div>
  <div className="row mt-5">
    <div className="col-12">
      <div className="text-center d-flex justify-content-center">
      <div className="meta-date1 d-flex justify-content-center align-items-center">
          <span className="date">02</span>
        </div>
      </div>
    </div>
  </div>
  <div className="row mt-5 d-flex text-center justify-content-center text-align-center">
    <div className="col-md-8 col-12">
    <div class="content">
    <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">3 Minutes From</h5>
      <div>
        <p className='mb-0'>from Bahria Hospital and Imtiaz Mall</p>
      </div>
      </div>
    </div>
    </div>
  </div>
  <div className="row d-flex justify-content-center">
  <div className="col-lg-8 col-md-8 mt-3 text-center">
  <div className="content2-s7">
  <img src='assets/loc-highlight2.png' className='img-fluid'/>
          </div>
    </div>
  </div>
  <div className="row mt-5">
    <div className="col-12">
      <div className="text-center d-flex justify-content-center">
      <div className="meta-date1 d-flex justify-content-center align-items-center">
          <span className="date">03</span>
        </div>
      </div>
    </div>
  </div>
  <div className="row mt-5 d-flex text-center justify-content-center text-align-center">
    <div className="col-md-8 col-12">
    <div class="content">
    <div className="timeline2-bg timeline2-bgcurrent">
      <h5 className="timeline2-heading2 timeline2-heading2Current">5 Minutes From</h5>
      <div>
        <p className='mb-0'>from Ring Road, Raiwind Road, and Canal Road</p>
      </div>
      </div>
    </div>
    </div>
  </div>
  <div className="row d-flex justify-content-center">
  <div className="col-lg-8 pb-4 col-md-8 mt-3">
  <div className="content2-s7">
  <img src='assets/loc-highlight3.png' className='img-fluid'/>
          </div>
    </div>
  </div>
</div>
  </div>
</div>
</div>
   <div className='container mt-3'>			
	 <div  className="specification-heading  mt-lg-0 mt-5" data-content="MASTER PLAN">
   MASTER PLAN
   </div>
   <div className='row'>
   <div className='col-lg-6 col-12 pe-lg-4'>
   <div className="section-head">
										<div className="title-about_us">
										<h2>Site Plan & Master Plan</h2>
										</div>
										<div className="dlab-separator mt-3" ></div>
										<p >
											Surround yourself with fresh energy, high-tech amenities, and elevated style. Indulge in extraordinary amenities, relax in appealing social spaces, and cultivate your ideal life. We're the fresh look in this historic district - a vibrant new community for movers and shakers.
										</p>
									</div>
                  <div className="row">
      <div className="col-md-4 col-12">
        <ul className="nav plan-tabs d-md-block d-none" id="myTab" role="tablist">
          <div className='plan-tab-bg'>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '1' ? 'active' : ''}`}
              onClick={() => toggle('1')}
              id="main-tab"toggle
              data-toggle="tab"
              role="tab"
              aria-controls="main"
              aria-selected={activeTab === '1'}
            >
              25’ x 45’ East
            </a>
          </li>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '2' ? 'active' : ''}`}
              onClick={() => toggle('2')}
              id="profile-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="profile"
              aria-selected={activeTab === '2'}
            >
              20’ x 34’ East
            </a>
          </li>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '3' ? 'active' : ''}`}
              onClick={() => toggle('3')}
              id="profile-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="profile"
              aria-selected={activeTab === '3'}
            >
              35’ x 65’ East
            </a>
          </li>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '4' ? 'active' : ''}`}
              onClick={() => toggle('4')}
              id="profile-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="profile"
              aria-selected={activeTab === '4'}
            >
            Master Plan
            </a>
          </li>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '5' ? 'active' : ''}`}
              onClick={() => toggle('5')}
              id="profile-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="profile"
              aria-selected={activeTab === '5'}
            >
              50’ x 90’ East
            </a>
          </li>
          <li className="nav-item1">
            <a
              className={`nav-link ${activeTab === '6' ? 'active' : ''}`}
              onClick={() => toggle('6')}
              id="profile-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="profile"
              aria-selected={activeTab === '6'}
            >
              100’ x 90’ East
            </a>
          </li>
          </div>
        </ul>
        <Slider {...settings} className="d-md-none d-block">
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '1' ? 'active' : ''}`}
          onClick={() => toggle('1')}
        >
          25’ x 45’ East
        </a>
      </div>
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '2' ? 'active' : ''}`}
          onClick={() => toggle('2')}
        >
          20’ x 34’ East
        </a>
      </div>
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '3' ? 'active' : ''}`}
          onClick={() => toggle('3')}
        >
          35’ x 65’ East
        </a>
      </div>
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '4' ? 'active' : ''}`}
          onClick={() => toggle('4')}
        >
          Master Plan
        </a>
      </div>
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '5' ? 'active' : ''}`}
          onClick={() => toggle('5')}
        >
          50’ x 90’ East
        </a>
      </div>
      <div className="nav-item1">
        <a
          className={`nav-link ${activeTab === '6' ? 'active' : ''}`}
          onClick={() => toggle('6')}
        >
          100’ x 90’ East
        </a>
      </div>
    </Slider>
      </div>
      <div className="col-md-8 d-flex align-items-center justify-content-center">
        {activeTab === '1' && (
          <div className=''>
            <div className='row ps-md-2'>
              <div className='col-12 px-md-0 mt-md-0 mt-3'>
              <h2 class="title">255 Lac</h2>
            <h4>25' x 45' East Plan Details</h4>
            <p>This plan features a modern design with spacious accommodations, optimized for family living. The layout ensures maximum natural light and energy efficiency, making it ideal for contemporary lifestyles.</p>
                </div>
                <div className='col-6 ps-md-0 pe-0'>
                          <div className='flat-content-1 d-flex align-items-center gap-3'>
                          <div><img src="assets/home.png" alt=""/></div>
													<div>
                          <h3>03</h3>
													<span>Elevations</span>
                          </div>
                          </div>
												</div>
												<div className='col-6 ps-0'>
                        <div className='flat-content-2 d-flex align-items-center gap-3'>
                          <div>
													<img src="assets/planlogo2.png" alt=""/>
                          </div>
                          <div>
													<h3>04</h3>
													<span>Bathrooms</span>
                          </div>
                          </div>
												</div>
												<div className='col-6 ps-md-0 pe-0'>
                          <div className='d-flex align-items-center gap-3 flat-content-3'>
													<div>
                          <img src="assets/planlogo3.png" alt=""/>
                          </div>
                          <div>
													<h3>03</h3>
													<span>Bedrooms</span>
                          </div>
                          </div>
												</div>
												<div className='col-6 ps-0'>
                        <div className='d-flex align-items-center gap-3 flat-content-4'>
                          <div>
                          <img src="assets/solar-panel.png" alt=""/>
                          </div>
                          <div>
													<h3>05 KVA</h3>
													<span>Solar</span>
                          </div>
                          </div>
												</div>
                        <div className='col-12 px-md-0'>
                        </div>
            </div>
          </div>
        )}
        {activeTab === '2' && (
          <div className=''>
<div className='row ps-md-2'>
  <div className='col-12 px-md-0  mt-md-3 mt-5 text-center'>
    <h2 className="coming-soon-title">Coming Soon</h2>
  </div>
</div>
        </div>
        )}
                {activeTab === '3' && (
          <div className=''>
<div className='row ps-md-2'>
  <div className='col-12 px-md-0 mt-md-3 mt-5 text-center'>
    <h2 className="coming-soon-title">Coming Soon</h2>
  </div>
</div>
        </div>
        )}
                        {activeTab === '4' && (
          <div className=''>
<div className='row ps-md-2'>
  <div className='col-12 px-md-0 mt-md-3 mt-5 text-center'>
    <h2 className="coming-soon-title">Coming Soon</h2>
  </div>
</div>
        </div>
        )}
                        {activeTab === '5' && (
          <div className=''>
<div className='row ps-md-2'>
  <div className='col-12 px-md-0 mt-md-3 mt-5 text-center'>
    <h2 className="coming-soon-title">Coming Soon</h2>
  </div>
</div>
        </div>
        )}
                                {activeTab === '6' && (
          <div className=''>
<div className='row ps-md-2'>
  <div className='col-12 px-md-0 mt-md-3 mt-5 text-center'>
    <h2 className="coming-soon-title">Coming Soon</h2>
  </div>
</div>
        </div>
        )}
      </div>
    </div>
   </div>
   <div className='col-lg-6  mt-md-0 mt-4 col-12 px-2 tab-pane d-flex align-items-center'>
  <div className="fade show" role="tabpanel" aria-labelledby="contact-tab">
    {getImageForActiveTab() && (
      <img 
        src={getImageForActiveTab().src} 
        alt={getImageForActiveTab().alt || ''} 
        className={`img-fluid ${!getImageForActiveTab().alt ? 'site-plan-img-1' : 'site-plan-image'}`} 
      />
    )}
  </div>
</div>


   </div> 
	 </div>
   <div className='container'>
    <div className='row'>
      <div className='col-12'>
      <div className="project-plan">
      <div className="project-plan-header">
      </div>
      <div className="project-details">
      <div  className="specification-heading  mt-lg-0 mt-5" data-content="Payment PLAN">
      Payment PLAN
      </div>
        <div className="pricing-info1">
        <div
      className="table-container"
      ref={scrollRef}
      onTouchStart={handleScrollStart}
      onTouchEnd={handleScrollStop}
      onMouseDown={handleScrollStart}
      onMouseUp={handleScrollStop}
    >
      <table className="styled-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Digging Amount</th>
            <th>30 Monthly Installments</th>
            <th>Every 6 Months</th>
            <th>At Possession</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2,550,000</td>
            <td>5,100,000</td>
            <td>255,000</td>
            <td>1,020,000</td>
            <td>5,100,000</td>
            <td>25,500,000</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className='d-flex justify-content-end'>
    <button  className="btn-custom d-flex justify-content-center">Book Now</button>
    </div>
</div>


      </div>
    </div>
      </div>
    </div>
   </div>
   <div className="container mt-3">			
  <div className="specification-heading mt-lg-0 mt-5" data-content="AMENITIES">
  AMENITIES
  </div>
  <div className="section-head">
    <div className="title-about_us">
      <h2>Bahria Town Amenities</h2>
    </div>
    <div className="dlab-separator mt-3"></div>
  </div>
  <div className="row">
    <div className="col-12">
      <p>
        Bahria Town offers a lifestyle of unparalleled luxury and convenience, featuring world-class amenities such as parks, schools, hospitals, shopping malls, mosques, and state-of-the-art security systems. Designed to provide a community-centric living experience, every facility you need is just a step away.
      </p>
    </div>
  </div>
</div>

   <div className='container-fluid mt-5'>
    <div className='row'>
    <div className="service-area service-area-current">
  <div className="container">
    <div className="row">
      <div className="col-lg-3 col-md-4 col-6">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity1.jpg" alt="Grand Jamia Masjid" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Grand Jamia Masjid</h4>
              <p className="mb-0">World's 7th Largest Mosque</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6">
        <div className="service-box">
          <div className="media">
            <img src="assets/carnival.jpg" alt="Carnival" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Carnival</h4>
              <p className="mb-0">Delicious food varieties for all tastes</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-md-0 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity3.jpeg" alt="Bahria Grand Hotel" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Bahria Grand Hotel</h4>
              <p className="mb-0">Luxury and comfort at your service</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4 mt-lg-0">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity4.jpg" alt="Park & Zoo" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Park & Zoo</h4>
              <p className="mb-0">Relax and enjoy nature</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity5.jpg" alt="CineGold Cinema" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">CineGold Cinema</h4>
              <p className="mb-0">Watch the latest movies in style</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity6.jpg" alt="Commercial Areas" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Large Commercial Areas</h4>
              <p className="mb-0">Perfect for businesses and shopping</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity7.jpg" alt="Bahria Country Club" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Bahria Country Club</h4>
              <p className="mb-0">Exclusive club with luxury facilities</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity8.jpg" alt="Bahria Town International School" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Bahria International School</h4>
              <p className="mb-0">Top-tier education for your children</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/amenity9.jpg" alt="Hospital" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Hospital</h4>
              <p className="mb-0">State-of-the-art healthcare facilities</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/eiffel.jpg" alt="Eiffel Tower" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Eiffel Tower</h4>
              <p className="mb-0">Replica of the famous landmark</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
        <div className="service-box">
          <div className="media">
            <img src="assets/monument.jpeg" alt="Bahria Monuments" className="img-fluid" />
          </div>
          <div className="info1">
            <a>
              <h4 className="title">Bahria Monuments</h4>
                          <p className="mb-0">A beacon of elegance.</p>
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-6 mt-4">
    <div className="service-box">
      <div className="media">
        <img src="assets/amenity12.jpg" alt="24/7 Security" className="img-fluid" />
      </div>
      <div className="info1">
        <a>
          <h4 className="title">24/7 Security</h4>
          <p className="mb-0">Ensuring safety and peace of mind</p>
        </a>
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
  modules={[Autoplay]}
  spaceBetween={20}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  breakpoints={{
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
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

export default CurrentProject;
