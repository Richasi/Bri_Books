import React from 'react';

const PdfGeneration = ({ onClick }) => {
  return (
    <div>
      <button onClick={onClick}>Generate PDF</button>
    </div>
  );
};

export default PdfGeneration;