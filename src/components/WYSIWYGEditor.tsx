import { useEffect, useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Eye, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Enhanced toolbar configuration with more options
const getModules = (imageHandler: () => void) => ({
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      image: imageHandler
    }
  },
  clipboard: {
    matchVisual: false
  }
});

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet',
  'indent', 'align', 'direction',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

export default function WYSIWYGEditor({ value, onChange, placeholder, className }: WYSIWYGEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isQuillReady, setIsQuillReady] = useState(false);
  const [shouldRenderQuill, setShouldRenderQuill] = useState(false);
  const [quillError, setQuillError] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(() => typeof value === 'string' ? value : String(value || ''));
  const previousValueRef = useRef<string>(typeof value === 'string' ? value : String(value || ''));
  const quillKeyRef = useRef<number>(0);

  // Initialize Quill and mark as ready
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes('delta') || event.message?.includes('delt')) {
        // Force remount by incrementing key - only if not already in error state
        if (!quillError) {
          setQuillError(true);
          quillKeyRef.current += 1;
          setShouldRenderQuill(false);
          setTimeout(() => {
            setQuillError(false);
            setShouldRenderQuill(true);
          }, 300);
        }
      }
    };
    window.addEventListener('error', errorHandler);
    
    // Delay rendering ReactQuill to ensure it's safe to render
    const renderTimer = setTimeout(() => {
      setShouldRenderQuill(true);
    }, 150);
    
    // Wait for ReactQuill to be mounted, then initialize
    const initTimer = setTimeout(() => {
      if (quillRef.current && shouldRenderQuill) {
        try {
          const editor = quillRef.current.getEditor();
          editor.root.setAttribute('spellcheck', 'true');
          setIsQuillReady(true);
        } catch (error) {
          // Silently handle initialization errors
        }
      }
    }, 250);
    
    return () => {
      clearTimeout(renderTimer);
      clearTimeout(initTimer);
      window.removeEventListener('error', errorHandler);
    };
  }, [shouldRenderQuill]);
  
  // Sync external value to internal value only when Quill is ready and value prop changes
  useEffect(() => {
    const safeValue = typeof value === 'string' ? value : String(value || '');
    
    if (!isQuillReady || !quillRef.current) {
      // Initialize internal value with external value even if not ready
      if (safeValue !== previousValueRef.current) {
        previousValueRef.current = safeValue;
        setInternalValue(safeValue);
      }
      return;
    }
    
    // Only sync when value actually changed and Quill is ready
    if (safeValue !== previousValueRef.current) {
      previousValueRef.current = safeValue;
      
      // Update ReactQuill content directly via editor API to avoid delta issues
      // Only update via API if the change is significant to avoid rapid updates
      const updateTimer = setTimeout(() => {
        try {
          if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const currentContent = editor.root.innerHTML;
            // Only update if content actually differs significantly
            if (currentContent !== safeValue && safeValue.length > 0) {
              // Use setContents with HTML to avoid delta issues
              const delta = editor.clipboard.convert(safeValue);
              editor.setContents(delta, 'silent');
            }
            setInternalValue(safeValue);
          } else {
            setInternalValue(safeValue);
          }
        } catch (error) {
          // Fallback to value prop update
          setInternalValue(safeValue);
        }
      }, 100);
      
      return () => {
        clearTimeout(updateTimer);
      };
    }
  }, [value, isQuillReady]);

  // Image handler
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      try {
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('article-images')
          .getPublicUrl(filePath);

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', data.publicUrl);
          quill.setSelection(range.index + 1, 0);
        }
      } catch (_error) {
        alert('Failed to upload image. Please try again.');
      }
    };
  };

  // Make toolbar sticky
  useEffect(() => {
    if (!editorContainerRef.current || showPreview) return;

    const toolbar = editorContainerRef.current.querySelector('.ql-toolbar') as HTMLElement;
    const toolbarActions = editorContainerRef.current.querySelector('.editor-toolbar-actions') as HTMLElement;
    if (!toolbar) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = toolbar.getBoundingClientRect();
          const containerRect = editorContainerRef.current?.getBoundingClientRect();
          
          if (containerRect && rect.top <= 0 && containerRect.top < 0) {
            if (!isSticky) {
              setIsSticky(true);
              toolbar.classList.add('ql-sticky');
              if (toolbarActions) {
                toolbarActions.classList.add('ql-sticky-actions');
              }
            }
          } else {
            if (isSticky) {
              setIsSticky(false);
              toolbar.classList.remove('ql-sticky');
              if (toolbarActions) {
                toolbarActions.classList.remove('ql-sticky-actions');
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const editor = editorContainerRef.current.querySelector('.ql-container') as HTMLElement;
    if (editor) {
      editor.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        editor.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showPreview, isSticky]);

  // Enhanced modules with image handler - memoize to prevent recreation
  const enhancedModules = useMemo(() => getModules(imageHandler), []);


  return (
    <div className={`wysiwyg-editor-wrapper ${className || ''}`} ref={editorContainerRef}>
      <style>{`
        .wysiwyg-editor-wrapper {
          position: relative;
        }
        
        .wysiwyg-editor-wrapper .ql-snow {
          display: block !important;
          visibility: visible !important;
          width: 100%;
        }
        
        .wysiwyg-editor-wrapper .ql-snow .ql-toolbar {
          display: flex !important;
          visibility: visible !important;
        }
        
        .wysiwyg-editor-wrapper .ql-snow .ql-container {
          display: block !important;
          visibility: visible !important;
          width: 100%;
        }
        
        .wysiwyg-editor-wrapper .wysiwyg-quill-editor {
          display: block !important;
          visibility: visible !important;
          width: 100%;
        }
        
        .wysiwyg-editor-wrapper .wysiwyg-quill-editor .ql-snow {
          display: block !important;
        }
        
        .wysiwyg-editor-wrapper .ql-toolbar {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px 8px 0 0;
          padding: 12px;
          position: relative;
          z-index: 10;
        }
        
        .wysiwyg-editor-wrapper .ql-toolbar.ql-sticky {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          border-radius: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 12px;
          max-width: 100%;
          margin: 0;
        }
        
        .wysiwyg-editor-wrapper .editor-toolbar-actions.ql-sticky-actions {
          position: fixed;
          top: 57px;
          right: 0;
          left: 0;
          z-index: 999;
          border-radius: 0;
          max-width: 100%;
          margin: 0;
          padding: 8px 12px;
        }
        
        .wysiwyg-editor-wrapper .ql-container {
          min-height: 400px !important;
          font-size: 16px;
          font-family: inherit;
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          display: block !important;
          visibility: visible !important;
          height: auto !important;
        }
        
        .wysiwyg-editor-wrapper .ql-editor {
          min-height: 400px !important;
          padding: 20px;
          font-family: inherit;
          display: block !important;
          visibility: visible !important;
          height: auto !important;
        }
        
        .wysiwyg-editor-wrapper .ql-snow {
          display: block !important;
        }
        
        .wysiwyg-editor-wrapper .ql-snow .ql-container {
          display: block !important;
        }
        
        .wysiwyg-editor-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
        }
        
        .wysiwyg-editor-wrapper .preview-mode {
          min-height: 400px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          font-family: inherit;
          max-width: 100%;
          overflow-x: auto;
        }
        
        .wysiwyg-editor-wrapper .preview-mode * {
          max-width: 100%;
        }
        
        .wysiwyg-editor-wrapper .preview-mode h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .wysiwyg-editor-wrapper .preview-mode h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .wysiwyg-editor-wrapper .preview-mode h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        
        .wysiwyg-editor-wrapper .preview-mode h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .wysiwyg-editor-wrapper .preview-mode p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        
        .wysiwyg-editor-wrapper .preview-mode blockquote {
          border-left: 4px solid #0d9488;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #475569;
        }
        
        .wysiwyg-editor-wrapper .preview-mode ul,
        .wysiwyg-editor-wrapper .preview-mode ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .wysiwyg-editor-wrapper .preview-mode li {
          margin-bottom: 0.5rem;
        }
        
        .wysiwyg-editor-wrapper .preview-mode img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          border-radius: 8px;
        }
        
        .wysiwyg-editor-wrapper .preview-mode code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }
        
        .wysiwyg-editor-wrapper .preview-mode pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .wysiwyg-editor-wrapper .preview-mode a {
          color: #0d9488;
          text-decoration: underline;
        }
        
        .wysiwyg-editor-wrapper .preview-mode a:hover {
          color: #0f766e;
        }
        
        .wysiwyg-editor-wrapper .editor-toolbar-actions {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          align-items: center;
          justify-content: flex-end;
          margin-top: 8px;
        }
        
        .wysiwyg-editor-wrapper .ql-toolbar {
          border-top: 1px solid #e2e8f0 !important;
        }
        
      `}</style>
      
      {showPreview ? (
        <>
          <div className="editor-toolbar-actions preview-actions">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Switch to Edit Mode"
            >
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="preview-mode" dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">No content to preview</p>' }} />
        </>
      ) : (
        <>
          {quillError || !shouldRenderQuill ? (
            <div className="min-h-[400px] border border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
              <div className="text-slate-500">{quillError ? 'Reinitializing editor...' : 'Loading editor...'}</div>
            </div>
          ) : (() => {
            try {
              // Ensure value is always a valid string
              const safeInternalValue = typeof internalValue === 'string' ? internalValue : String(internalValue || '');
              
              return (
                <ReactQuill
                  key={`quill-${quillKeyRef.current}`}
                  ref={quillRef}
                  theme="snow"
                  value={safeInternalValue}
                  onChange={(newValue) => {
                    try {
                      const safeNewValue = newValue || '';
                      // Filter out error messages that might have been inserted
                      if (safeNewValue && (safeNewValue.includes("Cannot read properties") || safeNewValue.includes("reading 'delta'"))) {
                        // Restore previous value instead of error content
                        return;
                      }
                      setInternalValue(safeNewValue);
                      onChange(safeNewValue);
                    } catch (error) {
                      // Silently handle onChange errors
                    }
                  }}
                  modules={enhancedModules}
                  formats={formats}
                  placeholder={placeholder}
                  className="bg-white wysiwyg-quill-editor"
                  bounds="self"
                />
              );
            } catch (error) {
              // Trigger remount on error
              setQuillError(true);
              setTimeout(() => {
                quillKeyRef.current += 1;
                setQuillError(false);
                setShouldRenderQuill(false);
                setTimeout(() => setShouldRenderQuill(true), 200);
              }, 100);
              return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">Editor error. Reinitializing...</div>;
            }
          })()}
          <div className="editor-toolbar-actions">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Preview Content"
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
        </>
      )}
    </div>
  );
}
