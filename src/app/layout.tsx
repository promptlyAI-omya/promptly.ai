import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: 'Promptly.ai - AI Prompt Library',
        template: '%s | Promptly.ai',
    },
    description: 'Discover curated high-quality AI prompts for Midjourney, DALL-E, & Stable Diffusion. Join our community of creators.',
    keywords: ['AI prompts', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'Generative AI', 'Art Prompts', 'Prompt Engineering'],
    authors: [{ name: 'Promptly.ai Team' }],
    creator: 'Promptly.ai',
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://prompty.ai'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://prompty.ai',
        title: 'Promptly.ai - Premium AI Prompt Marketplace',
        description: 'Unlock your creativity with professional AI art prompts. Community-driven, curated, and free.',
        siteName: 'Promptly.ai',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Promptly.ai - AI Prompt Library',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Promptly.ai - AI Prompt Library',
        description: 'Curated high-quality prompts for Midjourney, DALL-E, & Stable Diffusion.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
