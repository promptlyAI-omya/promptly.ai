'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useSession, signOut, signIn } from 'next-auth/react';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/library', label: 'Library' },
        { href: '/resources', label: 'Resources' },
        { href: '/community', label: 'Community' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 bg-black/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Promptly.ai
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-white ${pathname === link.href ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {session?.user?.role === 'ADMIN' && (
                            <Link href="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                                Admin
                            </Link>
                        )}

                        <div className="h-4 w-[1px] bg-white/10 mx-2"></div>

                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <User size={14} />
                                    {session.user.name?.split(' ')[0]}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                                <Link
                                    href="/submit"
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10"
                                >
                                    Submit
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => signIn()}
                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Login
                                </button>
                                <Link
                                    href="/signup"
                                    className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden glass border-t border-white/5">
                    <div className="flex flex-col p-4 space-y-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-base font-medium ${pathname === link.href ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="h-[1px] bg-white/5 w-full my-2"></div>

                        {session ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-400 px-2">
                                    <User size={16} />
                                    <span>{session.user.name}</span>
                                </div>
                                {session.user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="text-purple-400 font-medium"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/submit"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white/10 text-center py-2 rounded-lg text-white font-medium"
                                >
                                    Submit Prompt
                                </Link>
                                <button
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="text-left text-red-400 font-medium px-2"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { signIn(); setIsOpen(false); }}
                                    className="text-left text-gray-400 hover:text-white font-medium px-2"
                                >
                                    Login
                                </button>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white text-black text-center py-2 rounded-lg font-bold"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
