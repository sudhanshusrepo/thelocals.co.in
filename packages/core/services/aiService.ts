import { ServiceType } from '../types';

export interface AIAnalysisResult {
    estimatedCost: number;
    checklist: string[];
    reasoning: string;
}

/**
 * @module aiService
 * @description Service for AI-powered estimation and task breakdown.
 */
export const aiService = {
    /**
     * Analyzes a user's service request and provides an estimate.
     * @param {string} input - The user's description of the problem.
     * @param {string} category - The service category.
     * @returns {Promise<AIAnalysisResult>} The analysis result.
     */
    async estimateService(input: string, category: string): Promise<AIAnalysisResult> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple keyword-based mock logic for demonstration
        const lowerInput = input.toLowerCase();
        let cost = 500;
        let checklist = ['General inspection'];
        let reasoning = 'Based on standard rates.';

        if (category.toLowerCase().includes('plumber')) {
            if (lowerInput.includes('leak')) {
                cost = 800;
                checklist = ['Locate leak source', 'Replace washer/seal', 'Test for leaks'];
                reasoning = 'Leak repair requires diagnostic time and parts.';
            } else if (lowerInput.includes('install') || lowerInput.includes('tap')) {
                cost = 400;
                checklist = ['Remove old fixture', 'Install new tap', 'Seal connections'];
                reasoning = 'Standard installation charge.';
            }
        } else if (category.toLowerCase().includes('electrician')) {
            if (lowerInput.includes('fan')) {
                cost = 450;
                checklist = ['Assemble fan', 'Mount to ceiling', 'Connect wiring', 'Test speed control'];
                reasoning = 'Fan installation standard rate.';
            } else if (lowerInput.includes('switch') || lowerInput.includes('socket')) {
                cost = 250;
                checklist = ['Isolate power', 'Replace switch unit', 'Test connection'];
                reasoning = 'Minor electrical repair.';
            }
        }

        // Add some randomness to make it feel "AI-like"
        cost = Math.round(cost * (0.9 + Math.random() * 0.2));

        return {
            estimatedCost: cost,
            checklist,
            reasoning
        };
    }
};
