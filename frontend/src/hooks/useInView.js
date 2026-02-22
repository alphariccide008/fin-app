import { useEffect, useRef, useState } from 'react';

/**
 * useInView — triggers when element scrolls into the viewport.
 * Returns [ref, isVisible].
 * Once visible, stays visible (one-shot by default).
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, inView];
}
