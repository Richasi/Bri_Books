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
  
    // Function to add image as background image with CSS styling
    const addBackgroundImage = (imageUrl) => {
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
  
      // Add the image to the PDF with CSS styling
      doc.addImage(imageUrl, 'JPEG', 0, 0, width, height, '', 'FAST');
  
      // Get the reference to the added image
      const imgIndex = doc.internal.getNumberOfPages() - 1;
  
      // Set CSS styles to ensure the image fits the page
      doc.setPage(imgIndex);
      doc.setDrawColor(255, 255, 255); // Set the color for drawing operations (white)
      doc.setFillColor(255, 255, 255); // Set the fill color (white)
      doc.rect(0, 0, width, height, 'F'); // Add a white rectangle to cover the page
     doc.addImage(imageUrl, 'JPEG', 0, 0, width, height); // Add the image again to cover the white rectangle
    };
  
    // Front Cover
   // Front Cover
if (frontCoverImage) {
  addBackgroundImage(frontCoverImage);
  doc.setFontSize(40);
  doc.text(20, 150, title);
  doc.setFontSize(20); // Set font size for author name
  const authorTextWidth = doc.getStringUnitWidth(author) * 20; // Calculate width of author name
  doc.text(20 + 180 - authorTextWidth, 250, `by ${author}`); // Position author name at bottom right
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
    doc.setFontSize(20);
    doc.text(40, 40, pageContent.text);
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