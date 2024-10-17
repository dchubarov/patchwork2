import {Metric} from 'web-vitals';

const reportWebVitals = (onReport?: (metric: Metric) => void) => {
  if (onReport) {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(onReport);
      onFCP(onReport);
      onLCP(onReport);
      onTTFB(onReport);
    });
  }
};

export default reportWebVitals;
