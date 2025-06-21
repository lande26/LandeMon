import React, { useState } from 'react';
import { Play, Info, Search } from 'lucide-react';

const HeroSection = ({ featuredContent, onWatchClick, onInfoClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Navigate to search results
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="stars absolute inset-0"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="mt-15">
        <h1 className="text-6xl md:text-8xl font-bold  mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Your 
          <span className="text-white"> Cinematic Heaven.</span>
        </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
         <b>Discover unlimited entertainment with the latest movies, trending series, and timeless classics. Your next binge-watch awaits.
        </b>
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies, TV shows ...."
              className="w-full pl-12 pr-20 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 font-semibold"
            >
              <Search />
            </button>
          </div>
        </form>

        {/* Featured Content Preview */}
        {/* {featuredContent && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">Featured Today</h3>
            <div className="flex items-center gap-6">
              <img 
                src={featuredContent.poster} 
                alt={featuredContent.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div className="text-left flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">{featuredContent.title}</h4>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{featuredContent.overview}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onWatchClick(featuredContent)}
                    className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play
                  </button>
                  <button 
                    onClick={() => onInfoClick(featuredContent)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors flex items-center gap-2"
                  >
                    <Info className="h-4 w-4" />
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <style jsx="true">{`
        .stars {
          background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.8"/><circle cx="80" cy="10" r="0.5" fill="white" opacity="0.6"/><circle cx="50" cy="30" r="1.5" fill="white" opacity="0.4"/><circle cx="90" cy="70" r="1" fill="white" opacity="0.7"/><circle cx="10" cy="80" r="0.8" fill="white" opacity="0.5"/><circle cx="70" cy="60" r="0.6" fill="white" opacity="0.8"/><circle cx="30" cy="90" r="1.2" fill="white" opacity="0.3"/></svg>') repeat;
          animation: twinkle 3s ease-in-out infinite alternate;
        }
        
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;