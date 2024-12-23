"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: true,
    injectCSS: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 bg-muted/50 flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={
              editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
            }
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={
              editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
            }
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("left").run();
            }}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().undo().run();
            }}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
