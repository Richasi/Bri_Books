import React, { useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import ImageUpload from './components/ImageUpload';
import TextInput from './components/TextInput';
import PageManagement from './components/PageManagement';
import PreviewMode from './components/PreviewMode';
import ErrorHandling from './components/ErrorHandling';

function App() {
  const [frontCoverImage, setFrontCoverImage] = useState(null);
  const [backCoverImage, setBackCoverImage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState([]);
  const [error, setError] = useState('');

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
  
    // Front Cover
    if (frontCoverImage) {
      // Convert frontCoverImage to Blob
      const frontCoverBlob = new Blob([frontCoverImage], { type: 'image/jpeg' });
      const frontCoverDataURL = URL.createObjectURL(frontCoverBlob);
      doc.addImage(frontCoverDataURL, 'JPEG', 10, 10, 180, 120);
      doc.setFontSize(20);
      doc.text(20, 150, title);
      doc.text(20, 170, `by ${author}`);
      doc.addPage();
    }
  
    // Content Pages
    pages.forEach((pageContent, index) => {
      if (pageContent.text === '' && !pageContent.imageUrl) {
        return; // Skip empty pages
      }
  
      if (pageContent.imageUrl) {
        const imgData = pageContent.imageUrl;
        doc.addImage(imgData, 'JPEG', 10, 10, 180, 120);
      }
  
      if (pageContent.text) {
        doc.setFontSize(12);
        doc.text(20, 20, pageContent.text);
      }
  
      doc.addPage(); // Move to next page
    });
  
    // Back Cover
    if (backCoverImage) {
      // Convert backCoverImage to Blob
      const backCoverBlob = new Blob([backCoverImage], { type: 'image/jpeg' });
      const backCoverDataURL = URL.createObjectURL(backCoverBlob);
      doc.addImage(backCoverDataURL, 'JPEG', 10, 10, 180, 120);
    }
  
    // Save PDF
    doc.save(`${title}.pdf`);
  };
  
  
  
  return (
    <div className="App">
      <h1>BriBooks</h1>
      
      {/* Image Upload */}
      <ImageUpload label="Front Cover Image" onChange={setFrontCoverImage} />
      <ImageUpload label="Back Cover Image" onChange={setBackCoverImage} />
      
      {/* Text Input */}
      <TextInput label="Title" value={title} onChange={setTitle} />
      <TextInput label="Author" value={author} onChange={setAuthor} />
      
      {/* Page Management */}
      <PageManagement pages={pages} setPages={setPages} />
      
      {/* Preview Mode */}
      <PreviewMode frontCoverImage={frontCoverImage} backCoverImage={backCoverImage} title={title} author={author} pages={pages} />
      
      {/* PDF Generation */}
      <button onClick={handleGeneratePdf}>Generate PDF</button>
      
      {/* Error Handling */}
      <ErrorHandling error={error} />
    </div>
  );
}

export default  App;
