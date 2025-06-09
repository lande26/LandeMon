
// import React, { useState, useEffect } from 'react';
// import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogIn, Tv, Film, TrendingUp, Eye } from 'lucide-react';
// import "../index.css"

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('trending');
//   const [movies, setMovies] = useState([]);
//   const [tvShows, setTvShows] = useState([]);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   // Mock data - replace with TMDB API calls
//   useEffect(() => {
//     // Mock popular movies
//     setMovies([
//       {
//         id: 1,
//         title: "The Dark Knight",
//         poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
//         rating: 9.0,
//         year: 2024,
//         genre: "Action, Crime",
//         overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham..."
//       },
//     ]);

//     // Mock TV shows
//     setTvShows([
//       {
//         id: 1,
//         title: "Breaking Bad",
//         poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
//         rating: 9.5,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "A high school chemistry teacher turned methamphetamine producer..."
//       },
//     ]);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       console.log('Searching for:', searchTerm);
//       // Navigate to search results
//     }
//   };

//   const handleStreamClick = () => {
//     setShowAuthModal(true);
//   };

//   const ContentCard = ({ item, type }) => (
//     <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-700">
//       <div className="relative">
//         <img 
//           src={item.poster}
//           alt={item.title}
//           className="w-full h-72 object-cover"
//         />
//         <div className="absolute top-2 right-2">
//           <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
//             <Star className="h-3 w-3 text-yellow-500 mr-1" />
//             {item.rating}
//           </span>
//         </div>
//         <div className="absolute top-2 left-2">
//           <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
//             {type === 'movie' ? <Film className="h-3 w-3 mr-1" /> : <Tv className="h-3 w-3 mr-1" />}
//             {type === 'movie' ? 'Movie' : 'TV Show'}
//           </span>
//         </div>
//       </div>
      
//       <div className="p-4">
//         <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
//         <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
//           <div className="flex items-center gap-1">
//             <Calendar className="h-3 w-3" />
//             <span>{item.year}</span>
//           </div>
//           <span className="text-gray-500">•</span>
//           <span>{item.genre}</span>
//         </div>
//         <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.overview}</p>
//         <button 
//           onClick={handleStreamClick}
//           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold"
//         >
//           <Play className="h-4 w-4 mr-2" />
//           Watch Now
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
//       <section className="py-16 px-6">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//             Your Gateway to Entertainment
//           </h1>
//           <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
//             Discover thousands of movies and TV shows. Stream the latest releases and timeless classics all in one place.
//           </p>
//         </div>
//       </section>

//       <section className="px-6 mb-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-center mb-8">
//             <div className="bg-gray-800 rounded-lg p-1 flex">
//               <button
//                 onClick={() => setActiveTab('trending')}
//                 className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
//                   activeTab === 'trending' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 <TrendingUp className="h-4 w-4 mr-2" />
//                 Trending
//               </button>
//               <button
//                 onClick={() => setActiveTab('movies')}
//                 className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
//                   activeTab === 'movies' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 <Film className="h-4 w-4 mr-2" />
//                 Movies
//               </button>
//               <button
//                 onClick={() => setActiveTab('tvshows')}
//                 className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
//                   activeTab === 'tvshows' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 <Tv className="h-4 w-4 mr-2" />
//                 TV Shows
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {activeTab === 'movies' && movies.map((movie) => (
//               <ContentCard key={movie.id} item={movie} type="movie" />
//             ))}
//             {activeTab === 'tvshows' && tvShows.map((show) => (
//               <ContentCard key={show.id} item={show} type="tv" />
//             ))}
//             {activeTab === 'trending' && [...movies.slice(0, 3), ...tvShows.slice(0, 3)].map((item, index) => (
//               <ContentCard key={index} item={item} type={index < 3 ? "movie" : "tv"} />
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-700">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <h3 className="text-4xl font-bold text-blue-400 mb-2">25K+</h3>
//               <p className="text-gray-300">Movies</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-purple-400 mb-2">15K+</h3>
//               <p className="text-gray-300">TV Shows</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-pink-400 mb-2">5M+</h3>
//               <p className="text-gray-300">Users</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-green-400 mb-2">24/7</h3>
//               <p className="text-gray-300">Streaming</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {showAuthModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-600">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-white">Join LandeMon</h2>
//               <button 
//                 onClick={() => setShowAuthModal(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <p className="text-gray-300 text-center mb-6">
//                 Sign up or log in to start streaming unlimited movies and TV shows
//               </p>
              
//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Create Account
//               </button>
              
//               <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center">
//                 <LogIn className="h-5 w-5 mr-2" />
//                 Sign In
//               </button>
              
//               <div className="text-center">
//                 <p className="text-gray-400 text-sm">
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
//         <div className="max-w-7xl mx-auto">
//           <div className="border-t border-gray-700 mt-8 pt-8 text-center">
//             <p className="text-gray-400">
//               © 2024 LandeMon. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;



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

  const ContentCard = ({ item, type }) => (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-700">
      <div className="relative">
        <img 
          src={item.poster}
          alt={item.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            {item.rating}
          </span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
            {type === 'movie' ? <Film className="h-3 w-3 mr-1" /> : <Tv className="h-3 w-3 mr-1" />}
            {type === 'movie' ? 'Movie' : 'TV Show'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{item.year}</span>
          </div>
          <span className="text-gray-500">•</span>
          <span>{item.genre}</span>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.overview}</p>
        <button 
          onClick={handleStreamClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold"
        >
          <Play className="h-4 w-4 mr-2" />
          Watch Now
        </button>
      </div>
    </div>
  );

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