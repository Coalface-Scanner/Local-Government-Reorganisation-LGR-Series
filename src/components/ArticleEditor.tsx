import { useRef, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../lib/supabase';

interface ArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ArticleEditor({ value, onChange, placeholder }: ArticleEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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

  // Custom handlers for quote styles
  const quoteHandler = (style: 'default' | 'large' | 'callout') => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (!range) return;

    // Get the selected text or current line
    let text = '';
    let startIndex = range.index;
    let length = range.length;

    if (length === 0) {
      // No selection - get current line
      const [line] = quill.getLine(range.index);
      startIndex = quill.getIndex(line);
      length = line.length();
      text = quill.getText(startIndex, length);
    } else {
      text = quill.getText(startIndex, length);
    }

    // Remove existing blockquote if present
    const format = quill.getFormat(range);
    if (format.blockquote) {
      quill.formatText(startIndex, length, 'blockquote', false);
    }

    // Delete the text
    quill.deleteText(startIndex, length);

    // Insert styled blockquote HTML
    const blockquoteClass = style === 'large' ? 'quote-large' : style === 'callout' ? 'quote-callout' : 'quote-default';
    const blockquoteHTML = `<blockquote class="${blockquoteClass}" data-style="${style}">${text}</blockquote>`;
    
    const delta = quill.clipboard.convert(blockquoteHTML);
    const Delta = (quill.constructor as typeof ReactQuill.Quill).import('delta');
    quill.updateContents(new Delta().retain(startIndex).concat(delta), 'user');
    quill.setSelection(startIndex + text.length + 1, 0);
  };

  // Section break handler
  const sectionBreakHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    const index = range.index;
    
    // Insert section break HTML
    const dividerHTML = '<hr class="section-break" />';
    const delta = quill.clipboard.convert(dividerHTML);
    const Delta = (quill.constructor as typeof ReactQuill.Quill).import('delta');
    quill.updateContents(new Delta().retain(index).concat(delta), 'user');
    quill.setSelection(index + 1, 0);
  };

  // Highlight box handler
  const highlightBoxHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (!range) return;

    // Get the selected text
    let text = '';
    let startIndex = range.index;
    let length = range.length;

    if (length === 0) {
      // No selection - get current line
      const [line] = quill.getLine(range.index);
      startIndex = quill.getIndex(line);
      length = line.length();
      text = quill.getText(startIndex, length);
    } else {
      text = quill.getText(startIndex, length);
    }

    if (!text.trim()) {
      // If empty, insert placeholder
      text = 'Important information';
    }

    // Delete the text
    quill.deleteText(startIndex, length);

    // Insert highlight box HTML
    const highlightHTML = `<span class="highlight-box">${text}</span>`;
    const delta = quill.clipboard.convert(highlightHTML);
    const Delta = (quill.constructor as typeof ReactQuill.Quill).import('delta');
    quill.updateContents(new Delta().retain(startIndex).concat(delta), 'user');
    quill.setSelection(startIndex + text.length, 0);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'highlight-box',
    'divider',
  ];

  // Add custom toolbar buttons and make toolbar sticky
  useEffect(() => {
    if (editorContainerRef.current) {
      const toolbar = editorContainerRef.current.querySelector('.ql-toolbar') as HTMLElement;
      if (toolbar) {
        // Add custom buttons if they don't exist
        if (!toolbar.querySelector('.custom-quote-buttons')) {
          const separator = document.createElement('span');
          separator.className = 'ql-formats';
          separator.innerHTML = '<span class="ql-separator"></span>';
          
          const quoteButtons = document.createElement('span');
          quoteButtons.className = 'ql-formats custom-quote-buttons';
          quoteButtons.innerHTML = `
            <button type="button" class="custom-btn-quote-default" title="Quote (Default)">"</button>
            <button type="button" class="custom-btn-quote-large" title="Quote (Large)">"</button>
            <button type="button" class="custom-btn-quote-callout" title="Quote (Call-out)">"</button>
            <button type="button" class="custom-btn-section-break" title="Section Break">━</button>
            <button type="button" class="custom-btn-highlight-box" title="Highlight Box">☐</button>
          `;
          
          toolbar.appendChild(separator);
          toolbar.appendChild(quoteButtons);

          // Add event listeners
          quoteButtons.querySelector('.custom-btn-quote-default')?.addEventListener('click', () => quoteHandler('default'));
          quoteButtons.querySelector('.custom-btn-quote-large')?.addEventListener('click', () => quoteHandler('large'));
          quoteButtons.querySelector('.custom-btn-quote-callout')?.addEventListener('click', () => quoteHandler('callout'));
          quoteButtons.querySelector('.custom-btn-section-break')?.addEventListener('click', sectionBreakHandler);
          quoteButtons.querySelector('.custom-btn-highlight-box')?.addEventListener('click', highlightBoxHandler);
        }

        // Make toolbar sticky
        const handleScroll = () => {
          const rect = toolbar.getBoundingClientRect();
          if (rect.top <= 0) {
            toolbar.classList.add('ql-sticky');
          } else {
            toolbar.classList.remove('ql-sticky');
          }
        };

        const editor = editorContainerRef.current.querySelector('.ql-container') as HTMLElement;
        if (editor) {
          editor.addEventListener('scroll', handleScroll);
          window.addEventListener('scroll', handleScroll);
          return () => {
            editor.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
          };
        }
      }
    }
  }, []);

  return (
    <div className="article-editor" ref={editorContainerRef}>
      <style>{`
        .article-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: inherit;
        }

        .article-editor .ql-editor {
          min-height: 400px;
          padding: 20px;
        }

        .article-editor .ql-editor h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .article-editor .ql-editor h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .article-editor .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .article-editor .ql-editor h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .article-editor .ql-editor h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .article-editor .ql-editor h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .article-editor .ql-editor p {
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 1rem;
        }

        /* Default blockquote - indented to the right */
        .article-editor .ql-editor blockquote,
        .article-editor .ql-editor blockquote.quote-default {
          border-left: 4px solid #0f766e;
          padding-left: 1.5rem;
          padding-right: 0;
          margin-left: 2rem;
          margin-right: 0;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: #525252;
        }

        /* Large blockquote */
        .article-editor .ql-editor blockquote.quote-large,
        .article-editor .ql-editor blockquote[data-style="large"] {
          border-left: 6px solid #0f766e;
          padding-left: 2rem;
          padding-right: 0;
          margin-left: 3rem;
          margin-right: 0;
          font-size: 1.25rem;
          line-height: 1.8;
          font-weight: 500;
          font-style: italic;
          color: #525252;
        }

        /* Call-out blockquote */
        .article-editor .ql-editor blockquote.quote-callout,
        .article-editor .ql-editor blockquote[data-style="callout"] {
          border-left: 6px solid #0f766e;
          border-top: 2px solid #0f766e;
          border-bottom: 2px solid #0f766e;
          border-right: 2px solid #0f766e;
          padding: 1.5rem 2rem;
          margin-left: 2rem;
          margin-right: 0;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          background: #f0fdfa;
          font-size: 1.125rem;
          line-height: 1.75;
          font-weight: 600;
          color: #134e4a;
          border-radius: 0 8px 8px 0;
          font-style: normal;
        }

        /* Section break divider */
        .article-editor .ql-editor hr.section-break {
          display: block;
          width: 100%;
          height: 2px;
          background: #0f766e;
          margin: 2rem 0;
          border: none;
          padding: 0;
        }

        /* Highlight box */
        .article-editor .ql-editor .highlight-box {
          display: inline-block;
          padding: 1rem 1.5rem;
          margin: 1rem 0;
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .article-editor .ql-editor code,
        .article-editor .ql-editor pre {
          background: #f5f5f5;
          border-radius: 4px;
        }

        .article-editor .ql-editor code {
          padding: 2px 6px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .article-editor .ql-editor pre {
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .article-editor .ql-editor pre.ql-syntax {
          background: #1e1e1e;
          color: #d4d4d4;
        }

        .article-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          border-radius: 8px;
        }

        .article-editor .ql-editor ul,
        .article-editor .ql-editor ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .article-editor .ql-editor li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        .article-editor .ql-toolbar {
          border: 1px solid #e5e5e5;
          border-radius: 8px 8px 0 0;
          background: #fafafa;
        }

        .article-editor .ql-container {
          border: 1px solid #e5e5e5;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .article-editor .ql-editor.ql-blank::before {
          color: #a3a3a3;
          font-style: normal;
        }

        /* Custom toolbar button styles */
        .article-editor .ql-toolbar .custom-quote-buttons {
          display: inline-flex;
          gap: 2px;
        }

        .article-editor .ql-toolbar .custom-quote-buttons button {
          width: 28px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          border-radius: 3px;
          font-size: 16px;
          line-height: 1;
        }

        .article-editor .ql-toolbar .custom-quote-buttons button:hover {
          background: #e5e5e5;
        }

        .article-editor .ql-toolbar .custom-quote-buttons .custom-btn-quote-default,
        .article-editor .ql-toolbar .custom-quote-buttons .custom-btn-quote-large,
        .article-editor .ql-toolbar .custom-quote-buttons .custom-btn-quote-callout {
          font-weight: bold;
        }

        .article-editor .ql-toolbar .custom-quote-buttons .custom-btn-section-break {
          font-size: 18px;
        }

        .article-editor .ql-toolbar .custom-quote-buttons .custom-btn-highlight-box {
          font-size: 18px;
        }

        /* Sticky toolbar */
        .article-editor .ql-toolbar.ql-sticky {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Start writing your article...'}
      />
    </div>
  );
}
