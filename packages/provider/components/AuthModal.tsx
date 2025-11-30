import React, { useState } from 'react';
import { supabase } from '@core/services/supabase';
import { AuthLayout, AuthField, AuthButton, AuthOAuthButton, AuthDivider } from '@core/components/auth';

interface AuthModalProps {
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'signup' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            fullName,
                            role: 'provider' // Mark as provider
                        }
                    },
                });
                if (signUpError) throw signUpError;
                setSuccess(true);
            }
        } catch (err: any) {
            if (err.message.includes("User already registered")) {
                setError("A user with this email already exists. Try signing in instead.");
            } else {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });
        if (error) {
            setError(error.message);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="text-center animate-fade-in py-8">
                        <div className="inline-block bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check your inbox!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            We've sent a confirmation link to <strong className='text-slate-700 dark:text-slate-300'>{email}</strong>.
                        </p>
                        <button onClick={onClose} className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-200 dark:shadow-none">
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            onClose={onClose}
            title={isLogin ? 'Provider Sign In' : 'Become a Partner'}
            subtitle={isLogin ? 'Enter your details to access your dashboard' : 'Join as a service provider and grow your business'}
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <AuthOAuthButton
                    onClick={() => handleOAuthLogin('google')}
                    provider="google"
                    label="Continue with Google"
                />
            </div>

            <AuthDivider />

            <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                    <AuthField
                        label="Full Name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                    />
                )}
                <AuthField
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                />
                <AuthField
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    helperText="Password must be at least 6 characters long."
                />
                <AuthButton loading={loading}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </AuthButton>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};
