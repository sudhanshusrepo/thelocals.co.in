import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LiveSearchProps {
    onCancel: () => void;
}

export const LiveSearch: React.FC<LiveSearchProps> = ({ onCancel }) => {
    const [status, setStatus] = useState('Searching for nearby professionals...');
    const navigate = useNavigate();

    // Simulate finding a provider after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('Provider found! Connecting...');
            // In a real app, this would be triggered by a subscription update
            // For now, we'll just simulate the flow
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6">
            <div className="relative mb-12">
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-[-20px] bg-teal-500 rounded-full animate-pulse opacity-10"></div>

                <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center border-4 border-teal-500">
                    <span className="text-4xl animate-bounce">🔍</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">
                {status}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-xs">
                We are notifying the best rated professionals in your area.
            </p>

            <button
                onClick={onCancel}
                className="px-8 py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                Cancel Request
            </button>
        </div>
    );
};
