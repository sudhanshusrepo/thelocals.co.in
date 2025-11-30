import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../../core/services/supabase';
import { AuthLayout, AuthField, AuthButton, AuthOAuthButton, AuthDivider } from '@core/components/auth';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      setLoading(false);
      return;
    }

    if (!isLogin && !fullName.trim()) {
      showToast("Please enter your full name.", "error");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Successfully signed in!", "success");
        onClose();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { fullName } },
        });
        if (signUpError) throw signUpError;
        showToast("Check your email for the confirmation link!", "success");
        onClose();
      }
    } catch (err: any) {
      if (err.message.includes("User already registered")) {
        showToast("A user with this email already exists. Try signing in instead.", "warning");
      } else {
        showToast(err.message || 'An unexpected error occurred.', "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <AuthLayout
      onClose={onClose}
      title={isLogin ? 'Welcome Back' : 'Create Account'}
      subtitle={isLogin ? 'Enter your details to sign in' : 'Join thelokals to connect with experts'}
    >
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
          data-testid="email-input"
          placeholder="john@example.com"
        />
        <AuthField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
          placeholder="••••••••"
          minLength={6}
          helperText="Password must be at least 6 characters long."
        />
        <AuthButton loading={loading} data-testid="submit-button">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => { setIsLogin(!isLogin); }} data-testid="toggle-auth-mode" className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};
