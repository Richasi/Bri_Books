import React, { useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
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

  const loadImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  const generateQRCode = (text) => { // Define generateQRCode function
    return QRCode.toDataURL(text, { width: 150, margin: 1 });
  };

  const handleGeneratePdf = async () => {
    const doc = new jsPDF();
  
    const addBackgroundImage = async (imageUrl) => {
      try {
        const img = await loadImage(imageUrl);
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const aspectRatio = imgWidth / imgHeight;
  
        let newWidth = width;
        let newHeight = height;
  
        if (width / height > aspectRatio) {
          newWidth = height * aspectRatio;
        } else {
          newHeight = width / aspectRatio;
        }
  
        const xOffset = (width - newWidth) / 2;
        const yOffset = (height - newHeight) / 2;
  
        doc.addImage(imageUrl, 'JPEG', xOffset, yOffset, newWidth, newHeight);
      } catch (err) {
        console.error('Error loading image', err);
        setError('Error loading image');
      }
    };
  
    // Add Front Cover
    if (frontCoverImage) {
      await addBackgroundImage(frontCoverImage);
  
      // Add title and author
      doc.setFontSize(40);
      doc.text(title, 20, 150);
      doc.setFontSize(20);
      const authorTextWidth = doc.getStringUnitWidth(author) * 20;
      doc.text(`by ${author}`, 20 + 180 - authorTextWidth, 250);
      
      doc.addPage();
    }
  
    // Content Pages
    for (const pageContent of pages) {
      if (pageContent.text === '' && !pageContent.imageUrl) {
        continue;
      }
  
      if (pageContent.imageUrl) {
        await addBackgroundImage(pageContent.imageUrl);
      }
  
      console.log("Page Content Text:", pageContent.text); // Log page content
  
      if (pageContent.text) {
        doc.setFontSize(15);
        const textLines = doc.splitTextToSize(pageContent.text, doc.internal.pageSize.getWidth() - 80);
        let textY = 40;
        for (const line of textLines) {
          doc.text(line, 40, textY);
          textY += 10; // Adjust spacing between lines as needed
        }
      }
  
      doc.addPage(); // Add a new page after processing content
    }
  
    // Add Back Cover
    if (backCoverImage) {
      await addBackgroundImage(backCoverImage);
    }
  
    // Add QR Code and Thank You message
    const qrCodeUrl = await generateQRCode('https://example.com');
    doc.addImage(qrCodeUrl, 'JPEG', 20, 20, 50, 50);
    doc.setFontSize(20);
    doc.text('Thank you for reading!', 20, 80);
  
    // Save PDF
    doc.save(`${title}.pdf`);
  };
  

  return (
    <div className="App">
      <h1>BriBooks</h1>
      <ImageUpload label="Front Cover Image" onChange={setFrontCoverImage} />
      <ImageUpload label="Back Cover Image" onChange={setBackCoverImage} />
      <TextInput label="Title" value={title} onChange={setTitle} />
      <TextInput label="Author" value={author} onChange={setAuthor} />

      <div className="flex-container">
        <div className="half-width">
          <PageManagement pages={pages} setPages={setPages} />
        </div>
        <div className="half-width">
          <PreviewMode
            frontCoverImage={frontCoverImage}
            backCoverImage={backCoverImage}
            title={title}
            author={author}
            pages={pages}
            onRemoveFrontCover={() => setFrontCoverImage(null)}
            onRemoveBackCover={() => setBackCoverImage(null)}
            onRemovePage={(index) => {
              const newPages = [...pages];
              newPages.splice(index, 1);
              setPages(newPages);
            }}
          />
        </div>
      </div>

      <button className="generate-pdf-button" onClick={handleGeneratePdf}>Generate PDF</button>
      <ErrorHandling error={error} />
    </div>
  );
}

export default App;
