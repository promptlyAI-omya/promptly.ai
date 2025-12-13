'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const callback = await signIn('credentials', {
            ...data,
            redirect: false
        });

        if (callback?.error) {
            toast.error(callback.error);
            setIsLoading(false);
        }

        if (callback?.ok && !callback?.error) {
            toast.success('Logged in successfully!');
            router.push('/');
            router.refresh();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 space-y-8 glass rounded-2xl border border-white/5">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Welcome Back</h2>
                    <p className="mt-2 text-gray-400">Sign in to your account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={loginUser}>
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-full glass-input px-4 py-3 rounded-lg"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full glass-input px-4 py-3 rounded-lg"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <div className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-white hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
