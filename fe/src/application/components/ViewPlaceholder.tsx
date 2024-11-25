import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';

const ViewPlaceholder: React.FC<{ delay?: number }> = ({ delay = 100 }) => {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (delay < 1) setReveal(true);
    else {
      const timeoutId = setTimeout(() => setReveal(true), delay);
      return () => clearTimeout(timeoutId);
    }
  }, [delay]);

  return reveal ? <PageLayout.Centered>Loading...</PageLayout.Centered> : null;
};

export default ViewPlaceholder;
