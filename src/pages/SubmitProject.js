import React, { useRef, useState } from 'react';
import NavBar from '../layout/header';
import Footer from '../layout/footer';
import { showToast } from '../toast';

import { API_BASE_URL as API_BASE } from '../api';

export default function SubmitProject(){
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [images, setImages] = useState([]); // {id,file,name,size,url,isCover}
  const [videos, setVideos] = useState([]); // {id,file,name,size,url}

  const pickImages = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => ['image/jpeg','image/jpg','image/png'].includes(f.type) && f.size <= 5*1024*1024);
    if (valid.length !== files.length) showToast('Only JPG/PNG up to 5MB allowed','info');
    const payload = valid.map((f) => ({ id: Date.now()+Math.random(), file: f, name: f.name, size: f.size, url: URL.createObjectURL(f), isCover: false }));
    setImages((prev) => [...prev, ...payload]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const pickVideos = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => ['video/mp4','video/avi','video/mov','video/wmv'].includes(f.type) && f.size <= 50*1024*1024);
    if (valid.length !== files.length) showToast('Videos must be MP4/AVI/MOV/WMV up to 50MB','info');
    const payload = valid.map((f) => ({ id: Date.now()+Math.random(), file: f, name: f.name, size: f.size, url: URL.createObjectURL(f) }));
    setVideos((prev) => [...prev, ...payload]);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeImage = (id) => setImages((prev) => prev.filter((x) => x.id !== id));
  const removeVideo = (id) => setVideos((prev) => prev.filter((x) => x.id !== id));
  const setCover = (id) => setImages((prev) => prev.map((x) => ({ ...x, isCover: x.id === id })));
  const formatSize = (bytes) => {
    const k = 1024; const sizes=['Bytes','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return `${(bytes/Math.pow(k,i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className='overflow-hidden'>
      <NavBar />
      <div className='container my-5'>
        <h2 className='mb-3'>List Your Property</h2>
        <p className='text-muted'>Submit your property details. Admin will approve before it appears on portfolio.</p>
        <form onSubmit={async(e)=>{
          e.preventDefault();
          const f = e.currentTarget;
          const fd = new FormData();
          const payload = {
            title: f.title.value,
            description: f.description.value,
            purpose: f.purpose.value,
            propertyType: f.propertyType.value,
            propertySubtype: f.propertySubtype.value,
            city: f.city.value,
            location: f.location.value,
            areaSize: Number(f.areaSize.value),
            areaUnit: f.areaUnit.value,
            price: Number(f.price.value),
            currency: f.currency.value,
            bedrooms: f.bedrooms.value,
            bathrooms: f.bathrooms.value,
            email: f.email.value,
            mobile: f.mobile.value,
            landline: f.landline.value,
          };
          Object.entries(payload).forEach(([k,v])=>{ if(v!==undefined && v!==null && v!=='') fd.append(k, String(v)); });
          images.forEach(m => fd.append('files', m.file, m.name));
          videos.forEach(m => fd.append('files', m.file, m.name));
          try{
            const r = await fetch(`${API_BASE}/projects/create-with-media`,{method:'POST', body: fd});
            if(!r.ok) throw new Error('Failed');
            showToast('Submitted for approval.','success');
            f.reset();
            setImages([]); setVideos([]);
          }catch(err){
            showToast('Submission failed. Please check fields.','error');
          }
        }}>
          <div className='row g-3'>
            <div className='col-md-6'>
              <label className='form-label'>Purpose</label>
              <div className='d-flex gap-2'>
                <label className='btn btn-outline-success'><input type='radio' name='purpose' value='sell' defaultChecked /> SELL</label>
                <label className='btn btn-outline-success'><input type='radio' name='purpose' value='rent' /> RENT</label>
              </div>
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Property Type</label>
              <select name='propertyType' className='form-control'>
                <option value='home'>Home</option>
                <option value='plots'>Plots</option>
                <option value='commercial'>Commercial</option>
              </select>
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Subtype</label>
              <select name='propertySubtype' className='form-control'>
                {/* Home subtypes */}
                <option value='house'>House</option>
                <option value='flat'>Flat</option>
                <option value='upper'>Upper Portion</option>
                <option value='lower'>Lower Portion</option>
                <option value='farmhouse'>Farm House</option>
                <option value='room'>Room</option>
                <option value='penthouse'>Penthouse</option>
                {/* Plot subtypes */}
                <option value='residential'>Residential Plot</option>
                <option value='commercial'>Commercial Plot</option>
                <option value='agricultural'>Agricultural Land</option>
                <option value='industrial'>Industrial Land</option>
                {/* Commercial subtypes */}
                <option value='office'>Office</option>
                <option value='shop'>Shop</option>
                <option value='warehouse'>Warehouse</option>
                <option value='factory'>Factory</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className='col-md-6'>
              <label className='form-label'>City</label>
              <input name='city' className='form-control' required />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Location</label>
              <input name='location' className='form-control' required />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Title</label>
              <input name='title' className='form-control' required />
            </div>
            <div className='col-12'>
              <label className='form-label'>Description</label>
              <textarea name='description' className='form-control' rows='4' required />
            </div>

            {/* Media Section */}
            <div className='col-12'>
              <div className='card' style={{ border: '1px solid #eee', borderRadius: 8 }}>
                <div className='card-body'>
                  <div className='d-flex align-items-center justify-content-between mb-2'>
                    <h5 className='card-title mb-0'>Property Images</h5>
                    <div className='d-flex gap-2'>
                      <button type='button' className='btn btn-primary btn-sm' onClick={() => imageInputRef.current?.click()}>
                        <i className='fas fa-upload'></i> Upload Images
                      </button>
                      <input ref={imageInputRef} type='file' accept='image/jpeg,image/jpg,image/png' multiple onChange={pickImages} style={{ display: 'none' }} />
                    </div>
                  </div>
                  {images.length === 0 && <p className='text-muted mb-0'>No images selected yet. JPG/PNG up to 5MB.</p>}
                  {images.length > 0 && (
                    <div className='row g-3'>
                      {images.map((img) => (
                        <div key={img.id} className='col-md-3 col-6'>
                          <div style={{ position: 'relative', border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
                            <img src={img.url} alt={img.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6 }}>
                              <button type='button' className='btn btn-sm btn-outline-light' title='Set as cover' onClick={() => setCover(img.id)}>
                                <i className='fas fa-star'></i>
                              </button>
                              <button type='button' className='btn btn-sm btn-danger' title='Remove' onClick={() => removeImage(img.id)}>
                                <i className='fas fa-trash'></i>
                              </button>
                            </div>
                            {img.isCover && (
                              <span style={{ position: 'absolute', left: 6, top: 6, background: '#27ae60', color: '#fff', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>Cover</span>
                            )}
                          </div>
                          <small className='text-muted d-block mt-1'>{img.name} · {formatSize(img.size)}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='col-12'>
              <div className='card' style={{ border: '1px solid #eee', borderRadius: 8 }}>
                <div className='card-body'>
                  <div className='d-flex align-items-center justify-content-between mb-2'>
                    <h5 className='card-title mb-0'>Property Videos</h5>
                    <div className='d-flex gap-2'>
                      <button type='button' className='btn btn-primary btn-sm' onClick={() => videoInputRef.current?.click()}>
                        <i className='fas fa-upload'></i> Upload Videos
                      </button>
                      <input ref={videoInputRef} type='file' accept='video/mp4,video/avi,video/mov,video/wmv' multiple onChange={pickVideos} style={{ display: 'none' }} />
                    </div>
                  </div>
                  {videos.length === 0 && <p className='text-muted mb-0'>No videos selected yet. Up to 50MB each.</p>}
                  {videos.length > 0 && (
                    <div className='row g-3'>
                      {videos.map((vid) => (
                        <div key={vid.id} className='col-md-4 col-12'>
                          <div style={{ position: 'relative', border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
                            <video controls style={{ width: '100%', height: 160, background: '#000' }}>
                              <source src={vid.url} type={vid.file.type} />
                            </video>
                            <button type='button' className='btn btn-sm btn-danger' style={{ position: 'absolute', top: 6, right: 6 }} onClick={() => removeVideo(vid.id)} title='Remove'>
                              <i className='fas fa-trash'></i>
                            </button>
                          </div>
                          <small className='text-muted d-block mt-1'>{vid.name} · {formatSize(vid.size)}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              <label className='form-label'>Area Size</label>
              <input type='number' step='0.01' name='areaSize' className='form-control' required />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Area Unit</label>
              <select name='areaUnit' className='form-control'>
                <option value='marla'>Marla</option>
                <option value='kanal'>Kanal</option>
                <option value='sq_ft'>Sq Ft</option>
                <option value='sq_yd'>Sq Yd</option>
              </select>
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Price</label>
              <input type='number' name='price' className='form-control' required />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Currency</label>
              <select name='currency' className='form-control'>
                <option value='PKR'>PKR</option>
                <option value='USD'>USD</option>
                <option value='EUR'>EUR</option>
              </select>
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Bedrooms</label>
              <input name='bedrooms' className='form-control' />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Bathrooms</label>
              <input name='bathrooms' className='form-control' />
            </div>
            <div className='col-md-4'>
              <label className='form-label'>Email</label>
              <input type='email' name='email' className='form-control' />
            </div>
            <div className='col-md-4'>
              <label className='form-label'>Mobile</label>
              <input name='mobile' className='form-control' />
            </div>
            <div className='col-md-4'>
              <label className='form-label'>Landline</label>
              <input name='landline' className='form-control' />
            </div>
          </div>
          <div className='mt-3 d-flex justify-content-end'>
            <button className='btn btn-success'>Submit for Approval</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}


