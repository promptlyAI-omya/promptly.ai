import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Promptly.ai - AI Prompt Library',
    description: 'Curated high-quality prompts for Midjourney, DALL-E, & Stable Diffusion. Free until Jan 1, 2026.',
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
    openGraph: {
        title: 'Promptly.ai - AI Prompt Library',
        description: 'Find the best AI art prompts.',
        siteName: 'Promptly.ai',
        images: ['/og-image.jpg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                    {children}
                </main>
                <Footer />
                <Toaster position="bottom-right" theme="dark" />
            </body>
        </html>
    );
}
