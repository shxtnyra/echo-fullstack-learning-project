import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center py-20">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded flex items-center justify-center">
          <span className="text-black font-bold text-2xl">E</span>
        </div>
        <h1 className="text-6xl font-bold text-white tracking-wider">ECHO</h1>
      </div>
      <p className="text-[#666] text-xl mb-12 max-w-2xl mx-auto">
        MUSIC LIBRARY MANAGEMENT SYSTEM
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link
          to="/tracks"
          className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold transition-all uppercase text-sm tracking-wider"
        >
          TRACKS
        </Link>
        <Link
          to="/artists"
          className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold transition-all uppercase text-sm tracking-wider"
        >
          ARTISTS
        </Link>
        <Link
          to="/albums"
          className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold transition-all uppercase text-sm tracking-wider"
        >
          ALBUMS
        </Link>
      </div>

      {!isAuthenticated && (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#00ff88] text-[#00ff88] font-semibold transition-colors uppercase text-sm tracking-wider"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#1a1a1a] text-white font-semibold transition-colors uppercase text-sm tracking-wider"
          >
            REGISTER
          </Link>
        </div>
      )}
    </div>
  );
};
