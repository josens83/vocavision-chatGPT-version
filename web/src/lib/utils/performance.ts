// Phase 3-1: Performance Monitoring
// Core Web Vitals tracking and reporting

import { logger } from './logger';

/**
 * Core Web Vitals thresholds (Google standards)
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    GOOD: 2500, // ms
    NEEDS_IMPROVEMENT: 4000,
  },
  FID: {
    GOOD: 100, // ms
    NEEDS_IMPROVEMENT: 300,
  },
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  FCP: {
    GOOD: 1800, // ms
    NEEDS_IMPROVEMENT: 3000,
  },
  TTFB: {
    GOOD: 800, // ms
    NEEDS_IMPROVEMENT: 1800,
  },
};

/**
 * Get rating for metric value
 */
function getRating(
  value: number,
  thresholds: { GOOD: number; NEEDS_IMPROVEMENT: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.GOOD) return 'good';
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vital
 */
export function reportWebVital(metric: {
  name: string;
  value: number;
  rating?: string;
  delta?: number;
  id: string;
}): void {
  const { name, value, rating, id } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}:`, {
      value: Math.round(value),
      rating,
      id,
    });
  }

  // Log to structured logger
  logger.info(`Web Vital: ${name}`, {
    metric: name,
    value: Math.round(value),
    rating,
    id,
  });

  // TODO Phase 4: Send to analytics
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', name, {
  //     value: Math.round(value),
  //     event_category: 'Web Vitals',
  //     event_label: id,
  //     non_interaction: true,
  //   });
  // }
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(callback: (value: number) => void): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      if (lastEntry) {
        const value = lastEntry.renderTime || lastEntry.loadTime;
        callback(value);

        reportWebVital({
          name: 'LCP',
          value,
          rating: getRating(value, WEB_VITALS_THRESHOLDS.LCP),
          id: `lcp-${Date.now()}`,
        });
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('[Performance] LCP measurement failed:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(callback: (value: number) => void): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry: any) => {
        if (entry.processingStart) {
          const value = entry.processingStart - entry.startTime;
          callback(value);

          reportWebVital({
            name: 'FID',
            value,
            rating: getRating(value, WEB_VITALS_THRESHOLDS.FID),
            id: `fid-${Date.now()}`,
          });
        }
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('[Performance] FID measurement failed:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(callback: (value: number) => void): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          callback(clsValue);
        }
      });

      reportWebVital({
        name: 'CLS',
        value: clsValue,
        rating: getRating(clsValue, WEB_VITALS_THRESHOLDS.CLS),
        id: `cls-${Date.now()}`,
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('[Performance] CLS measurement failed:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(callback: (value: number) => void): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          callback(value);

          reportWebVital({
            name: 'FCP',
            value,
            rating: getRating(value, WEB_VITALS_THRESHOLDS.FCP),
            id: `fcp-${Date.now()}`,
          });
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('[Performance] FCP measurement failed:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(callback: (value: number) => void): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navEntry) {
      const value = navEntry.responseStart - navEntry.requestStart;
      callback(value);

      reportWebVital({
        name: 'TTFB',
        value,
        rating: getRating(value, WEB_VITALS_THRESHOLDS.TTFB),
        id: `ttfb-${Date.now()}`,
      });
    }
  } catch (error) {
    console.error('[Performance] TTFB measurement failed:', error);
  }
}

/**
 * Initialize all Web Vitals measurements
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') {
    return;
  }

  measureLCP((value) => {
    console.log('[Performance] LCP:', Math.round(value), 'ms');
  });

  measureFID((value) => {
    console.log('[Performance] FID:', Math.round(value), 'ms');
  });

  measureCLS((value) => {
    console.log('[Performance] CLS:', value.toFixed(3));
  });

  measureFCP((value) => {
    console.log('[Performance] FCP:', Math.round(value), 'ms');
  });

  measureTTFB((value) => {
    console.log('[Performance] TTFB:', Math.round(value), 'ms');
  });
}

/**
 * Get performance metrics summary
 */
export function getPerformanceMetrics(): {
  navigation?: PerformanceNavigationTiming;
  memory?: any;
  resources?: PerformanceResourceTiming[];
} {
  if (typeof window === 'undefined') {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const memory = (performance as any).memory;
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return {
    navigation,
    memory,
    resources,
  };
}

/**
 * Clear performance marks and measures
 */
export function clearPerformanceMarks(): void {
  if (typeof window !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Custom performance mark
 */
export function mark(name: string): void {
  if (typeof window !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Custom performance measure
 */
export function measure(name: string, startMark: string, endMark?: string): number | undefined {
  if (typeof window === 'undefined' || !performance.measure) {
    return undefined;
  }

  try {
    const measureName = endMark
      ? performance.measure(name, startMark, endMark)
      : performance.measure(name, startMark);

    const entry = performance.getEntriesByName(name)[0];
    if (entry) {
      logger.info(`Performance measure: ${name}`, {
        duration: Math.round(entry.duration),
      });
      return entry.duration;
    }
  } catch (error) {
    console.error(`[Performance] Failed to measure ${name}:`, error);
  }

  return undefined;
}

console.log('[Performance] Module loaded');
