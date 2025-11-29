import React, { useEffect, useRef, useState } from 'react';

export const HowItWorks: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementTop = rect.top;
                const elementHeight = rect.height;

                // Calculate progress when element is in viewport
                if (elementTop < windowHeight && elementTop + elementHeight > 0) {
                    const visibleHeight = Math.min(windowHeight - elementTop, elementHeight);
                    const progress = Math.min(Math.max(visibleHeight / elementHeight, 0), 1);
                    setScrollProgress(progress);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            icon: "🔍",
            title: "Search",
            description: "Find the service you need from our wide range of categories."
        },
        {
            icon: "📅",
            title: "Book",
            description: "Choose a professional and schedule a time that works for you."
        },
        {
            icon: "✨",
            title: "Relax",
            description: "Sit back while our verified experts take care of everything."
        }
    ];

    return (
        <div ref={containerRef} className="py-12 bg-white/50 dark:bg-slate-800/50 rounded-3xl backdrop-blur-sm my-8 overflow-hidden">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">How It Works</h2>
                <p className="text-slate-600 dark:text-slate-300">Simple steps to get your life sorted.</p>
            </div>

            {/* Horizontal Flow Container */}
            <div className="relative px-4 sm:px-6">
                {/* Animated Connector Line */}
                <div className="absolute top-6 sm:top-8 left-4 right-4 h-1 block">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>

                {/* Steps Grid */}
                <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-8 relative overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 hide-scrollbar">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[80%] md:w-auto flex flex-col items-center text-center group relative z-10 snap-center mx-auto"
                            style={{
                                opacity: scrollProgress > (index / steps.length) ? 1 : 0.5,
                                transform: `translateY(${scrollProgress > (index / steps.length) ? '0' : '20px'})`,
                                transition: 'all 0.5s ease-out'
                            }}
                        >
                            {/* Icon Circle with Pulse Animation */}
                            <div className={`
                                w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-full 
                                flex items-center justify-center text-xl sm:text-3xl mb-3 sm:mb-4 
                                shadow-lg border-4 
                                ${scrollProgress > (index / steps.length)
                                    ? 'border-teal-500 scale-110'
                                    : 'border-slate-200 dark:border-slate-700'
                                }
                                group-hover:scale-125 transition-all duration-300
                                relative
                            `}>
                                {step.icon}
                                {/* Pulse Ring */}
                                {scrollProgress > (index / steps.length) && (
                                    <div className="absolute inset-0 rounded-full border-2 border-teal-500 animate-ping opacity-75" />
                                )}
                            </div>

                            {/* Step Number Badge */}
                            <div className={`
                                absolute -top-2 left-1/2 -translate-x-1/2 
                                w-6 h-6 sm:w-8 sm:h-8 rounded-full 
                                flex items-center justify-center 
                                text-[10px] sm:text-xs font-bold text-white
                                ${scrollProgress > (index / steps.length)
                                    ? 'bg-gradient-to-br from-teal-500 to-emerald-500'
                                    : 'bg-slate-400 dark:bg-slate-600'
                                }
                                transition-all duration-300
                            `}>
                                {index + 1}
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1 sm:mb-2 mt-1 sm:mt-2">
                                {step.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm px-2">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
