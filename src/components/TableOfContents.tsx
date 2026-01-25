import { useEffect, useState } from 'react';
import { extractHeadings } from '../lib/utils';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: string | null;
  className?: string;
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!content) return;

    const extracted = extractHeadings(content);
    setHeadings(extracted);

    // Add IDs to actual DOM headings after render
    const addIdsToHeadings = () => {
      // Try multiple selectors to find the article element
      const articleElement = document.querySelector('article#article-content') ||
                             document.querySelector('article.academic-prose') || 
                             document.querySelector('article.prose') ||
                             document.querySelector('article');
      if (!articleElement) {
        // Retry if DOM not ready yet
        setTimeout(addIdsToHeadings, 100);
        return;
      }

      extracted.forEach(({ id, text, level }) => {
        const headings = Array.from(articleElement.querySelectorAll(`h${level}`));
        const heading = headings.find(
          h => h.textContent?.trim() === text && !h.id
        );
        if (heading && heading instanceof HTMLElement) {
          heading.id = id;
          // Add scroll-margin-top for better scroll positioning
          heading.style.scrollMarginTop = '80px';
        }
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(addIdsToHeadings, 200);
    });
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={`bg-slate-50 rounded-lg p-6 border border-slate-200 ${className}`} aria-label="Table of contents">
      <div className="flex items-center gap-2 mb-4">
        <List size={18} className="text-slate-700" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Contents</h2>
      </div>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 1}rem` }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                  // Update URL without scrolling
                  window.history.pushState(null, '', `#${id}`);
                }
              }}
              className={`block text-sm transition-colors ${
                activeId === id
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
