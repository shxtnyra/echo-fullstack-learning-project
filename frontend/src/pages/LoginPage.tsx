import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/tracks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'AUTHENTICATION FAILED. CHECK CREDENTIALS.');
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
          <p className="text-[#666] text-sm uppercase tracking-wider">ACCESS GRANTED</p>
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
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="ENTER USERNAME"
            />
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
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="ENTER PASSWORD"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#666] text-sm">
            NO ACCOUNT?{' '}
            <Link to="/register" className="text-[#00ff88] hover:text-white transition-colors">
              REGISTER
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
