import { useEffect, useState } from "react";
import axios from "axios";

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllVideos() {
  const [videos, setVideos] = useState([]);

  // Fetch videos from backend
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos/all`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Increment view count when video starts playing
  const handleVideoPlay = async (videoId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/videos/${videoId}/view`);
      // After incrementing views, refresh video list to update counts
      fetchVideos();
    } catch (err) {
      console.error("Failed to increment views", err);
    }
  };

  if (videos.length === 0) return <p>Hakuna video zilizopostiwa bado.</p>;

  return (
    <div className="container py-5">
      <h3 className="mb-4">Video Zote za Bidhaa</h3>
      <div className="row">
        {videos.map((vid) => (
          <div key={vid.id} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="ratio ratio-16x9">
                <video
                  src={`${API_BASE_URL}${vid.url}`}
                  controls
                  className="w-100 h-100"
                  onPlay={() => handleVideoPlay(vid.id)}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{vid.title || "Video Bila Kichwa"}</h5>
                <p className="card-text text-muted">👁️ Watazamaji: {vid.views}</p>
                <p className="card-text">Iliwekwa: {new Date(vid.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
