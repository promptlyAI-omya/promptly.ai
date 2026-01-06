"use client";

import { type Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Underline as UnderlineIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) {
        return null;
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt("Image URL");

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border-b border-gray-800 bg-gray-950 p-2 sticky top-0 z-10 flex flex-wrap items-center gap-1">
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 w-px h-6 bg-gray-800" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 w-px h-6 bg-gray-800" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 w-px h-6 bg-gray-800" />

            <button
                type="button"
                onClick={addLink}
                className={cn(
                    "rounded p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white",
                    editor.isActive("link") && "bg-gray-800 text-blue-400"
                )}
            >
                <LinkIcon className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="rounded p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white"
            >
                <ImageIcon className="h-4 w-4" />
            </button>

            <div className="flex-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="rounded p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="rounded p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50"
            >
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
}

function Toggle({
    children,
    pressed,
    onPressedChange,
    size = "default",
}: {
    children: React.ReactNode;
    pressed: boolean;
    onPressedChange: () => void;
    size?: "default" | "sm";
}) {
    return (
        <button
            type="button"
            onClick={onPressedChange}
            className={cn(
                "rounded p-1.5 transition-colors hover:bg-gray-800 text-gray-400",
                pressed ? "bg-gray-800 text-white" : "hover:text-white",
                size === "sm" && "p-1.5"
            )}
        >
            {children}
        </button>
    );
}
