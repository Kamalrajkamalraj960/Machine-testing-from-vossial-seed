import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      toast.success(
        res.data.message || 'Account created successfully'
      );

      // Redirect ONLY to login
      navigate('/login');

    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <div className="p-8">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 dark:bg-blue-900/30 dark:text-blue-400">
              <UserPlus size={24} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Sign up to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
            />

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Sign Up'
              )}
            </button>

          </form>

          <p className="text-center text-slate-600 dark:text-slate-400 mt-6 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;
