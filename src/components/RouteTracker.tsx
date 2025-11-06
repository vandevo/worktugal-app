import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '../lib/analytics';

export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return null;
}
