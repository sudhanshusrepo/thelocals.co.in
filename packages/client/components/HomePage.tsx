import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { SERVICE_GROUPS } from '../constants';
import { HowItWorks } from './HowItWorks';
import { Features } from './Features';

const OfferBanner: React.FC = () => (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md shadow-md">
        <p className="font-bold">20% off cleaning services!</p>
        <p>Use code CLEAN20 at checkout.</p>
    </div>
);

const EmergencyBanner: React.FC = () => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-md">
        <p className="font-bold">Emergency Help Needed?</p>
        <p>Call our 24/7 hotline at 1-800-123-4567.</p>
    </div>
);

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-fade-in-up">
            <Helmet>
                <title>Thelokals.com - Find and Book Local Services</title>
                <meta name="description" content="Thelokals.com is your one-stop platform to find, book, and manage services from skilled local professionals." />
            </Helmet>

            {/* Hero Section */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    What do you need help with?
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Select a category to get started with our AI-powered booking.
                </p>
            </div>

            {/* Service Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(SERVICE_GROUPS).map((group) => (
                    <button
                        key={group.name}
                        onClick={() => navigate(`/group/${encodeURIComponent(group.name)}`)}
                        className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 group"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-4 bg-${group.color}-100 dark:bg-${group.color}-900/30`}>
                            {group.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">
                            {group.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            {group.helperText}
                        </p>
                    </button>
                ))}
            </div>

            <div className="py-8">
                <HowItWorks />
                <div className="my-8">
                    <OfferBanner />
                </div>
                <Features />
                <div className="my-8">
                    <EmergencyBanner />
                </div>
            </div>
        </div>
    );
};
