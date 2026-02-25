import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const insertFormatting = (before: string, after: string = before) => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertImage = () => {
    if (!imageUrl) return;

    const imageTag = `\n<img src="${imageUrl}" alt="Image" class="w-full rounded-lg my-4" />\n`;
    onChange(value + imageTag);
    setImageUrl('');
    setShowImageInput(false);
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;

    const linkTag = `<a href="${linkUrl}" class="text-teal-700 hover:text-teal-900 underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    onChange(value + linkTag);
    setLinkUrl('');
    setLinkText('');
    setShowLinkInput(false);
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => insertFormatting('<strong>', '</strong>')}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Bold"
          aria-label="Bold text"
        >
          <Bold size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<em>', '</em>')}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Italic"
          aria-label="Italic text"
        >
          <Italic size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<ul>\n<li>', '</li>\n</ul>')}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Bullet List"
          aria-label="Insert bullet list"
        >
          <List size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<ol>\n<li>', '</li>\n</ol>')}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Numbered List"
          aria-label="Insert numbered list"
        >
          <ListOrdered size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Insert Link"
          aria-label="Insert link"
        >
          <LinkIcon size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
          title="Insert Image"
          aria-label="Insert image"
        >
          <ImageIcon size={18} aria-hidden="true" />
        </button>
      </div>

      {showImageInput && (
        <div className="bg-blue-50 border-b border-slate-300 p-3 space-y-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={insertImage}
              className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors"
            >
              Insert Image
            </button>
            <button
              type="button"
              onClick={() => { setShowImageInput(false); setImageUrl(''); }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showLinkInput && (
        <div className="bg-blue-50 border-b border-slate-300 p-3 space-y-2">
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="URL"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={insertLink}
              className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors"
            >
              Insert Link
            </button>
            <button
              type="button"
              onClick={() => { setShowLinkInput(false); setLinkUrl(''); setLinkText(''); }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <textarea
        id="rich-text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
      />

      <div className="bg-slate-50 border-t border-slate-300 px-3 py-2 text-xs text-slate-600">
        You can use HTML tags for formatting. Images and links can be inserted using the toolbar buttons.
      </div>
    </div>
  );
}
