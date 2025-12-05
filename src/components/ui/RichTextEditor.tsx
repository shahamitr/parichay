'use client';

import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3H6v14h5a4 4 0 000-8 4 4 0 000-8zm-1 6V5h1a2 2 0 110 4h-1zm0 2h1a2 2 0 110 4h-1v-4z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3h6v2h-2l-4 10h2v2H6v-2h2l4-10H10V3z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Underline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15a5 5 0 01-5-5V3h2v7a3 3 0 006 0V3h2v7a5 5 0 01-5 5zm-5 2h10v2H5v-2z" />
          </svg>
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h1v1H3V4zm0 3h1v1H3V7zm0 3h1v1H3v-1zm3-6h11v2H6V4zm0 4h11v2H6V8zm0 4h11v2H6v-2z" />
          </svg>
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-medium"
          title="Heading"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-medium"
          title="Subheading"
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<p>')}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm"
          title="Paragraph"
        >
          P
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="p-2 hover:bg-gray-200 rounded text-xs"
          title="Clear Formatting"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3v1H6v2h1v7a1 1 0 001 1h4a1 1 0 001-1V6h1V4h-4V3h-1zm-2 3h4v7H8V6z" />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      <style dangerouslySetInnerHTML={{ __html: `[contenteditable]:empty:before { content: attr(data-placeholder); color: #9ca3af; }` }} />
    </div>
  );
}
