import React from 'react';

const ErrorHandling = ({ error }) => {
  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ErrorHandling;