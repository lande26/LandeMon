// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // // import Navbar from '../components/Navbar';
// // import axios from "axios";
// // const Home = () => (
// //   <div >
// //     {/* <Navbar /> */}
// //     <div className="container mx-auto p-6">
// //       <div className="text-center mt-12">
// //         <h1 className="text-4xl font-bold text-gray-800 mb-4">
// //           Welcome to LandeMon
// //         </h1>
// //         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //           Discover the latest trending movies and TV shows. Explore detailed information, watch trailers, and stream your favorites for free!
// //         </p>
// //         <div className="mt-8">
// //           <a
// //             href="/movies"
// //             className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
// //           >
// //             Explore Movies
// //           </a><br />
// //           <a
// //             href="/shows"
// //             className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ml-4"
// //           >
// //             Explore Shows
// //           </a>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // );

// // export default Home;


// //2nd gpt 
// // src/pages/Home.jsx
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Play, Star, Calendar, Clock} from 'lucide-react';

// const Home = () => {
//   const [featuredContent, setFeaturedContent] = useState([]);

//   useEffect(() => {
//     // Placeholder data - replace with actual API calls later
//     setFeaturedContent([
//       {
//         id: 1,
//         title: "Featured Movie",
//         description: "An amazing blockbuster that will keep you on the edge of your seat...",
//         backdrop: "https://images.unsplash.com/photo-1489599849497-2c4ce5b6b2b4?w=1200&h=600&fit=crop",
//         rating: 8.5,
//         year: 2024,
//         duration: "2h 30m"
//       }
//     ]);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Hero Section */}
//       <section className="relative h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
//         <img 
//           src="https://images.unsplash.com/photo-1489599849497-2c4ce5b6b2b4?w=1920&h=1080&fit=crop" 
//           alt="Hero Background" 
//           className="absolute inset-0 w-full h-full object-cover"
//         />
        
//         <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
//             Welcome to LandeMon
//           </h1>
//           <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
//             Discover unlimited entertainment with the latest movies and TV shows. 
//             Stream, explore, and enjoy premium content at your fingertips.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link
//               to="/movies"
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
//             >
//               <Play className="h-5 w-5" />
//               Explore Movies
//             </Link>
//             <Link
//               to="/shows"
//               className="flex items-center gap-2 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
//             >
//               <Star className="h-5 w-5" />
//               Explore TV Shows
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Section */}
//       <section className="py-16 px-6">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold mb-8 text-center">Featured Today</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[1, 2, 3, 4, 5, 6].map((item) => (
//               <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300 shadow-lg">
//                 <img 
//                   src={`https://images.unsplash.com/photo-${1580130544439 + item * 100000}-4ea242905d72?w=400&h=600&fit=crop`}
//                   alt={`Featured ${item}`}
//                   className="w-full h-80 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2">Featured Content {item}</h3>
//                   <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 text-yellow-500" />
//                       <span>8.{item}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       <span>2024</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       <span>2h 15m</span>
//                     </div>
//                   </div>
//                   <p className="text-gray-300 text-sm mb-4">
//                     An exciting adventure that takes you on a journey through amazing storytelling and spectacular visuals.
//                   </p>
//                   <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
//                     Watch Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-gray-800">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <h3 className="text-4xl font-bold text-blue-400 mb-2">10K+</h3>
//               <p className="text-gray-300">Movies</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-blue-400 mb-2">5K+</h3>
//               <p className="text-gray-300">TV Shows</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-blue-400 mb-2">1M+</h3>
//               <p className="text-gray-300">Users</p>
//             </div>
//             <div>
//               <h3 className="text-4xl font-bold text-blue-400 mb-2">24/7</h3>
//               <p className="text-gray-300">Streaming</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 text-center">
//         <div className="max-w-4xl mx-auto px-6">
//           <h2 className="text-4xl font-bold mb-6">Ready to Start Watching?</h2>
//           <p className="text-xl text-gray-300 mb-8">
//             Join millions of users who trust LandeMon for their entertainment needs.
//           </p>
//           <Link
//             to="/movies"
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
//           >
//             <Play className="h-5 w-5" />
//             Start Exploring
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogIn, Tv, Film, TrendingUp, Eye } from 'lucide-react';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mock data - replace with TMDB API calls
  useEffect(() => {
    // Mock popular movies
    setMovies([
      {
        id: 1,
        title: "The Dark Knight",
        poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
        rating: 9.0,
        year: 2024,
        genre: "Action, Crime",
        overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham..."
      },
    ]);

    // Mock TV shows
    setTvShows([
      {
        id: 1,
        title: "Breaking Bad",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
        rating: 9.5,
        year: 2024,
        genre: "Crime, Drama",
        overview: "A high school chemistry teacher turned methamphetamine producer..."
      },
    ]);
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
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your Gateway to Entertainment
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover thousands of movies and TV shows. Stream the latest releases and timeless classics all in one place.
          </p>
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
                  activeTab === 'trending' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
                  activeTab === 'movies' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="h-4 w-4 mr-2" />
                Movies
              </button>
              <button
                onClick={() => setActiveTab('tvshows')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center ${
                  activeTab === 'tvshows' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="h-4 w-4 mr-2" />
                TV Shows
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'movies' && movies.map((movie) => (
              <ContentCard key={movie.id} item={movie} type="movie" />
            ))}
            {activeTab === 'tvshows' && tvShows.map((show) => (
              <ContentCard key={show.id} item={show} type="tv" />
            ))}
            {activeTab === 'trending' && [...movies.slice(0, 3), ...tvShows.slice(0, 3)].map((item, index) => (
              <ContentCard key={index} item={item} type={index < 3 ? "movie" : "tv"} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-400 mb-2">25K+</h3>
              <p className="text-gray-300">Movies</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-400 mb-2">15K+</h3>
              <p className="text-gray-300">TV Shows</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-pink-400 mb-2">5M+</h3>
              <p className="text-gray-300">Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400 mb-2">24/7</h3>
              <p className="text-gray-300">Streaming</p>
            </div>
          </div>
        </div>
      </section>

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
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center">
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

      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
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