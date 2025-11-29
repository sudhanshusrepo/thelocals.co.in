import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SERVICE_GROUPS, CATEGORY_ICONS, CATEGORY_DISPLAY_NAMES } from '../constants';
import NotFound from './NotFound';

export const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const groupName = decodeURIComponent(groupId || '');
    const group = SERVICE_GROUPS[groupName];

    if (!group) {
        return <NotFound />;
    }

    return (
        <div className="animate-fade-in pb-12">
            <Helmet>
                <title>{group.name} - Thelokals.com</title>
            </Helmet>

            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="text-4xl">{group.icon}</span>
                        {group.name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{group.helperText}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => navigate(`/service/${cat.toLowerCase()}`)}
                        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 group h-40"
                    >
                        <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                            {CATEGORY_ICONS[cat]}
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-200 text-center group-hover:text-teal-600 transition-colors">
                            {CATEGORY_DISPLAY_NAMES[cat]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
