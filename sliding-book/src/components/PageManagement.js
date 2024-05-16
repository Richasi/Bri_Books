import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PageManagement = ({ pages, setPages }) => {
  const [imageUrls, setImageUrls] = useState(Array(pages.length).fill(null));

  const handleAddPage = () => {
    setPages([...pages, { text: '', imageUrl: null }]);
    setImageUrls([...imageUrls, null]);
  };

  const handleImageUpload = (index, file) => {
    if (!file) return; // Do nothing if no file is selected

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = imageUrl;
      setImageUrls(newImageUrls);
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

  const generatePdf = () => {
    const pdf = new jsPDF();
    const pagePromises = pages.map((page, index) => {
      return new Promise((resolve) => {
        const pageContent = document.getElementById(`page-${index}`);
        html2canvas(pageContent).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 10, 10, 180, 150);
          if (index !== pages.length - 1) {
            pdf.addPage();
          }
          resolve();
        });
      });
    });

    Promise.all(pagePromises).then(() => {
      pdf.save('pages.pdf');
    });
  };

  return (
    <div>
      <button onClick={handleAddPage}>Add Page</button>
      {pages.map((page, index) => (
        <div key={index} id={`page-${index}`}>
          <h3>Page {index + 1}</h3>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e.target.files[0])} />
          {imageUrls[index] && <img src={imageUrls[index]} alt={`Page ${index + 1}`} />}
          <input type="text" value={page.text || ''} onChange={(e) => handleTextChange(index, e.target.value)} placeholder="Main text..." />
        </div>
      ))}
    </div>
  );
};

export default PageManagement;
