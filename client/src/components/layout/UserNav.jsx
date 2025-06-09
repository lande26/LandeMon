import React from 'react';
import { Play, Search, User, Menu, X, Home, Film, Tv, TrendingUp, Bell, LogOut, Settings, Heart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';

const UserNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const handleNavClick = (path) => {
    navigate(path);
    console.log(`Navigating to ${path}`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Handle logout logic - clear tokens, redirect to home
  };

  const handleProfile = () => {
    console.log('Navigate to profile');
    // Navigate to profile page
  };

  const handleSettings = () => {
    console.log('Navigate to settings');
    // Navigate to settings page
  };

  const handleWatchlist = () => {
    console.log('Navigate to watchlist');
    // Navigate to watchlist page
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
        : 'bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <div onClick={() => handleNavClick('/user')} className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Play className="h-5 w-5 text-white" fill="white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                LandeMon
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div
              onClick={() => handleNavClick('/user')}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-800/50 transition-all duration-200 group cursor-pointer"
            >
              <Home className="h-4 w-4 mr-2 text-blue-400" />
              Home
            </div>

            <div
              onClick={() => handleNavClick('/user/movies')}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
            >
              <Film className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
              Movies
            </div>

            <div
              onClick={() => handleNavClick('/user/shows')}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
            >
              <Tv className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
              TV Shows
            </div>

            <button
              onClick={handleWatchlist}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
            >
              <Heart className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
              My List
            </button>
          </div>

          {/* Search & User Menu */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 relative group">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/50 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-700/50 py-2">
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors flex items-center"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-white">Profile</span>
                  </button>
                  
                  <button
                    onClick={handleWatchlist}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors flex items-center"
                  >
                    <Heart className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-white">My Watchlist</span>
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-white">Settings</span>
                  </button>
                  
                  <hr className="border-gray-700/50 my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors flex items-center text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
            <div className="px-4 py-4 space-y-2">

              {/* Mobile Navigation Links */}
              <div
                onClick={() => {handleNavClick('/user'); setIsOpen(false);}}
                className="flex items-center px-4 py-3 text-white bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Home className="h-5 w-5 mr-3 text-blue-400" />
                Home
              </div>
              
              <div
                onClick={() => {handleNavClick('/user/movies'); setIsOpen(false);}}
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Film className="h-5 w-5 mr-3" />
                Movies
              </div>
              
              <div
                onClick={() => {handleNavClick('/user/series'); setIsOpen(false);}}
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Tv className="h-5 w-5 mr-3" />
                TV Shows
              </div>

              <button
                onClick={() => {handleWatchlist(); setIsOpen(false);}}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                <Heart className="h-5 w-5 mr-3" />
                My List
              </button>

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-gray-700/50 space-y-2">
                <div className="flex items-center px-4 py-2 bg-gray-800/30 rounded-lg">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {handleProfile(); setIsOpen(false);}}
                  className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </button>

                <button 
                  onClick={() => {handleSettings(); setIsOpen(false);}}
                  className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>

                <button 
                  onClick={() => {handleLogout(); setIsOpen(false);}}
                  className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {userDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setUserDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default UserNav;