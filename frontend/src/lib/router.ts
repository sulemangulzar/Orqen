import { useEffect, useState } from 'react';

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname + window.location.search);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  return pathname;
}
