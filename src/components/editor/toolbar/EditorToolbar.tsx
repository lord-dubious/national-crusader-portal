import { Editor } from '@tiptap/react';
import {
  Bold, Italic, List, ListOrdered, Quote,
  Heading1, Heading2, Undo, Redo, Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { EditorButton } from './EditorButton';

interface EditorToolbarProps {
  editor: Editor;
  onOpenLinkDialog: () => void;
  onOpenMediaDialog: () => void;
}

export const EditorToolbar = ({ editor, onOpenLinkDialog, onOpenMediaDialog }: EditorToolbarProps) => (
  <div className="border-b p-2 bg-muted/50 flex flex-wrap gap-1">
    <EditorButton
      onClick={() => editor.chain().focus().toggleBold().run()}
      isActive={editor.isActive('bold')}
      icon={Bold}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleItalic().run()}
      isActive={editor.isActive('italic')}
      icon={Italic}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      isActive={editor.isActive('bulletList')}
      icon={List}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      isActive={editor.isActive('orderedList')}
      icon={ListOrdered}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      isActive={editor.isActive('blockquote')}
      icon={Quote}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      isActive={editor.isActive('heading', { level: 1 })}
      icon={Heading1}
    />
    <EditorButton
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      isActive={editor.isActive('heading', { level: 2 })}
      icon={Heading2}
    />
    <EditorButton
      onClick={onOpenLinkDialog}
      isActive={editor.isActive('link')}
      icon={LinkIcon}
    />
    <EditorButton
      onClick={onOpenMediaDialog}
      icon={ImageIcon}
    />
    <EditorButton
      onClick={() => editor.chain().focus().undo().run()}
      icon={Undo}
    />
    <EditorButton
      onClick={() => editor.chain().focus().redo().run()}
      icon={Redo}
    />
  </div>
);