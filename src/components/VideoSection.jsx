import { useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VideoSection() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/videos/latest`)
      .then(res => {
        setVideo(res.data);
        // Increase views count
        axios.post(`${API_BASE_URL}/api/videos/${res.data.id}/view`);
      })
      .catch(() => setVideo(null));
  }, []);

  if (!video) return <p>Hakuna video bado.</p>;

  return (
    <section className="py-5 bg-light" id="video">
      <div className="text-center">
        <h2 className="mb-4 fw-bold">🎥 {video.title}</h2>
        <p className="mb-2 text-muted">Watazamaji: {video.views}</p>
        <div className="ratio ratio-16x9 shadow-lg rounded overflow-hidden">
          <video controls width="100%" src={`${API_BASE_URL}${video.url}`} />
        </div>
      </div>
    </section>
  );
}
