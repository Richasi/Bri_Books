import React from 'react';

const PreviewMode = ({ frontCoverImage, backCoverImage, title, author, pages }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>by {author}</p>
      {frontCoverImage && <img src={frontCoverImage} alt="Front Cover" />}
      {pages.map((page, index) => (
        <div key={index}>
          <h3>Page {index + 1}</h3>
          {page.imageUrl && <img src={page.imageUrl} alt={`Page ${index + 1}`} />}
          <p>{page.text}</p>
        </div>
      ))}
      {backCoverImage && <img src={backCoverImage} alt="Back Cover" />}
    </div>
  );
};

export default PreviewMode;
