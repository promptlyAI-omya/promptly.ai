'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function NewsletterForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error('Failed to subscribe');

            toast.success('Subscribed successfully! Welcome to the community.');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg glass-input bg-black/50 border border-white/10 focus:border-white/30 outline-none transition-all placeholder:text-gray-600"
                required
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Join'}
            </button>
        </form>
    );
}
