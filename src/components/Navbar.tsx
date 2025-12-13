'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/library', label: 'Library' },
        { href: '/resources', label: 'Resources' },
        { href: '/community', label: 'Community' },
        // About and Contact often in footer, but specific reqs mentioned pages
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
                    <div className="hidden md:flex items-center space-x-8">
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
                        <Link
                            href="/submit"
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10"
                        >
                            Submit Prompt
                        </Link>
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
                        <Link
                            href="/submit"
                            onClick={() => setIsOpen(false)}
                            className="bg-white/10 text-center py-2 rounded-lg text-white font-medium"
                        >
                            Submit Prompt
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
