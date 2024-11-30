import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import PageLayout from '@/components/PageLayout';

const SuspenseFallback: React.FC<{ delay?: number }> = ({ delay = 100 }) => {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (delay < 1) setReveal(true);
    else {
      const timeoutId = setTimeout(() => setReveal(true), delay);
      return () => clearTimeout(timeoutId);
    }
  }, [delay]);

  return reveal ? (
    <PageLayout.Centered>
      <CircularProgress size="lg" color="neutral" variant="soft" />
    </PageLayout.Centered>
  ) : null;
};

export default SuspenseFallback;
