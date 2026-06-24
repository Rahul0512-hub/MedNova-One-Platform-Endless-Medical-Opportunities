import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { User, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, GraduationCap, School, Sparkles } from 'lucide-react';

export const Signup = () => {
  const { signup } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // State Management
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('1st Year');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.trim().length < 3) {
      newErrors.name = 'Full name must be at least 3 characters.';
    }

    if (!college || college.trim().length < 3) {
      newErrors.college = 'Please enter your medical college / institution name.';
    }

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid medical email format.';
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
      await signup(name, email, password, college, year);
      addNotification(
        "Account Created",
        `Welcome to MedNova, Dr. ${name}! Your profile at ${college} is active.`,
        "system"
      );
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err || 'Registration failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Create Medical Profile
        </h2>
        <p className="text-sm text-slate-550 dark:text-slate-400 font-light">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-medical-teal hover:text-medical-emerald hover:underline transition-colors">
            Sign in
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
        
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              required
              className={`block w-full pl-10 pr-3 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
                errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-350'
              }`}
              placeholder="Elena Rostova, MD"
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.name}</p>
          )}
        </div>

        {/* School/College Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Medical College / School</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <School className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={college}
              onChange={(e) => {
                setCollege(e.target.value);
                if (errors.college) setErrors(prev => ({ ...prev, college: '' }));
              }}
              required
              className={`block w-full pl-10 pr-3 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
                errors.college ? 'border-rose-500 focus:border-rose-500' : 'border-slate-350'
              }`}
              placeholder="Harvard Medical School"
            />
          </div>
          {errors.college && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.college}</p>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Academic Year / Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <GraduationCap className="h-4 w-4" />
            </div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-350 dark:bg-[#111827] dark:border-dark-border rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-medical-teal transition-all"
            >
              <option value="1st Year">1st Year (MS1)</option>
              <option value="2nd Year">2nd Year (MS2)</option>
              <option value="3rd Year">3rd Year (MS3)</option>
              <option value="4th Year">4th Year (MS4)</option>
              <option value="Resident / Fellow">Resident / Fellow</option>
              <option value="Practicing Doctor">Practicing Doctor</option>
            </select>
          </div>
        </div>

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
              className={`block w-full pl-10 pr-3 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
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
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Password</label>
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
              className={`block w-full pl-10 pr-10 py-2.5 bg-white border dark:bg-slate-950/40 dark:border-dark-border rounded-xl text-sm text-slate-850 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-medical-teal transition-all ${
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

        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-medical-teal shrink-0 mt-0.5" />
          <span>I consent to MedNova licensing registry synchronization standards.</span>
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
              Registering Profile...
            </>
          ) : (
            'Create Clinical Account'
          )}
        </button>
      </form>
    </div>
  );
};
export default Signup;
