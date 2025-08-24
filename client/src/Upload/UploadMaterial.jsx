import React, { useState } from "react";
import axios from "axios";

function UploadMaterial() {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    classLevel: "",
    instructor: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file!");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/materials", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Material uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading material");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Upload Material (PDF)</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="subject" placeholder="Subject" onChange={handleChange} />
        <input name="classLevel" placeholder="Class Level" onChange={handleChange} />
        <input name="instructor" placeholder="Instructor" onChange={handleChange} />
        <br /><br />
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
        <br /><br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </form>
    </div>
  );
}

export default UploadMaterial;
