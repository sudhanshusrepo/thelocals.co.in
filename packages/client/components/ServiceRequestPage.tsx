import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { aiService, AIAnalysisResult } from '@core/services/aiService';
import { CATEGORY_DISPLAY_NAMES, LOWERCASE_TO_WORKER_CATEGORY } from '../constants';
import { WorkerCategory, ServiceType } from '@core/types';
import NotFound from './NotFound';

interface ServiceRequestPageProps {
    onBook: (service: ServiceType, checklist: string[], estimatedCost: number) => void;
}

export const ServiceRequestPage: React.FC<ServiceRequestPageProps> = ({ onBook }) => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

    const selectedCategory = category ? LOWERCASE_TO_WORKER_CATEGORY[category.toLowerCase()] : undefined;

    if (!selectedCategory) {
        return <NotFound />;
    }

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        setIsAnalyzing(true);
        try {
            const result = await aiService.estimateService(input, CATEGORY_DISPLAY_NAMES[selectedCategory]);
            setAnalysis(result);
        } catch (error) {
            console.error("AI Analysis failed:", error);
            alert("Failed to analyze request. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleBook = () => {
        if (!analysis) return;

        // Create a temporary service object for the booking
        const tempService: ServiceType = {
            id: `custom-${Date.now()}`,
            name: `Custom ${CATEGORY_DISPLAY_NAMES[selectedCategory]} Service`,
            description: input,
            price: analysis.estimatedCost,
            duration: 'Variable'
        };

        onBook(tempService, analysis.checklist, analysis.estimatedCost);
    };

    return (
        <div className="animate-fade-in pb-24 max-w-2xl mx-auto">
            <Helmet>
                <title>Request {CATEGORY_DISPLAY_NAMES[selectedCategory]} - Thelokals.com</title>
            </Helmet>

            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Describe Your Request
                </h1>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    What do you need help with?
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`E.g., "My kitchen tap is leaking and needs a new washer" or "I need a ceiling fan installed in the bedroom"`}
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={!input.trim() || isAnalyzing}
                        className={`px-6 py-2 rounded-full font-bold text-white transition-all ${!input.trim() || isAnalyzing
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </span>
                        ) : (
                            'Analyze Request ✨'
                        )}
                    </button>
                </div>
            </div>

            {analysis && (
                <div className="animate-slide-up space-y-6">
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 mb-4 flex items-center gap-2">
                            <span>🤖</span> AI Estimate
                        </h3>

                        <div className="mb-6">
                            <p className="text-sm text-teal-700 dark:text-teal-300 mb-2 font-medium">Estimated Cost</p>
                            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                ₹{analysis.estimatedCost}
                            </div>
                            <p className="text-xs text-teal-600/70 mt-1">{analysis.reasoning}</p>
                        </div>

                        <div>
                            <p className="text-sm text-teal-700 dark:text-teal-300 mb-3 font-medium">Task Checklist</p>
                            <div className="space-y-2">
                                {analysis.checklist.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-teal-100 dark:border-teal-800/50">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-slate-700 dark:text-slate-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shadow-lg z-10">
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={handleBook}
                                className="w-full py-4 rounded-xl font-bold text-lg bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Book Now - ₹{analysis.estimatedCost}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
