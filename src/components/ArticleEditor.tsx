import { useRef, useMemo } from 'react';
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
      } catch (error) {
        alert('Failed to upload image. Please try again.');
      }
    };
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
  ];

  return (
    <div className="article-editor">
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

        .article-editor .ql-editor blockquote {
          border-left: 4px solid #0f766e;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #525252;
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
