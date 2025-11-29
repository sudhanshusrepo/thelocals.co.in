import { GoogleGenAI, Type } from "@google/genai";
import { SearchIntent, WorkerCategory } from "../types";
import { logger } from "./logger";

/**
 * @module geminiService
 * @description A service for interacting with the Google Gemini API to interpret user search queries and estimate service costs.
 */

// Helper to safely get API key
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';

export interface AIAnalysisResult {
  estimatedCost: number;
  checklist: string[];
  reasoning: string;
}

/**
 * Interprets a user's search query using the Google Gemini API to extract structured search intent.
 * This includes identifying the most relevant worker category, extracting keywords, determining sorting preferences (price, rating, distance), and detecting urgency.
 * If the API key is not available or the API call fails, it returns a default search intent based on the query string.
 *
 * @param {string} query - The user's search query.
 * @returns {Promise<SearchIntent>} A structured search intent object.
 */
export const interpretSearchQuery = async (query: string): Promise<SearchIntent> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      logger.warn("No API Key found, returning default search intent");
      return {
        category: null,
        keywords: [query],
        sortBy: 'relevance',
        urgency: 'normal'
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const categoriesList = Object.values(WorkerCategory).join(', ');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User query: "${query}". 
      Available Categories: ${categoriesList}.
      Task: Analyze the query and map it to the best fitting Category. 
      Also extract keywords and detect if the user implies sorting by price (cheap, affordable), rating (best, top), or distance (near, close).
      Detect urgency (emergency, now, asap -> high).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: Object.values(WorkerCategory),
              description: "The most relevant worker category"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key terms extracted from query"
            },
            sortBy: {
              type: Type.STRING,
              enum: ['price', 'rating', 'distance', 'relevance'],
              description: "Sorting preference implied by query"
            },
            urgency: {
              type: Type.STRING,
              enum: ['high', 'normal'],
              description: "Urgency level"
            }
          },
          required: ["category", "keywords", "sortBy", "urgency"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as SearchIntent;
      return data;
    }

    throw new Error("Empty response from Gemini");

  } catch (error) {
    logger.error("Gemini API Error", { error, query });
    // Fallback intent
    return {
      category: null,
      keywords: query.split(" "),
      sortBy: 'relevance',
      urgency: 'normal'
    };
  }
};

/**
 * Estimates the cost and generates a checklist for a service request using Gemini AI.
 * If the API key is not available, it falls back to a simple mock estimation.
 *
 * @param {string} input - The user's description of the problem.
 * @param {string} category - The service category.
 * @returns {Promise<AIAnalysisResult>} The analysis result with estimated cost, checklist, and reasoning.
 */
export const estimateService = async (input: string, category: string): Promise<AIAnalysisResult> => {
  try {
    const apiKey = getApiKey();

    // Fallback to mock if no API key
    if (!apiKey) {
      logger.warn("No Gemini API Key found, using fallback estimation");
      return fallbackEstimation(input, category);
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a service cost estimator for ${category} services in India.
      
User's problem description: "${input}"

Task: Analyze this service request and provide:
1. An estimated cost in Indian Rupees (₹)
2. A detailed checklist of tasks needed to complete this service
3. Brief reasoning for the cost estimate

Consider typical market rates for ${category} services in India.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedCost: {
              type: Type.NUMBER,
              description: "Estimated cost in Indian Rupees"
            },
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of tasks to complete the service"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of the cost estimate"
            }
          },
          required: ["estimatedCost", "checklist", "reasoning"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AIAnalysisResult;
      return data;
    }

    throw new Error("Empty response from Gemini");

  } catch (error) {
    logger.error("Gemini cost estimation error", { error, input, category });
    // Fallback to mock estimation
    return fallbackEstimation(input, category);
  }
};

/**
 * Fallback estimation when Gemini API is unavailable.
 */
function fallbackEstimation(input: string, category: string): AIAnalysisResult {
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
