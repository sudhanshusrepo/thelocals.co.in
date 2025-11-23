import React from 'react';
import { StepProps } from '../../types';
import { Button } from '../Button';

export const GuidelinesStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Guidelines</h2>
        <p className="text-slate-500 mt-1">Please review our community standards.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 h-64 overflow-y-auto shadow-inner text-sm text-slate-600 space-y-3">
        <p><strong>1. Professionalism:</strong> Always arrive on time and maintain a professional demeanor with customers.</p>
        <p><strong>2. Safety:</strong> Follow all safety protocols relevant to your service category.</p>
        <p><strong>3. Respect:</strong> Treat all customers and fellow providers with respect and dignity. Discrimination of any kind is not tolerated.</p>
        <p><strong>4. Pricing:</strong> Adhere to the agreed-upon pricing. No hidden charges.</p>
        <p><strong>5. Quality:</strong> Strive to provide the highest quality service.</p>
        <p><strong>6. Privacy:</strong> Respect customer privacy and do not share their personal details.</p>
        <p>By accepting, you agree to TheLocals Terms of Service and Privacy Policy.</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg border border-brand-100">
        <input 
          type="checkbox" 
          id="accept" 
          className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
          checked={data.guidelinesAccepted}
          onChange={(e) => updateData({ guidelinesAccepted: e.target.checked })}
        />
        <label htmlFor="accept" className="text-sm font-medium text-brand-900 cursor-pointer">
          I accept the Social Guidelines & Terms
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={onNext} disabled={!data.guidelinesAccepted}>
          Review
        </Button>
      </div>
    </div>
  );
};