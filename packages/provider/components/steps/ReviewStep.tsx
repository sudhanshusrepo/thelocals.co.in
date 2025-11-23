import React, { useState } from 'react';
import { StepProps, RegistrationStatus, ProviderDocument } from '../../types';
import { Button } from '../Button';
import { backend } from '../../services/backend';
import { useToast } from '../Toast';

export const ReviewStep: React.FC<StepProps> = ({ data, updateData, onBack }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
        const { error } = await backend.db.submitApplication(data);
        if (error) throw error;

        setSubmitted(true);
        updateData({ registrationStatus: RegistrationStatus.Pending });
        toast.success("Application submitted successfully!");
    } catch (e) {
        toast.error("Submission failed. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-6 py-10 animate-in zoom-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
        <p className="text-slate-600 max-w-xs mx-auto">
          Thanks, {data.fullName}. We are reviewing your documents. You will receive an SMS update within 24 hours.
        </p>
        <div className="pt-8">
            <Button onClick={() => window.location.reload()}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Review Application</h2>
        <p className="text-slate-500 mt-1">Please verify your details before submitting.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        <div className="p-4 flex justify-between">
          <span className="text-slate-500">Name</span>
          <span className="font-medium text-slate-900">{data.fullName}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-500">Mobile</span>
          <span className="font-medium text-slate-900">+91 {data.phoneNumber}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-500">DOB</span>
          <span className="font-medium text-slate-900">{data.dob}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-slate-500">Location</span>
          <span className="font-medium text-slate-900">{data.locality}, {data.city}</span>
        </div>
        <div className="p-4 flex justify-between">
            <span className="text-slate-500">Documents</span>
            <div className="flex gap-2">
                {Object.values(data.documents).filter((d: ProviderDocument) => d.status === 'verified' || d.previewUrl).length} uploaded
            </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Edit
        </Button>
        <Button className="flex-1" onClick={handleSubmit} isLoading={submitting}>
          Submit Application
        </Button>
      </div>
    </div>
  );
};