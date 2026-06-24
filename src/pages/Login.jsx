import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, ChevronLeft } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // prefilled default
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Forgot Password Flow States
  const [forgotFlow, setForgotFlow] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Check for Remembered Email on Mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('mednova_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    } else {
      setEmail('elena.rostova@mednova.org'); // default prefill
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid medical email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      await login(email, password);
      
      // Remember me handling
      if (rememberMe) {
        localStorage.setItem('mednova_remembered_email', email);
      } else {
        localStorage.removeItem('mednova_remembered_email');
      }

      addNotification(
        "Sign In Success",
        `Welcome to your MedNova portal session, logged in as ${email}.`,
        "system"
      );
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err || 'Invalid clinical portal credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!forgotEmail) {
      setForgotError('Please enter your email.');
      return;
    } else if (!emailRegex.test(forgotEmail)) {
      setForgotError('Invalid email format.');
      return;
    }

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
      addNotification(
        "Reset Link Sent",
        `Password recovery instructions sent to ${forgotEmail}. Link expires in 2 hours.`,
        "system"
      );
    }, 1000);
  };

  if (forgotFlow) {
    return (
      <div className="space-y-6 text-left">
        <button 
          onClick={() => {
            setForgotFlow(false);
            setForgotSuccess(false);
            setForgotEmail('');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-medical-teal transition-colors font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Sign In
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            Recover Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
            Enter your medical email address. We'll verify your credentials and send a password reset code.
          </p>
        </div>

        {forgotSuccess ? (
          <div className="space-y-4 p-5 rounded-2xl bg-medical-emerald/10 border border-medical-emerald/20 text-slate-800 dark:text-slate-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-medical-emerald shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Verification Link Sent</h4>
                <p className="text-xs font-light text-slate-500 dark:text-slate-400 leading-relaxed">
                  We've emailed recovery credentials to **{forgotEmail}**. Follow the instructions in the email to reset your key.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setForgotFlow(false);
                setForgotSuccess(false);
                setForgotEmail('');
              }}
              className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Medical Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError('');
                  }}
                  required
                  className={`block w-full pl-10 pr-3 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
                    forgotError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300'
                  }`}
                  placeholder="doctor@hospital.org"
                />
              </div>
              {forgotError && (
                <p className="text-[11px] text-rose-500 font-semibold">{forgotError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 disabled:opacity-60 shadow-lg shadow-medical-teal/15 transition-all cursor-pointer"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Locating Registry...
                </>
              ) : (
                'Send Recovery Link'
              )}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Sign In to MedNova
        </h2>
        <p className="text-sm text-slate-550 dark:text-slate-400 font-light">
          Or{' '}
          <Link to="/signup" className="font-semibold text-medical-teal hover:text-medical-emerald transition-colors hover:underline">
            create a new medical profile
          </Link>
        </p>
      </div>

      {errors.form && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-550 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Medical Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              required
              className={`block w-full pl-10 pr-3 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
                errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-350'
              }`}
              placeholder="doctor@hospital.org"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Password</label>
            <button 
              type="button"
              onClick={() => setForgotFlow(true)} 
              className="text-xs font-semibold text-slate-500 hover:text-medical-teal hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              required
              className={`block w-full pl-10 pr-10 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
                errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-350'
              }`}
              placeholder="••••••••"
            />
            {/* Show/Hide password toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.password}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-dark-border dark:bg-slate-950/40 text-medical-teal focus:ring-medical-teal"
            />
            <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Remember my email</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-teal disabled:opacity-60 shadow-lg shadow-medical-teal/15 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Validating Credentials...
            </>
          ) : (
            'Access Clinical Portal'
          )}
        </button>
      </form>
    </div>
  );
};
export default Login;
