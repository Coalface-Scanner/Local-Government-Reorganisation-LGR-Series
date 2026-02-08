import { useEffect, useRef } from 'react';
import { trackTimeOnPage } from '../utils/analytics';

/**
 * Hook to track time spent on page
 * Tracks milestones: 30s, 1min, 2min, 5min, 10min+
 */
export function useTimeOnPageTracking() {
  const trackedMilestones = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only track if we're in the browser
    if (typeof window === 'undefined') return;

    const milestones = [30, 60, 120, 300, 600]; // 30s, 1min, 2min, 5min, 10min
    startTimeRef.current = Date.now();

    // Check milestones every 5 seconds
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Track milestones
      for (const milestone of milestones) {
        if (elapsed >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone);
          trackTimeOnPage(milestone);
        }
      }
    }, 5000); // Check every 5 seconds

    // Track final time on page when component unmounts or page unloads
    const handleBeforeUnload = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) {
        // Send final time on page event
        trackTimeOnPage(elapsed);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track final time on page
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) {
        trackTimeOnPage(elapsed);
      }
      
      trackedMilestones.current.clear();
    };
  }, []);
}
