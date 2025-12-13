export default function ResourcesPage() {
    const resources = [
        {
            title: "Midjourney Documentation",
            desc: "Official guide to parameters and commands.",
            link: "https://docs.midjourney.com"
        },
        {
            title: "Stable Diffusion LoRA Library",
            desc: "Civitai - The place to find models.",
            link: "https://civitai.com"
        },
        {
            title: "OpenAI DALL-E Guide",
            desc: "Best practices for prompting DALL-E.",
            link: "https://platform.openai.com/docs/guides/images"
        },
        {
            title: "Prompt Engineering Guide",
            desc: "Learn the art of talking to AI.",
            link: "https://www.promptingguide.ai"
        },
        {
            title: "Promptly.ai Blog",
            desc: "Coming soon - tips and tricks from our team.",
            link: "#"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Resources</h1>
                <p className="text-gray-400">Tools and guides to help you master AI art generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((res, i) => (
                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="glass p-6 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">{res.title}</h3>
                        <p className="text-gray-400 text-sm">{res.desc}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
