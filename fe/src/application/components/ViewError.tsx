import React from 'react';

const ViewError: React.FC<{ reason: Error; reset: () => void }> = ({
  reason,
}) => {
  return `View error: ${reason.message}`;
};

export default ViewError;
