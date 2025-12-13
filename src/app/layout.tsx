import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { Providers } from "@/components/Providers";

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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Navbar />
                    <div className="pt-24 min-h-screen pb-12 px-6">
                        {children}
                        <Toaster position="bottom-right" theme="dark" />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
