 npm install'use client';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientCopyButton({ text }: { text: string }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
            <Copy size={14} /> Copy
        </button>
    );
}
