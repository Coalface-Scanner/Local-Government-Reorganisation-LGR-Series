import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '../utils/analytics';

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%)
 * Uses IntersectionObserver to detect when user reaches each milestone
 */
export function useScrollDepthTracking() {
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Only track if we're in the browser
    if (typeof window === 'undefined') return;

    const milestones = [25, 50, 75, 100];

    // Create a sentinel element at the bottom of the page to detect scroll depth
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-depth-sentinel';
    sentinel.style.position = 'absolute';
    sentinel.style.bottom = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.visibility = 'hidden';

    // Find the main content area or use body
    const mainContent = document.getElementById('main-content') || document.body;
    if (!mainContent) return;

    // Append sentinel to main content
    mainContent.appendChild(sentinel);

    // Use IntersectionObserver to detect scroll milestones
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Calculate scroll depth based on intersection ratio
            const scrollDepth = Math.round(entry.intersectionRatio * 100);
            
            // Find the milestone that was reached
            for (const milestone of milestones) {
              if (scrollDepth >= milestone && !trackedMilestones.current.has(milestone)) {
                trackedMilestones.current.add(milestone);
                trackScrollDepth(milestone);
                break; // Only track the highest milestone reached
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: milestones.map(m => m / 100),
      }
    );

    // Alternative approach: Use scroll event with throttling for more accurate tracking
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollableHeight = documentHeight - windowHeight;
          const scrollPercentage = scrollableHeight > 0 
            ? Math.round((scrollTop / scrollableHeight) * 100)
            : 0;

          // Track milestones
          for (const milestone of milestones) {
            if (scrollPercentage >= milestone && !trackedMilestones.current.has(milestone)) {
              trackedMilestones.current.add(milestone);
              trackScrollDepth(milestone);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Use scroll event for more reliable tracking
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
      trackedMilestones.current.clear();
    };
  }, []);
}
