import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Copy, Tag } from 'lucide-react';
import ClientCopyButton from '@/components/ClientCopyButton';
import ExecutionBreakdown from '@/components/ExecutionBreakdown';
import ExpectationNote from '@/components/ExpectationNote';
// Making page server component for better SEO

export default async function PromptDetail({ params }: { params: { id: string } }) {
    const prompt = await prisma.prompt.findUnique({
        where: { id: params.id },
    });

    if (!prompt) {
        return <div className="text-center py-20">Prompt not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link href="/library" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
                        {prompt.imageUrl ? (
                            <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Preview Image</div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="text-sm text-purple-400 font-medium mb-2">{prompt.category}</div>
                        <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
                        <p className="text-gray-300 leading-relaxed">{prompt.desc}</p>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-200">Prompt</h3>
                        <ClientCopyButton text={prompt.fullPrompt} />
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg text-gray-300 font-mono text-sm break-words border border-white/5">
                        {prompt.fullPrompt}
                    </div>


                    {/* Execution Breakdown Integration */}
                    {prompt.showExecutionBreakdown && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ExecutionBreakdown
                                aiPercentage={prompt.aiPercentage}
                                manualSteps={prompt.manualSteps}
                                aiTools={prompt.aiTools}
                                manualTools={prompt.manualTools}
                            />
                            <ExpectationNote />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {prompt.tags.split(',').map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5 flex items-center">
                                <Tag className="w-3 h-3 mr-1" /> {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
