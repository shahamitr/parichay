'use client';

import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';

interface AIGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: any) => void;
    currentName: string;
}

export default function AIGeneratorModal({
    isOpen,
    onClose,
    onGenerate,
    currentName,
}: AIGeneratorModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessType: '',
        tone: 'professional',
        highlights: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessName: currentName,
                    businessType: formData.businessType,
                    tone: formData.tone,
                    highlights: formData.highlights.split(',').map((s) => s.trim()),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await response.json();
            onGenerate(data);
            onClose();
        } catch (error) {
            console.error('Generation error:', error);
            // You might want to show an error toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="AI Magic Fill ✨"
            size="lg"
        >
            <div className="space-y-6">
                <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-900/30 rounded-lg p-4">
                    <p className="text-sm text-accent-800 dark:text-accent-300">
                        Let our AI assistant generate professional content for your microsite.
                        Just tell us a bit about your business!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Business Type / Industry *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Coffee Shop, IT Consulting, Gym"
                            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-accent-500 dark:focus:border-accent-500 focus:ring-accent-500 dark:focus:ring-accent-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                            value={formData.businessType}
                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Tone of Voice
                        </label>
                        <select
                            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-accent-500 dark:focus:border-accent-500 focus:ring-accent-500 dark:focus:ring-accent-500"
                            value={formData.tone}
                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        >
                            <option value="professional">Professional & Trustworthy</option>
                            <option value="friendly">Friendly & Welcoming</option>
                            <option value="luxury">Luxury & Premium</option>
                            <option value="minimalist">Minimalist & Clean</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Key Highlights (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="e.g., 24/7 service, organic ingredients, award-winning team (comma separated)"
                            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-accent-500 dark:focus:border-accent-500 focus:ring-accent-500 dark:focus:ring-accent-500 placeholder-neutral-400 dark:placeholder-neutral-500"
                            value={formData.highlights}
                            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent-600 dark:bg-accent-600 hover:bg-accent-700 dark:hover:bg-accent-700 border border-transparent rounded-md disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Content
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Drawer>
    );
}
