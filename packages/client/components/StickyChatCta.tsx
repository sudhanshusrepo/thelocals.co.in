import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { useNavigate } from 'react-router-dom';

interface StickyChatCtaProps {
    serviceCategory?: string;
    onSend?: (content: { type: 'text' | 'audio' | 'video', data: string | Blob }) => void;
    placeholder?: string;
}

export const StickyChatCta: React.FC<StickyChatCtaProps> = ({ serviceCategory, onSend, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // If we are on a service page (serviceCategory is present), always show it
        if (serviceCategory) {
            setIsVisible(true);
            return;
        }

        // Otherwise (Landing Page), show on scroll up
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling up and not at the very top
            if (currentScrollY < lastScrollY && currentScrollY > 100) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY || currentScrollY < 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, serviceCategory]);

    const handleInputSend = (content: { type: 'text' | 'audio' | 'video', data: string | Blob }) => {
        if (onSend) {
            onSend(content);
        } else {
            // Generic flow from Landing Page
            // We'll navigate to a generic AI booking page with the query
            // For now, let's assume we can pass the query state
            // Since we don't have a generic AI page yet, let's default to 'general' category or similar
            // Or we can navigate to a new route /ai-request
            console.log("Generic AI request:", content);
            // TODO: Implement generic AI booking flow
            // navigate('/ai-booking', { state: { initialQuery: content } });
            alert("AI Booking flow from landing page coming soon!");
        }
    };

    if (!isVisible) return null;

    return (
        <ChatInput
            onSend={handleInputSend}
            className="mb-16 sm:mb-0 transition-transform duration-300 ease-in-out transform translate-y-0 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
            placeholder={placeholder || (serviceCategory ? `Tell us about your ${serviceCategory} needs...` : "Ask our AI to find a professional...")}
        />
    );
};
