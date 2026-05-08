import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon, NotificationsIcon, ProfileIcon } from '../ui/icons';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-[#14112E] text-white px-6 py-3">
      {/* Search */}
      <div className="flex-1 max-w-xs relative bg-white/30">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0AEC0]" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent rounded-full ml-2 text-[#A0AEC0] placeholder-white/30 focus:outline-none focus:ring-0 border-none"
          style={{
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-0 hover:bg-white/10 rounded transition">
          <NotificationsIcon className="w-8 h-8" />
        </button>

        <div className="relative">
          <button
            className="p-0 hover:bg-white/10 rounded transition"
            onClick={(e) => {
              e.stopPropagation();
              toggleProfileMenu();
            }}
          >
            <ProfileIcon className="w-6 h-6" />
          </button>

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-[#14112E] border border-white/10 rounded-lg shadow-lg py-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/profile');
                }}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/certifications');
                }}
              >
                Certifications
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
