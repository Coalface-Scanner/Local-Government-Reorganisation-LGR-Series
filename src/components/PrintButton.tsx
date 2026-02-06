import { Printer } from 'lucide-react';
import { trackPrint } from '../utils/analytics';

interface PrintButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'icon';
}

export default function PrintButton({ className = '', variant = 'default' }: PrintButtonProps) {
  const handlePrint = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrintButton.tsx:12',message:'Print triggered',data:{pathname:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    trackPrint(window.location.pathname);
    
    // #region agent log
    const checkPrintMedia = () => {
      const mediaQuery = window.matchMedia('print');
      const isPrintActive = mediaQuery.matches;
      const root = document.getElementById('root');
      const mainContent = document.getElementById('main-content');
      const body = document.body;
      
      const rootStyles = root ? window.getComputedStyle(root) : null;
      const mainStyles = mainContent ? window.getComputedStyle(mainContent) : null;
      const bodyStyles = window.getComputedStyle(body);
      
      const rootRect = root?.getBoundingClientRect();
      const mainRect = mainContent?.getBoundingClientRect();
      
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrintButton.tsx:25',message:'Print media check BEFORE print',data:{isPrintActive,rootExists:!!root,mainContentExists:!!mainContent,rootDisplay:rootStyles?.display,rootOpacity:rootStyles?.opacity,rootVisibility:rootStyles?.visibility,rootWidth:rootRect?.width,rootHeight:rootRect?.height,mainDisplay:mainStyles?.display,mainOpacity:mainStyles?.opacity,mainVisibility:mainStyles?.visibility,mainWidth:mainRect?.width,mainHeight:mainRect?.height,bodyDisplay:bodyStyles.display,bodyOpacity:bodyStyles.opacity,bodyVisibility:bodyStyles.visibility},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    };
    checkPrintMedia();
    // #endregion
    
    // #region agent log
    const checkContentElements = () => {
      const contentSelectors = [
        '#main-content',
        'main',
        '#root > div',
        '[class*="min-h-screen"]',
        '[class*="bg-academic"]',
        '.academic-prose',
        '.editorial-layout',
        'article',
        'section'
      ];
      
      const results: Record<string, any> = {};
      contentSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const firstEl = elements[0] as HTMLElement;
          const styles = window.getComputedStyle(firstEl);
          const rect = firstEl.getBoundingClientRect();
          results[selector] = {
            count: elements.length,
            display: styles.display,
            opacity: styles.opacity,
            visibility: styles.visibility,
            width: rect.width,
            height: rect.height,
            flexGrow: styles.flexGrow,
            minHeight: styles.minHeight,
            hasText: firstEl.textContent?.trim().length > 0,
            childrenCount: firstEl.children.length
          };
        } else {
          results[selector] = { count: 0 };
        }
      });
      
      // Also check the root structure
      const root = document.getElementById('root');
      if (root) {
        const rootDiv = root.querySelector('div');
        if (rootDiv) {
          const rootStyles = window.getComputedStyle(rootDiv);
          const rootRect = rootDiv.getBoundingClientRect();
          results['#root > div (first child)'] = {
            display: rootStyles.display,
            flexDirection: rootStyles.flexDirection,
            height: rootRect.height,
            width: rootRect.width,
            childrenCount: rootDiv.children.length
          };
        }
      }
      
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrintButton.tsx:50',message:'Content elements check',data:results,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    };
    checkContentElements();
    // #endregion
    
    // #region agent log
    const checkPrintCSS = () => {
      const sheets = Array.from(document.styleSheets);
      let printRulesFound = 0;
      let printRulesWithContent = 0;
      
      sheets.forEach((sheet, idx) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach(rule => {
            if (rule instanceof CSSMediaRule && rule.media.mediaText.includes('print')) {
              printRulesFound++;
              const ruleText = rule.cssText;
              if (ruleText.includes('display') || ruleText.includes('opacity') || ruleText.includes('visibility')) {
                printRulesWithContent++;
              }
            }
          });
        } catch (e) {
          // Cross-origin stylesheet, skip
        }
      });
      
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrintButton.tsx:72',message:'Print CSS check',data:{totalSheets:sheets.length,printRulesFound,printRulesWithContent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    };
    checkPrintCSS();
    // #endregion
    
    // #region agent log
    window.addEventListener('beforeprint', () => {
      const root = document.getElementById('root');
      const mainContent = document.getElementById('main-content');
      const rootStyles = root ? window.getComputedStyle(root) : null;
      const mainStyles = mainContent ? window.getComputedStyle(mainContent) : null;
      const rootRect = root?.getBoundingClientRect();
      const mainRect = mainContent?.getBoundingClientRect();
      
      // Check if print media query is active
      const mediaQuery = window.matchMedia('print');
      
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrintButton.tsx:90',message:'beforeprint event fired',data:{printMediaActive:mediaQuery.matches,rootDisplay:rootStyles?.display,rootOpacity:rootStyles?.opacity,rootVisibility:rootStyles?.visibility,rootWidth:rootRect?.width,rootHeight:rootRect?.height,mainDisplay:mainStyles?.display,mainOpacity:mainStyles?.opacity,mainVisibility:mainStyles?.visibility,mainWidth:mainRect?.width,mainHeight:mainRect?.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }, { once: true });
    // #endregion
    
    window.print();
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handlePrint}
        className={`p-2 text-academic-neutral-700 hover:text-teal-700 transition-colors ${className}`}
        aria-label="Print this page"
        title="Print"
      >
        <Printer size={20} />
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handlePrint}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-academic-neutral-300 hover:border-teal-700 text-academic-neutral-700 hover:text-teal-700 font-display font-semibold transition-colors ${className}`}
        aria-label="Print this page"
      >
        <Printer size={18} />
        Print
      </button>
    );
  }

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold rounded-full transition-colors ${className}`}
      aria-label="Print this page"
    >
      <Printer size={18} />
      Print Page
    </button>
  );
}
