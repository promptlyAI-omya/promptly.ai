export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-10 py-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">About Promptly.ai</h1>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/5 space-y-6 text-gray-300 leading-relaxed">
                <p>
                    Welcome to <strong>Promptly.ai</strong>, an open-source library dedicated to the art of AI Prompt Engineering.
                </p>
                <p>
                    Our mission is to democratize access to high-quality generative AI outputs.
                    Whether you are using Midjourney, DALL-E, or Stable Diffusion, getting the exact result you want can be tricky.
                </p>
                <p>
                    That's why we've curated over 10,000 prompts (and growing) — tested and verified to ensure they deliver stunning results.
                </p>

                <h2 className="text-2xl font-bold text-white pt-4">Free until Jan 1, 2026</h2>
                <p>
                    We believe in open access. This entire library is free to use for everyone until at least January 1, 2026.
                    After that, we plan to introduce optional premium features while keeping the core library accessible.
                </p>

                <h2 className="text-2xl font-bold text-white pt-4">Community Driven</h2>
                <p>
                    Promptly is built by creators, for creators.
                    We encourage you to <a href="/submit" className="text-white hover:underline">submit your own prompts</a> to the gallery.
                    Every submission is moderated to ensure safety and quality.
                </p>
            </div>
        </div>
    );
}
