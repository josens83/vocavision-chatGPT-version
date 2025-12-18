'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseScrollRevealOptions {
  /** Intersection threshold (0-1). Default: 0.1 */
  threshold?: number;
  /** Root margin for intersection. Default: '0px' */
  rootMargin?: string;
  /** Only trigger once. Default: true */
  triggerOnce?: boolean;
}

interface UseScrollRevealResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isVisible: boolean;
}

/**
 * Hook to detect when an element enters the viewport
 *
 * Usage:
 * const { ref, isVisible } = useScrollReveal();
 *
 * <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
 *   Content
 * </div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseScrollRevealOptions = {}): UseScrollRevealResult<T> {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook to track scroll progress of an element
 * Returns a value from 0 to 1 as element scrolls through viewport
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T | null>;
  progress: number;
} {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element enters bottom, 1 when exits top
      const elementProgress = 1 - (rect.bottom / (windowHeight + rect.height));
      const clampedProgress = Math.max(0, Math.min(1, elementProgress));

      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

export default useScrollReveal;
