import React from 'react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-slate-800">Become a Lokals Pro</h1>
        <p className="mt-4 text-slate-500 text-lg">
          Join our network of trusted professionals and start growing your business today. 
          Flexible hours, competitive rates, and a steady stream of customers.
        </p>
        <button 
          onClick={onStart}
          className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          Start Earning Now
        </button>
      </div>
      <div className="mt-12 text-sm text-slate-400">
        <p>Already a partner? <a href="#" className="font-semibold text-indigo-500">Sign In</a></p>
      </div>
    </div>
  );
};