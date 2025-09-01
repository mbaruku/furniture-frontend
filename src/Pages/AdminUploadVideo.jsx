import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminUploadVideo() {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos/all`);
      setVideos(res.data);
    } catch (err) {
      console.error('Failed to fetch videos', err);
      toast.error("❌ Imeshindikana kupata videos!");
    }
  };

  const handleUpload = async () => {
    if (!video) {
      toast.error("❌ Chagua video kwanza!");
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', video.name);

    try {
      setUploading(true);
      await axios.post(`${API_BASE_URL}/api/upload-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("✅ Video imepakiwa kikamilifu!");
      setVideo(null);
      fetchVideos();
    } catch (err) {
      console.error(err);
      toast.error("❌ Imeshindikana kupakia video.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta hii video?")) return;
    try {
      setDeleteLoadingId(id);
      await axios.delete(`${API_BASE_URL}/api/videos/${id}`);
      setVideos(videos.filter(v => v.id !== id));
      toast.success("✅ Video imefutwa kikamilifu!");
    } catch (err) {
      console.error("Failed to delete video", err);
      toast.error("❌ Imeshindikana kufuta video.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container py-5">
        <h3 className="mb-4">Pakia Video Mpya</h3>

        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        <button className="btn btn-primary mt-2" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Inapakia..." : "Pakia"}
        </button>

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
                      disabled={deleteLoadingId === v.id}
                    >
                      {deleteLoadingId === v.id ? "Inafutwa..." : "Futa"}
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
      </div>
    </>
  );
}
