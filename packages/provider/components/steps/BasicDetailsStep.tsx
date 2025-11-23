import React from 'react';
import { StepProps } from '../../types';
import { Button } from '../Button';
import { Input, Select } from '../Input';

export const BasicDetailsStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const handleChange = (field: keyof typeof data, value: string) => {
    updateData({ [field]: value });
  };

  const isValid = data.fullName && data.dob && data.gender && data.city && data.locality;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Basic Details</h2>
        <p className="text-slate-500 mt-1">Tell us a bit about yourself.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Full Name (as per Govt ID)"
          placeholder="e.g. Rahul Sharma"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
            <Input
            label="Date of Birth"
            type="date"
            value={data.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
            />
             <Select
                label="Gender"
                value={data.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                ]}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input
            label="City"
            placeholder="e.g. Mumbai"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            />
            <Input
            label="Locality"
            placeholder="e.g. Andheri West"
            value={data.locality}
            onChange={(e) => handleChange('locality', e.target.value)}
            />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={onNext} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
};