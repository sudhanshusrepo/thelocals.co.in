import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '@core/services/bookingService';

interface LiveSearchProps {
    onCancel: () => void;
    bookingId?: string;
}

export const LiveSearch: React.FC<LiveSearchProps> = ({ onCancel, bookingId }) => {
    const [status, setStatus] = useState('Searching for nearby professionals...');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate search progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 5;
            });
        }, 200);

        // Update status messages
        const statusTimer1 = setTimeout(() => {
            setStatus('Analyzing your requirements...');
        }, 2000);

        const statusTimer2 = setTimeout(() => {
            setStatus('Matching with best-rated professionals...');
        }, 4000);

        const statusTimer3 = setTimeout(() => {
            setStatus('Provider found! Preparing your booking...');
        }, 6000);

        // Navigate to booking confirmation after search completes
        const navigationTimer = setTimeout(() => {
            if (bookingId) {
                navigate(`/booking/${bookingId}`);
            }
        }, 7000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(statusTimer1);
            clearTimeout(statusTimer2);
            clearTimeout(statusTimer3);
            clearTimeout(navigationTimer);
        };
    }, [bookingId, navigate]);

    // Subscribe to booking updates if bookingId is provided
    useEffect(() => {
        if (!bookingId) return;

        const unsubscribe = bookingService.subscribeToBookingUpdates(bookingId, (booking) => {
            if (booking.worker) {
                setStatus('Provider matched! Redirecting...');
                setTimeout(() => {
                    navigate(`/booking/${bookingId}`);
                }, 1000);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [bookingId, navigate]);

    return (
        <div
            className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6"
            data-testid="live-search-screen"
        >
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

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-teal-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-xs">
                We are notifying the best rated professionals in your area.
            </p>

            <button
                onClick={onCancel}
                data-testid="cancel-search-button"
                className="px-8 py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                Cancel Request
            </button>
        </div>
    );
};
