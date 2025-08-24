"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code } from "lucide-react"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
  showPreview?: boolean
  className?: string
}

const RichTextEditor = ({ content, onContentChange, showPreview = false, className = "" }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onCreate: () => {
      // Add some basic CSS to ensure headings are visible
      const style = document.createElement('style')
      style.textContent = `
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
        .ProseMirror h3 { font-size: 1.17em; font-weight: bold; margin: 1em 0; }
        .ProseMirror p { margin: 1em 0; }
      `
      document.head.appendChild(style)
    },
    // Fix SSR hydration issues
    immediatelyRender: false,
  })

  if (!editor) {
    return <div className="border rounded-lg bg-card p-4">Loading editor...</div>
  }

  // Debug: Check what commands are available
  console.log('Editor capabilities:', {
    canHeading1: editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
    canHeading2: editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
    canHeading3: editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
    canBold: editor.can().chain().focus().toggleBold().run(),
    canItalic: editor.can().chain().focus().toggleItalic().run(),
    currentContent: editor.getHTML(),
  })

  return (
    <div className={`border rounded-lg bg-card ${className}`}>
      {/* Google Docs Style Toolbar */}
      <div className="border-b bg-muted/30 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant={editor.isActive('bold') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="h-8 w-8 p-0"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('italic') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="h-8 w-8 p-0"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('underline') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="h-8 w-8 p-0"
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                console.log('H1 clicked, current state:', editor.isActive('heading', { level: 1 }))
                editor.chain().focus().toggleHeading({ level: 1 }).run()
                console.log('After H1, state:', editor.isActive('heading', { level: 1 }))
              }}
              className="h-8 px-2 text-xs"
              title="Heading 1"
            >
              H1
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                console.log('H2 clicked, current state:', editor.isActive('heading', { level: 2 }))
                editor.chain().focus().toggleHeading({ level: 2 }).run()
                console.log('After H2, state:', editor.isActive('heading', { level: 2 }))
              }}
              className="h-8 px-2 text-xs"
              title="Heading 2"
            >
              H2
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                console.log('H3 clicked, current state:', editor.isActive('heading', { level: 3 }))
                editor.chain().focus().toggleHeading({ level: 3 }).run()
                console.log('After H3, state:', editor.isActive('heading', { level: 3 }))
              }}
              className="h-8 px-2 text-xs"
              title="Heading 3"
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant={editor.isActive('bulletList') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 w-8 p-0"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="h-8 w-8 p-0"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>



          {/* Special Elements */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('blockquote') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className="h-8 w-8 p-0"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('codeBlock') ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="h-8 w-8 p-0"
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>

          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )

  // Preview mode - shows content without toolbar
  if (showPreview) {
    return (
      <div className={`border rounded-lg bg-card ${className}`}>
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    )
  }
} 

export default RichTextEditor;