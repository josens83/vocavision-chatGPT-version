'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if the user prefers reduced motion (accessibility)
 *
 * Usage:
 * const prefersReducedMotion = useReducedMotion();
 *
 * <motion.div
 *   initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 * >
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to check if device is low-end (for disabling complex animations)
 */
export function useSimpleAnimations(): boolean {
  const [isSimple, setIsSimple] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for mobile or low-end device
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;

    setIsSimple(isMobile || isLowEnd || prefersReducedMotion);
  }, [prefersReducedMotion]);

  return isSimple;
}

export default useReducedMotion;
