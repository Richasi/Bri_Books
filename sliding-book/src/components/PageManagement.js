import React, { useState } from 'react';
import "./page.css";

const PageManagement = ({ pages, setPages }) => {
  const [imageFiles, setImageFiles] = useState(Array(pages.length).fill(null));

  const handleAddPage = () => {
    setPages([...pages, { text: '', imageUrl: null }]);
    setImageFiles([...imageFiles, null]);
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const newImageFiles = [...imageFiles];
    newImageFiles[index] = file.name;
    setImageFiles(newImageFiles);

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      const newPages = [...pages];
      newPages[index] = { ...newPages[index], imageUrl: imageUrl };
      setPages(newPages);
    };
    reader.readAsDataURL(file);
  };

  const handleTextChange = (index, text) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], text: text };
    setPages(newPages);
  };

  const handleRemovePage = (index) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);

    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  return (
    <div id="page-management" className="page-management-container">
      <button className="add-page-button" onClick={handleAddPage}>Add Page</button>
      {pages.map((page, index) => (
        <div className="page-container" key={index} id={`page-${index}`}>
          <h3>Page {index + 1}</h3>
          <button className="remove-page-button" onClick={() => handleRemovePage(index)}>Remove</button>
          <input className="image-upload-input" type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e.target.files[0])} />
          {imageFiles[index] && <p>{imageFiles[index]}</p>}
          <input className="text-input" type="text" value={page.text || ''} onChange={(e) => handleTextChange(index, e.target.value)} placeholder="Main text..." />
        </div>
      ))}
    </div>
  );
};

export default PageManagement;
