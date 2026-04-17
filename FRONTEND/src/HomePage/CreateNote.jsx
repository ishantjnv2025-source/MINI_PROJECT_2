import React, { useState, useRef } from "react";
import "./CreateNote.css";
import axios from "axios";

const CreateNote = ({ setView }) => {
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]); // array
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tagOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Programming",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Database",
    "Operating System",
    "Networking",
    "Machine Learning",
    "Artificial Intelligence",
    "Electronics",
    "Mechanical",
    "Economics",
    "Business",
    "Finance",
    "Marketing",
    "Psychology",
    "Philosophy",
    "History",
    "Geography",
    "Literature",
    "English",
  ];

  const handleTagClick = (tag) => {
    if (tags.includes(tag)) {
      // ✅ remove if already selected
      setTags(tags.filter((t) => t !== tag));
    } else {
      // ❌ prevent selecting more than 3
      if (tags.length >= 3) {
        setMessage("⚠️ You can select maximum 3 tags");
        return;
      }

      // ✅ add tag
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("tags", tags.join(","));

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (e) => {
  let percent = Math.round((e.loaded * 100) / e.total);

  // cap at 90%
  let adjusted;

if (percent < 70) {
  adjusted = percent; // normal
} else {
  // slow down after 70%
  adjusted = 70 + (percent - 70) * 0.5;
}

adjusted = Math.min(adjusted, 90);
setProgress(adjusted);
},
        },
      );
      setMessage(res.data.message);
      console.log("Success:", res.data);
      // ✅ complete remaining progress smoothly
      const interval = setInterval(() => {
  setProgress((prev) => {
    if (prev >= 100) {
      clearInterval(interval);
      return 100;
    }
    return prev + 2;
  });
}, 20);

      

      // ✅ Clear form
      setTitle("");
      setSubject("");
      setDescription("");
      setTags([]);
      setFile(null);

      if (fileRef.current) fileRef.current.value = "";

      // ✅ Switch view
      setTimeout(() => {
        setProgress(0);
      setProcessing(false);
  setView("all");
}, 500);
      
      
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-note">
      <h1>Create Note</h1>

      <form className="form" onSubmit={handleSubmit}>
        {/* TITLE */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* SUBJECT */}
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* TAGS (MULTI SELECT) */}
        <div className="form-group">
          <label>Tags</label>

          <div className="tag-options">
            {tagOptions.map((tag, index) => (
              <div
                key={index}
                className={`tag-chip 
    ${tags.includes(tag) ? "active" : ""} 
    ${tags.length >= 3 && !tags.includes(tag) ? "disabled" : ""}
  `}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* FILE */}
        <div className="form-group">
          <label>Upload File</label>
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <p>{message}</p>
        {progress > 0 && progress < 100 && <p>Uploading... {progress}%</p>}

        {progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <button type="submit" className={"create-btn"} disabled={loading}>
          {loading ? "Submitting..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
