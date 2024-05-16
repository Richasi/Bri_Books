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
  
    // Function to add image as background image
    const addBackgroundImage = (imageUrl) => {
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(imageUrl, 'JPEG', 0, 0, width, height, '', 'FAST');
    };
  
    // Front Cover
    if (frontCoverImage) {
      addBackgroundImage(frontCoverImage);
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
        addBackgroundImage(pageContent.imageUrl);
      }
  
      if (pageContent.text) {
        doc.setFontSize(12);
        doc.text(20, 20, pageContent.text);
      }
  
      doc.addPage(); // Move to next page
    });
  
    // Back Cover
    if (backCoverImage) {
      addBackgroundImage(backCoverImage);
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

      <div className="flex-container">
        {/* Page Management */}
        <div className="half-width">
          <PageManagement pages={pages} setPages={setPages} />
        </div>

        {/* Preview Mode */}
        <div className="half-width">
        <PreviewMode 
  frontCoverImage={frontCoverImage} 
  backCoverImage={backCoverImage} 
  title={title} 
  author={author} 
  pages={pages} 
  onRemoveFrontCover={() => setFrontCoverImage(null)} 
  onRemovePage={(index) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
  }} 
/>
 </div>
      </div>
      
      {/* PDF Generation */}
      <button className="generate-pdf-button" onClick={handleGeneratePdf}>Generate PDF</button>
      
      {/* Error Handling */}
      <ErrorHandling error={error} />
    </div>
  );
}

export default App;