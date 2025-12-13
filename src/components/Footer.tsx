import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 mt-20 bg-black/40">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Promptly.ai</h3>
                        <p className="text-gray-400 max-w-sm">
                            The premier destination for high-quality AI prompts.
                            Free for everyone until Jan 1, 2026.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-white">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                            <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
                            <li><Link href="/admin/login" className="hover:text-white">Admin</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white">Terms of Use</Link></li>
                            <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Promptly.ai. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
