import React from 'react';
import "./pre.css"

const PreviewMode = ({ frontCoverImage, backCoverImage, title, author, pages, onRemoveFrontCover, onRemoveBackCover, onRemovePage }) => {
  return (
    <div className="preview-page">
      <h2 className="title">{title}</h2>
      <p className="author">by {author}</p>
      {frontCoverImage && (
        <div>
          <img className="preview-cover-image" src={frontCoverImage} alt="Front Cover" />
          <button className="remove-button" onClick={onRemoveFrontCover}>Remove Front Cover</button>
        </div>
      )}
      {pages.map((page, index) => (
        <div key={index} className="preview-page">
          <h3 className="title">Page {index + 1}</h3>
          {page.imageUrl && (
            <div>
              <img className="preview-page-image" src={page.imageUrl} alt={`Page ${index + 1}`} />
              <button className="remove-button" onClick={() => onRemovePage(index)}>Remove Page</button>
            </div>
          )}
          <p className="label">{page.text}</p>
        </div>
      ))}
      {backCoverImage && (
        <div>
          <img className="preview-cover-image" src={backCoverImage} alt="Back Cover" />
          <button className="remove-button" onClick={onRemoveBackCover}>Remove Back Cover</button>
        </div>
      )}
    </div>
  );
};

export default PreviewMode;
