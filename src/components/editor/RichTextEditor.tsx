import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState, useEffect } from 'react';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { LinkDialog } from './dialogs/LinkDialog';
import { MediaDialog } from './dialogs/MediaDialog';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

export const RichTextEditor = ({ value = "", onChange }: RichTextEditorProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl('');
  };

  const handleImageSelect = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setIsMediaDialogOpen(false);
  };

  return (
    <>
      <div className="border rounded-lg">
        <EditorToolbar
          editor={editor}
          onOpenLinkDialog={() => setIsLinkDialogOpen(true)}
          onOpenMediaDialog={() => setIsMediaDialogOpen(true)}
        />
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[200px] bg-white text-black"
        />
      </div>

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        linkUrl={linkUrl}
        onLinkUrlChange={setLinkUrl}
        onSetLink={setLink}
      />

      <MediaDialog
        isOpen={isMediaDialogOpen}
        onOpenChange={setIsMediaDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};