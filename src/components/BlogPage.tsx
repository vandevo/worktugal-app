import { useEffect } from 'react';

export function BlogPage() {
  useEffect(() => {
    window.location.replace('https://blog.worktugal.com');
  }, []);

  return null;
}
