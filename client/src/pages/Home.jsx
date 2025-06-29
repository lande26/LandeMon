import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogIn, Tv, Film, TrendingUp, Eye } from 'lucide-react';
import HeroSection from '../components/sections/HeroSection';
import TrendingSection from '../components/sections/TrendingSection';
import GenresSection from '../components/sections/GenresSection';
import StatsSection from '../components/sections/StatsSection';
import ContentRowSection from '../components/sections/ContentRowSection';
import "../index.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [featuredContent, setFeaturedContent] = useState(null);

  // Mock data - replace with TMDB API calls
  useEffect(() => {
    // Mock popular movies
    const mockMovies = [
      {
        id: 1,
        title: "The Dark Knight",
        poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
        rating: 9.0,
        year: 2024,
        genre: "Action, Crime",
        overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
      },
      {
        id: 2,
        title: "Inception",
        poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
        rating: 8.8,
        year: 2024,
        genre: "Sci-Fi, Thriller",
        overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
      },
      {
        id: 3,
        title: "Interstellar",
        poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop",
        rating: 8.6,
        year: 2024,
        genre: "Sci-Fi, Drama",
        overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
      },
      {
        id: 4,
        title: "Pulp Fiction",
        poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
        rating: 8.9,
        year: 2024,
        genre: "Crime, Drama",
        overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
      },
      {
        id: 5,
        title: "The Matrix",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
        rating: 8.7,
        year: 2024,
        genre: "Action, Sci-Fi",
        overview: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix."
      },
      {
        id: 6,
        title: "Forrest Gump",
        poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
        rating: 8.8,
        year: 2024,
        genre: "Drama, Romance",
        overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man."
      }
    ];

    // Mock TV shows
    const mockTvShows = [
      {
        id: 1,
        title: "Breaking Bad",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
        rating: 9.5,
        year: 2024,
        genre: "Crime, Drama",
        overview: "A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family's future."
      },
      {
        id: 2,
        title: "Stranger Things",
        poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
        rating: 8.7,
        year: 2024,
        genre: "Drama, Fantasy",
        overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces."
      },
      {
        id: 3,
        title: "The Crown",
        poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
        rating: 8.6,
        year: 2024,
        genre: "Biography, Drama",
        overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century."
      },
      {
        id: 4,
        title: "Game of Thrones",
        poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
        rating: 9.3,
        year: 2024,
        genre: "Adventure, Drama",
        overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
      },
      {
        id: 5,
        title: "The Office",
        poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
        rating: 8.9,
        year: 2024,
        genre: "Comedy",
        overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium."
      },
      {
        id: 6,
        title: "Sherlock",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
        rating: 9.1,
        year: 2024,
        genre: "Crime, Drama",
        overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London."
      }
    ];

    setMovies(mockMovies);
    setTvShows(mockTvShows);
    setFeaturedContent(mockMovies[0]); // Set first movie as featured
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Navigate to search results
    }
  };

  const handleStreamClick = () => {
    setShowAuthModal(true);
  };

  const handleWatchClick = (item) => {
    console.log('Watch clicked for:', item.title);
    setShowAuthModal(true);
  };

  const handleInfoClick = (item) => {
    console.log('Info clicked for:', item.title);
    // Navigate to details page
  };

  const handleGenreClick = (genre) => {
    console.log('Genre clicked:', genre.name);
    // Navigate to genre page
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <HeroSection 
        featuredContent={featuredContent}
        onWatchClick={handleWatchClick}
        onInfoClick={handleInfoClick}
      />

      {/* Trending Section */}
      <TrendingSection 
        movies={movies}
        tvShows={tvShows}
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
      />

      {/* Content Row Sections */}
      <ContentRowSection 
        title="Popular Movies"
        items={movies}
        type="movies"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="🎬"
      />

      <ContentRowSection 
        title="Top TV Series"
        items={tvShows}
        type="series"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="📺"
      />

      <ContentRowSection 
        title="Recently Added"
        items={[...movies.slice(0, 3), ...tvShows.slice(0, 3)]}
        type="mixed"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="⭐"
      />

      {/* Genres Section */}
      <GenresSection onGenreClick={handleGenreClick} />

      {/* Stats Section */}
      <StatsSection />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Join LandeMon</h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-center mb-6">
                Sign up or log in to start streaming unlimited movies and TV shows
              </p>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                <User className="h-5 w-5 mr-2" />
                Create Account
              </button>
              
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                  Sign In
              </button>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 MD:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">LandeMon</h3>
              <p className="text-gray-400 mb-4">
                Your ultimate destination for streaming movies and TV shows. Watch anywhere, anytime.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Genres</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trending</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 LandeMon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
