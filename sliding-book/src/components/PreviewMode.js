import React from 'react';
import "./pre.css"

const PreviewMode = ({ frontCoverImage, backCoverImage, title, author, pages, onRemoveFrontCover, onRemovePage }) => {
  return (
    <div className="preview-page">
      <h2 className="title">{title}</h2>
      <p className="author">by {author}</p>
      {frontCoverImage && (
        <div>
          <img className="cover-image" src={frontCoverImage} alt="Front Cover" />
          <button onClick={onRemoveFrontCover}>Remove Front Cover</button>
        </div>
      )}
      {pages.map((page, index) => (
        <div key={index} className="page">
          <h3 className="page-title">Page {index + 1}</h3>
          {page.imageUrl && (
            <div>
              <img className="page-image" src={page.imageUrl} alt={`Page ${index + 1}`} />
              <button onClick={() => onRemovePage(index)}>Remove Page</button>
            </div>
          )}
          <p className="page-text">{page.text}</p>
        </div>
      ))}
      {backCoverImage && <img className="cover-image" src={backCoverImage} alt="Back Cover" />}
    </div>
  );
};

export default PreviewMode;