import React, { useState, useEffect } from 'react';
import axios from 'axios';


// Import social media icons kutoka react-icons
import { FaFacebookF, FaWhatsapp, FaBuilding } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminUploadVideo() {
  const [video, setVideo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos/all`);
      setVideos(res.data);
    } catch (err) {
      console.error('Failed to fetch videos', err);
    }
  };

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', video.name);

    try {
      await axios.post(`${API_BASE_URL}/api/upload-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('✅ Video imepakiwa kikamilifu!');
      setVideo(null);
      fetchVideos();
    } catch (err) {
      setUploadStatus('❌ Imeshindikana kupakia video.');
      console.error(err);
    }
  };



  const handleDelete = async (id) => {
  if (!window.confirm("Una uhakika unataka kufuta hii video?")) return;
  try {
    await axios.delete(`${API_BASE_URL}/api/videos/${id}`);
    setVideos(videos.filter(v => v.id !== id)); // toa video kwenye state
  } catch (err) {
    console.error("Failed to delete video", err);
    alert("⚠️ Imeshindikana kufuta video");
  }
};


  return (
    <>
      <div className="container py-5">
        <h3 className="mb-4">Pakia Video Mpya</h3>

        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        <button className="btn btn-primary mt-2" onClick={handleUpload}>Pakia</button>
        <p className="mt-2">{uploadStatus}</p>

        <h4 className="mt-5">📹 Video Zilizopostiwa</h4>
        {videos.length > 0 ? (
          <table className="table table-bordered">
  <thead>
    <tr>
      <th>Kichwa</th>
      <th>Tarehe</th>
      <th>Views</th>
      <th>Hatua</th>
    </tr>
  </thead>
  <tbody>
    {videos.map((v) => (
      <tr key={v.id}>
        <td>{v.title || 'Video Bila Kichwa'}</td>
        <td>{new Date(v.created_at).toLocaleString()}</td>
        <td>{v.views}</td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(v.id)}
          >
            Futa
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        ) : (
          <p>Hakuna video bado.</p>
        )}
      </div>

      {/* Social Icons Sidebar */}
      <div style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px 0 0 8px',
        boxShadow: '0 0 8px rgba(0,0,0,0.15)',
        padding: '10px',
        zIndex: 1000,
      }}>
        <a
          href="https://www.facebook.com/yourfacebookprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          style={{ display: 'block', marginBottom: '15px', color: '#3b5998', fontSize: '28px', textAlign: 'center' }}
        >
          <FaFacebookF />
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          style={{ display: 'block', marginBottom: '15px', color: '#25D366', fontSize: '28px', textAlign: 'center' }}
        >
          <FaWhatsapp />
        </a>
        <a
  href="https://www.nest.go.tz"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="NeST"
  style={{ display: 'block', textAlign: 'center' }}
>
  <img
    src="/icons/nest.png"
    alt="NeST"
    style={{ width: '32px', height: '32px', marginBottom: '10px' }}
  />
</a>
      </div>
    </>
  );
}
