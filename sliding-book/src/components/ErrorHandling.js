import React from 'react';

const ErrorHandling = ({ error }) => {
  return error ? <div className="error">{error}</div> : null;
};

export default ErrorHandling;
