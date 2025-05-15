import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
/* import 'tiptap.css'  */// optional, for styling

const TiptapEditor = ({
   content,
   setContent,
}: {
   content: string
   setContent: (html: string) => void
}) => {
   const editor = useEditor({
      extensions: [StarterKit, Underline],
      content,
      onUpdate: ({ editor }) => {
         setContent(editor.getHTML())
      },
   })

   if (!editor) return null

   return (
      <div className="editor-wrapper space-y-2">
         <div className="flex flex-wrap gap-2 mb-2">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>Underline</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Ordered List</button>
            <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
            <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>H1</button>
            <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>H2</button>
            <button type="button" onClick={() => editor.chain().focus().undo().run()}>Undo</button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()}>Redo</button>
         </div>

         <EditorContent editor={editor} className="border rounded min-h-[200px] bg-white shadow" />
      </div>
   )
}

export default TiptapEditor
