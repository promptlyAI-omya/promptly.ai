'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
    const router = useRouter();
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const registerUser = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const userInfo = await response.json();

            if (!response.ok) {
                throw new Error(userInfo.error || 'Registration failed');
            }

            toast.success('Account created! Please log in.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 space-y-8 glass rounded-2xl border border-white/5">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Create Account</h2>
                    <p className="mt-2 text-gray-400">Join the community</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={registerUser}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full glass-input px-4 py-3 rounded-lg"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
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
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:underline">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
