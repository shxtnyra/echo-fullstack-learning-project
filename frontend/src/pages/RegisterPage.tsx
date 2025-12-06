import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH');
      return;
    }

    if (password.length < 8) {
      setError('PASSWORD MUST BE AT LEAST 8 CHARACTERS');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('USERNAME CAN ONLY CONTAIN LETTERS, NUMBERS AND UNDERSCORE');
      return;
    }

    setLoading(true);

    try {
      await register(username, password);
      navigate('/tracks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'REGISTRATION FAILED. TRY DIFFERENT USERNAME.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="bg-[#111111] border border-[#1a1a1a] p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded flex items-center justify-center">
              <span className="text-black font-bold">E</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-wider">ECHO</span>
          </div>
          <p className="text-[#666] text-sm uppercase tracking-wider">CREATE ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#1a1a1a] border border-red-500/50 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_]+$"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="ENTER USERNAME"
            />
            <p className="text-[#666] text-xs mt-1">3-20 CHARS, LETTERS, NUMBERS, _</p>
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="ENTER PASSWORD"
            />
            <p className="text-[#666] text-xs mt-1">MINIMUM 8 CHARACTERS</p>
          </div>

          <div>
            <label className="block text-[#999] text-xs uppercase tracking-wider mb-2">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="CONFIRM PASSWORD"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#666] text-sm">
            ALREADY HAVE ACCOUNT?{' '}
            <Link to="/login" className="text-[#00ff88] hover:text-white transition-colors">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
