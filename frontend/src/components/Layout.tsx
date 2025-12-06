import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MEDIA_URL } from '../api/apiClient';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const mainNavItems = [
    { path: '/tracks', label: '>>> TRACKS', icon: '🎵' },
    { path: '/artists', label: 'ARTISTS', icon: '🎤' },
    { path: '/albums', label: 'ALBUMS', icon: '💿' },
    { path: '/sources', label: 'SOURCES', icon: '📻' },
    { path: '/tags', label: 'TAGS', icon: '🏷️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#1a1a1a] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">E</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wider">ECHO</span>
          </Link>
        </div>

        {/* General Menu */}
        <div className="p-4 border-b border-[#1a1a1a]">
          <div className="text-[#666] text-xs uppercase tracking-wider mb-3 font-semibold">
            GENERAL MENU
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#1a1a1a] text-[#00ff88] border-l-2 border-[#00ff88]'
                    : 'text-[#999] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="p-4 border-b border-[#1a1a1a] mt-auto">
          <div className="text-[#666] text-xs uppercase tracking-wider mb-3 font-semibold">
            SETTINGS
          </div>
          <Link
            to="/"
            className="block px-3 py-2 text-sm text-[#999] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            HELP CENTER
          </Link>
        </div>

        {/* User Profile */}
        {isAuthenticated && user && (
          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={`${MEDIA_URL}/${user.avatar}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#00ff88]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#00ff88] flex items-center justify-center">
                  <span className="text-[#00ff88] font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">
                  {user.name.toUpperCase()}
                </div>
                <div className="text-[#666] text-xs">USER ID: {user.id}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full px-3 py-2 text-xs bg-[#1a1a1a] hover:bg-[#222] text-[#999] hover:text-white transition-colors border border-[#1a1a1a]"
            >
              LOGOUT
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#111111] border-b border-[#1a1a1a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-white text-xl font-semibold">
                {location.pathname === '/tracks' && 'TRACKS OVERVIEW'}
                {location.pathname === '/artists' && 'ARTISTS OVERVIEW'}
                {location.pathname === '/albums' && 'ALBUMS OVERVIEW'}
                {location.pathname === '/sources' && 'SOURCES OVERVIEW'}
                {location.pathname === '/tags' && 'TAGS OVERVIEW'}
                {location.pathname === '/' && 'ECHO DASHBOARD'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 flex items-center justify-center text-[#999] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                🔔
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#999] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                ⋮
              </button>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm border border-[#1a1a1a] transition-colors"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a] p-6">{children}</main>
      </div>
    </div>
  );
};
