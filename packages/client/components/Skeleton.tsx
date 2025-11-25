
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const HomeSkeleton = () => (
    <div className="space-y-8 animate-fade-in-up">
        <Skeleton height={40} />
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <Skeleton height={24} width="50%" />
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-xl h-28">
                                <Skeleton circle height={40} width={40} />
                                <Skeleton height={10} width="80%" className="mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SearchResultsSkeleton = () => (
    <div className="animate-fade-in">
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={40} width={100} className="rounded-full" />
            ))}
        </div>
        <Skeleton height={20} width={150} className="my-4" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    <Skeleton height={160} />
                    <div className="p-4">
                        <Skeleton height={24} width="70%" />
                        <Skeleton height={16} width="40%" className="mt-2" />
                        <Skeleton height={16} width="90%" className="mt-4" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const BookingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                    <Skeleton circle height={50} width={50} />
                    <div className="flex-grow">
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={16} width="40%" className="mt-2" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ProfileSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center space-x-4">
            <Skeleton circle height={80} width={80} />
            <div className="flex-grow">
                <Skeleton height={28} width="50%" />
                <Skeleton height={20} width="70%" className="mt-2" />
            </div>
        </div>
        <div className="space-y-4">
            <Skeleton height={40} count={3} />
        </div>
    </div>
);
