import React, { useState,useEffect } from "react";
import "./DetailCard.css";
import { Link } from "react-router-dom";
import axios from "axios";
const DetailCard = ({ note, onClose ,favNote, onToggleFavourite}) => {
  const [isFavourite, setIsFavourite] = useState(false);



  useEffect(() => {
  if (favNote && note?._id) {
    const isFav = favNote.some(fav => fav._id === note._id);
    setIsFavourite(isFav);
  }
}, [favNote, note]);



  const [loading, setLoading] = useState(false);
  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const addFavourite = async () => {
  try {
    setIsFavourite(prev => !prev);
    setLoading(true);

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/favourite`,
      { fileId: note._id },
      { withCredentials: true }
    );

    // ✅ THIS IS THE KEY FIX
    onToggleFavourite(note);

  } catch (err) {
    setIsFavourite(prev => !prev);
    console.log(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }

};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* LEFT SIDE */}
        <div className="modal-left">
          <div className="preview-box">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
              alt="preview"
              className="preview-image"
            />
          </div>

          <div className="action-buttons">
            <a href={note.fileUrl} className="btn primary" target="_blank">
              Download
            </a>
            <button
              onClick={addFavourite}
              disabled={loading}
              style={{
                fontSize: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isFavourite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="modal-right">
          <span className="close-btn" onClick={onClose}>
              ×
            </span>
          <div className="header">
            <h2>{note.title}</h2>
            
          </div>

          <div className="icon-actions">
            <p>{note.description}</p>
          </div>

          <div className="section">
            <h4>DOCUMENT INFO</h4>

            <div className="info-row">
              <span>Size:</span>
              <span>{(note.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
            </div>

            <div className="info-row">
              <span>Created:</span>
              <span>{formatDate(note.createdAt)}</span>
            </div>

            <div className="info-row">
              <span>Owner:</span>
              <span>{note.uploadedBy.name}</span>
            </div>
            {/* <div className="info-row">
              <span>Download Count</span>
              <span>{note.downloadCount}</span>
            </div> */}
          </div>

          <div className="section">
            <h4>TAGS</h4>
            <div className="tags">
              <span className="tag">Work</span>
              <span className="tag">Meetings</span>
            </div>
          </div>

          <div className="section">
            <h4>DOWNLOADS</h4>
            <div className="sharing-box">
              <span className="dot"></span>
              {`Downloaded by ${note.downloadCount} people`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
