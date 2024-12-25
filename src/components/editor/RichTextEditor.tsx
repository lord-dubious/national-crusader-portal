import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState } from 'react';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { LinkDialog } from './dialogs/LinkDialog';
import { MediaDialog } from './dialogs/MediaDialog';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  className?: string;
}

export const RichTextEditor = ({ value = "", onChange, className }: RichTextEditorProps) => {
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
      <div className={className}>
        <EditorToolbar
          editor={editor}
          onOpenLinkDialog={() => setIsLinkDialogOpen(true)}
          onOpenMediaDialog={() => setIsMediaDialogOpen(true)}
        />
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[200px]"
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