// import React, { useState, useEffect } from 'react';
// import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogOut, Tv, Film, TrendingUp, Eye, Settings, Heart } from 'lucide-react';
// import HeroSection from '../components/sections/HeroSection';
// import TrendingSection from '../components/sections/TrendingSection';
// import GenresSection from '../components/sections/GenresSection';
// import StatsSection from '../components/sections/StatsSection';
// import ContentRowSection from '../components/sections/ContentRowSection';
// import "../index.css";

// const UserHome = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('trending');
//   const [movies, setMovies] = useState([]);
//   const [tvShows, setTvShows] = useState([]);
//   const [featuredContent, setFeaturedContent] = useState(null);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);

//   // Mock user data - replace with actual user context/state management
//   const [user] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
//   });

//   // Mock data - replace with TMDB API calls
//   useEffect(() => {
//     // Mock popular movies
//     const mockMovies = [
//       {
//         id: 1,
//         title: "The Dark Knight",
//         poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
//         rating: 9.0,
//         year: 2024,
//         genre: "Action, Crime",
//         overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
//       },
//       {
//         id: 2,
//         title: "Inception",
//         poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
//         rating: 8.8,
//         year: 2024,
//         genre: "Sci-Fi, Thriller",
//         overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
//       },
//       {
//         id: 3,
//         title: "Interstellar",
//         poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop",
//         rating: 8.6,
//         year: 2024,
//         genre: "Sci-Fi, Drama",
//         overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
//       },
//       {
//         id: 4,
//         title: "Pulp Fiction",
//         poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
//         rating: 8.9,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
//       },
//       {
//         id: 5,
//         title: "The Matrix",
//         poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
//         rating: 8.7,
//         year: 2024,
//         genre: "Action, Sci-Fi",
//         overview: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix."
//       },
//       {
//         id: 6,
//         title: "Forrest Gump",
//         poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
//         rating: 8.8,
//         year: 2024,
//         genre: "Drama, Romance",
//         overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man."
//       }
//     ];

//     // Mock TV shows
//     const mockTvShows = [
//       {
//         id: 1,
//         title: "Breaking Bad",
//         poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
//         rating: 9.5,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family's future."
//       },
//       {
//         id: 2,
//         title: "Stranger Things",
//         poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
//         rating: 8.7,
//         year: 2024,
//         genre: "Drama, Fantasy",
//         overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces."
//       },
//       {
//         id: 3,
//         title: "The Crown",
//         poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
//         rating: 8.6,
//         year: 2024,
//         genre: "Biography, Drama",
//         overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century."
//       },
//       {
//         id: 4,
//         title: "Game of Thrones",
//         poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
//         rating: 9.3,
//         year: 2024,
//         genre: "Adventure, Drama",
//         overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
//       },
//       {
//         id: 5,
//         title: "The Office",
//         poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
//         rating: 8.9,
//         year: 2024,
//         genre: "Comedy",
//         overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium."
//       },
//       {
//         id: 6,
//         title: "Sherlock",
//         poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
//         rating: 9.1,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London."
//       }
//     ];

//     setMovies(mockMovies);
//     setTvShows(mockTvShows);
//     setFeaturedContent(mockMovies[0]); // Set first movie as featured
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       console.log('Searching for:', searchTerm);
//       // Navigate to search results
//     }
//   };

//   const handleWatchClick = (item) => {
//     console.log('Watch clicked for:', item.title);
//     // Navigate to video player page
//   };

//   const handleInfoClick = (item) => {
//     console.log('Info clicked for:', item.title);
//     // Navigate to details page
//   };

//   const handleGenreClick = (genre) => {
//     console.log('Genre clicked:', genre.name);
//     // Navigate to genre page
//   };

//   const handleLogout = () => {
//     console.log('Logging out...');
//     // Handle logout logic - clear tokens, redirect to home
//     // navigate('/');
//   };

//   const handleProfile = () => {
//     console.log('Navigate to profile');
//     // Navigate to profile page
//   };

//   const handleSettings = () => {
//     console.log('Navigate to settings');
//     // Navigate to settings page
//   };

//   const handleWatchlist = () => {
//     console.log('Navigate to watchlist');
//     // Navigate to watchlist page
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
//       {/* User Navigation Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//                 LandeMon
//               </h1>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <a href="/user" className="text-white hover:text-blue-400 transition-colors font-medium">
//                 Home
//               </a>
//               <a href="/user/movies" className="text-gray-300 hover:text-white transition-colors">
//                 Movies
//               </a>
//               <a href="/user/series" className="text-gray-300 hover:text-white transition-colors">
//                 TV Shows
//               </a>
//               <a href="/user/genres" className="text-gray-300 hover:text-white transition-colors">
//                 Genres
//               </a>
//               <button onClick={handleWatchlist} className="text-gray-300 hover:text-white transition-colors">
//                 My List
//               </button>
//             </nav>

//             {/* Search and User Menu */}
//             <div className="flex items-center space-x-4">
//               {/* Search */}
//               <form onSubmit={handleSearch} className="hidden sm:block">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search movies, TV shows..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full border border-gray-600 focus:border-blue-500 focus:outline-none w-64"
//                   />
//                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                 </div>
//               </form>

//               {/* User Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className="flex items-center space-x-2 bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
//                 >
//                   <img
//                     src={user.avatar}
//                     alt={user.name}
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {userDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2">
//                     <div className="px-4 py-3 border-b border-gray-700">
//                       <p className="text-white font-medium">{user.name}</p>
//                       <p className="text-gray-400 text-sm">{user.email}</p>
//                     </div>
                    
//                     <button
//                       onClick={handleProfile}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center"
//                     >
//                       <User className="h-4 w-4 mr-3 text-gray-400" />
//                       <span className="text-white">Profile</span>
//                     </button>
                    
//                     <button
//                       onClick={handleWatchlist}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center"
//                     >
//                       <Heart className="h-4 w-4 mr-3 text-gray-400" />
//                       <span className="text-white">My Watchlist</span>
//                     </button>
                    
//                     <button
//                       onClick={handleSettings}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center"
//                     >
//                       <Settings className="h-4 w-4 mr-3 text-gray-400" />
//                       <span className="text-white">Settings</span>
//                     </button>
                    
//                     <hr className="border-gray-700 my-2" />
                    
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center text-red-400"
//                     >
//                       <LogOut className="h-4 w-4 mr-3" />
//                       <span>Sign Out</span>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="md:hidden text-white hover:text-gray-300"
//               >
//                 {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           {isMenuOpen && (
//             <div className="md:hidden bg-gray-800 border-t border-gray-700">
//               <div className="px-2 pt-2 pb-3 space-y-1">
//                 <a href="/user" className="block px-3 py-2 text-white font-medium">
//                   Home
//                 </a>
//                 <a href="/user/movies" className="block px-3 py-2 text-gray-300 hover:text-white">
//                   Movies
//                 </a>
//                 <a href="/user/series" className="block px-3 py-2 text-gray-300 hover:text-white">
//                   TV Shows
//                 </a>
//                 <a href="/user/genres" className="block px-3 py-2 text-gray-300 hover:text-white">
//                   Genres
//                 </a>
//                 <button onClick={handleWatchlist} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
//                   My List
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Add top padding to account for fixed header */}
//       <div className="pt-16">
//         {/* Hero Section */}
//         <HeroSection 
//           featuredContent={featuredContent}
//           onWatchClick={handleWatchClick}
//           onInfoClick={handleInfoClick}
//         />

//         {/* Trending Section */}
//         <TrendingSection 
//           movies={movies}
//           tvShows={tvShows}
//           onItemClick={handleInfoClick}
//           onWatchClick={handleWatchClick}
//         />

//         {/* Content Row Sections */}
//         <ContentRowSection 
//           title="Popular Movies"
//           items={movies}
//           type="movies"
//           onItemClick={handleInfoClick}
//           onWatchClick={handleWatchClick}
//           icon="🎬"
//         />

//         <ContentRowSection 
//           title="Top TV Series"
//           items={tvShows}
//           type="series"
//           onItemClick={handleInfoClick}
//           onWatchClick={handleWatchClick}
//           icon="📺"
//         />

//         <ContentRowSection 
//           title="Continue Watching"
//           items={[...movies.slice(0, 3), ...tvShows.slice(0, 3)]}
//           type="mixed"
//           onItemClick={handleInfoClick}
//           onWatchClick={handleWatchClick}
//           icon="▶️"
//         />

//         <ContentRowSection 
//           title="Recently Added"
//           items={[...movies.slice(2, 5), ...tvShows.slice(2, 5)]}
//           type="mixed"
//           onItemClick={handleInfoClick}
//           onWatchClick={handleWatchClick}
//           icon="⭐"
//         />

//         {/* Genres Section */}
//         <GenresSection onGenreClick={handleGenreClick} />

//         {/* Stats Section */}
//         <StatsSection />
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div className="col-span-1 md:col-span-2">
//               <h3 className="text-2xl font-bold text-white mb-4">LandeMon</h3>
//               <p className="text-gray-400 mb-4">
//                 Your ultimate destination for streaming movies and TV shows. Watch anywhere, anytime.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/user/movies" className="hover:text-white transition-colors">Movies</a></li>
//                 <li><a href="/user/series" className="hover:text-white transition-colors">TV Shows</a></li>
//                 <li><a href="/user/genres" className="hover:text-white transition-colors">Genres</a></li>
//                 <li><button onClick={handleWatchlist} className="hover:text-white transition-colors">My List</button></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Account</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><button onClick={handleProfile} className="hover:text-white transition-colors">Profile</button></li>
//                 <li><button onClick={handleSettings} className="hover:text-white transition-colors">Settings</button></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 pt-8 text-center">
//             <p className="text-gray-400">
//               © 2024 LandeMon. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>

//       {/* Click outside to close dropdowns */}
//       {userDropdownOpen && (
//         <div 
//           className="fixed inset-0 z-30" 
//           onClick={() => setUserDropdownOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// };

// export default UserHome;



// import React, { useState, useEffect } from 'react';
// import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogOut, Tv, Film, TrendingUp, Eye, Settings, Heart } from 'lucide-react';
// import HeroSection from '../components/sections/HeroSection';
// import TrendingSection from '../components/sections/TrendingSection';
// import GenresSection from '../components/sections/GenresSection';
// import StatsSection from '../components/sections/StatsSection';
// import ContentRowSection from '../components/sections/ContentRowSection';
// import "../index.css";

// const UserHome = () => {
//   const [movies, setMovies] = useState([]);
//   const [tvShows, setTvShows] = useState([]);
//   const [featuredContent, setFeaturedContent] = useState(null);

//   // Mock data - replace with TMDB API calls
//   useEffect(() => {
//     // Mock popular movies
//     const mockMovies = [
//       {
//         id: 1,
//         title: "The Dark Knight",
//         poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
//         rating: 9.0,
//         year: 2024,
//         genre: "Action, Crime",
//         overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
//       },
//       {
//         id: 2,
//         title: "Inception",
//         poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
//         rating: 8.8,
//         year: 2024,
//         genre: "Sci-Fi, Thriller",
//         overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
//       },
//       {
//         id: 3,
//         title: "Interstellar",
//         poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop",
//         rating: 8.6,
//         year: 2024,
//         genre: "Sci-Fi, Drama",
//         overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
//       },
//       {
//         id: 4,
//         title: "Pulp Fiction",
//         poster: "https://images.unsplash.com/photo-1489599316487-e2ad7d45b31c?w=300&h=450&fit=crop",
//         rating: 8.9,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
//       },
//       {
//         id: 5,
//         title: "The Matrix",
//         poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
//         rating: 8.7,
//         year: 2024,
//         genre: "Action, Sci-Fi",
//         overview: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix."
//       },
//       {
//         id: 6,
//         title: "Forrest Gump",
//         poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
//         rating: 8.8,
//         year: 2024,
//         genre: "Drama, Romance",
//         overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man."
//       }
//     ];

//     // Mock TV shows
//     const mockTvShows = [
//       {
//         id: 1,
//         title: "Breaking Bad",
//         poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
//         rating: 9.5,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family's future."
//       },
//       {
//         id: 2,
//         title: "Stranger Things",
//         poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
//         rating: 8.7,
//         year: 2024,
//         genre: "Drama, Fantasy",
//         overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces."
//       },
//       {
//         id: 3,
//         title: "The Crown",
//         poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
//         rating: 8.6,
//         year: 2024,
//         genre: "Biography, Drama",
//         overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century."
//       },
//       {
//         id: 4,
//         title: "Game of Thrones",
//         poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
//         rating: 9.3,
//         year: 2024,
//         genre: "Adventure, Drama",
//         overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
//       },
//       {
//         id: 5,
//         title: "The Office",
//         poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
//         rating: 8.9,
//         year: 2024,
//         genre: "Comedy",
//         overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium."
//       },
//       {
//         id: 6,
//         title: "Sherlock",
//         poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
//         rating: 9.1,
//         year: 2024,
//         genre: "Crime, Drama",
//         overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London."
//       }
//     ];

//     setMovies(mockMovies);
//     setTvShows(mockTvShows);
//     setFeaturedContent(mockMovies[0]); // Set first movie as featured
//   }, []);

//   const handleWatchClick = (item) => {
//     console.log('Watch clicked for:', item.title);
//     // Navigate to video player page
//   };

//   const handleInfoClick = (item) => {
//     console.log('Info clicked for:', item.title);
//     // Navigate to details page
//   };

//   const handleGenreClick = (genre) => {
//     console.log('Genre clicked:', genre.name);
//     // Navigate to genre page
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
//       {/* Hero Section */}
//       <HeroSection 
//         featuredContent={featuredContent}
//         onWatchClick={handleWatchClick}
//         onInfoClick={handleInfoClick}
//       />

//       {/* Trending Section */}
//       <TrendingSection 
//         movies={movies}
//         tvShows={tvShows}
//         onItemClick={handleInfoClick}
//         onWatchClick={handleWatchClick}
//       />

//       {/* Content Row Sections */}
//       <ContentRowSection 
//         title="Popular Movies"
//         items={movies}
//         type="movies"
//         onItemClick={handleInfoClick}
//         onWatchClick={handleWatchClick}
//         icon="🎬"
//       />

//       <ContentRowSection 
//         title="Top TV Series"
//         items={tvShows}
//         type="series"
//         onItemClick={handleInfoClick}
//         onWatchClick={handleWatchClick}
//         icon="📺"
//       />

//       <ContentRowSection 
//         title="Continue Watching"
//         items={[...movies.slice(0, 3), ...tvShows.slice(0, 3)]}
//         type="mixed"
//         onItemClick={handleInfoClick}
//         onWatchClick={handleWatchClick}
//         icon="▶️"
//       />

//       <ContentRowSection 
//         title="Recently Added"
//         items={[...movies.slice(2, 5), ...tvShows.slice(2, 5)]}
//         type="mixed"
//         onItemClick={handleInfoClick}
//         onWatchClick={handleWatchClick}
//         icon="⭐"
//       />

//       {/* Genres Section */}
//       <GenresSection onGenreClick={handleGenreClick} />

//       {/* Stats Section */}
//       <StatsSection />

//       {/* Footer */}
//       <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div className="col-span-1 md:col-span-2">
//               <h3 className="text-2xl font-bold text-white mb-4">LandeMon</h3>
//               <p className="text-gray-400 mb-4">
//                 Your ultimate destination for streaming movies and TV shows. Watch anywhere, anytime.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/user/movies" className="hover:text-white transition-colors">Movies</a></li>
//                 <li><a href="/user/series" className="hover:text-white transition-colors">TV Shows</a></li>
//                 <li><a href="/user/genres" className="hover:text-white transition-colors">Genres</a></li>
//                 <li><a href="/user/watchlist" className="hover:text-white transition-colors">My List</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Account</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/user/profile" className="hover:text-white transition-colors">Profile</a></li>
//                 <li><a href="/user/settings" className="hover:text-white transition-colors">Settings</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 pt-8 text-center">
//             <p className="text-gray-400">
//               © 2024 LandeMon. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default UserHome;


import React, { useState, useEffect } from 'react';
import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogIn, Tv, Film, TrendingUp, Eye } from 'lucide-react';
import HeroSection from '../components/sections/HeroSection';
import TrendingSection from '../components/sections/TrendingSection';
import GenresSection from '../components/sections/GenresSection';
import StatsSection from '../components/sections/StatsSection';
import ContentRowSection from '../components/sections/ContentRowSection';
import { moviesAPI, tvShowsAPI, dataTransforms, imageUtils } from '../services/api';
import "../index.css";

const UserHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from TMDB API
  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trending movies and TV shows
        const [trendingMoviesResponse, trendingTVResponse] = await Promise.all([
          moviesAPI.getTrending(),
          tvShowsAPI.getTrending()
        ]);

        // Transform the data to match your component format
        const transformedMovies = trendingMoviesResponse.map(movie => ({
          id: movie.tmdbId || movie.id,
          title: movie.title,
          poster: imageUtils.getImageUrl(movie.posterPath),
          backdrop: imageUtils.getBackdropUrl(movie.backdropPath),
          rating: parseFloat((movie.voteAverage || 0).toFixed(1)),
          year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2024,
          genre: movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Action, Drama',
          overview: movie.overview || 'No overview available.',
          type: 'movie'
        }));

        const transformedTVShows = trendingTVResponse.map(show => ({
          id: show.tmdbId || show.id,
          title: show.name,
          poster: imageUtils.getImageUrl(show.posterPath),
          backdrop: imageUtils.getBackdropUrl(show.backdropPath),
          rating: parseFloat((show.voteAverage || 0).toFixed(1)),
          year: show.firstAirDate ? new Date(show.firstAirDate).getFullYear() : 2024,
          genre: show.genres ? show.genres.map(g => g.name).join(', ') : 'Drama, Thriller',
          overview: show.overview || 'No overview available.',
          numberOfSeasons: show.numberOfSeasons,
          type: 'tv'
        }));

        setMovies(transformedMovies);
        setTvShows(transformedTVShows);
        
        // Set featured content (first trending movie)
        if (transformedMovies.length > 0) {
          setFeaturedContent(transformedMovies[0]);
        }

        // Combine for trending section
        const combined = [...transformedMovies.slice(0, 10), ...transformedTVShows.slice(0, 10)];
        setTrendingContent(combined);

        // Fetch additional popular content if you have those endpoints
        try {
          const [popularMoviesResponse, popularTVResponse] = await Promise.all([
            moviesAPI.getPopular(1).catch(() => transformedMovies), // Fallback to trending if popular endpoint doesn't exist
            tvShowsAPI.getPopular(1).catch(() => transformedTVShows)
          ]);
          
          if (Array.isArray(popularMoviesResponse)) {
            const transformedPopMovies = popularMoviesResponse.map(movie => ({
              id: movie.tmdbId || movie.id,
              title: movie.title,
              poster: imageUtils.getImageUrl(movie.posterPath),
              backdrop: imageUtils.getBackdropUrl(movie.backdropPath),
              rating: parseFloat((movie.voteAverage || 0).toFixed(1)),
              year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2024,
              genre: movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Action, Drama',
              overview: movie.overview || 'No overview available.',
              type: 'movie'
            }));
            setPopularMovies(transformedPopMovies);
          } else {
            setPopularMovies(transformedMovies);
          }

          if (Array.isArray(popularTVResponse)) {
            const transformedPopTV = popularTVResponse.map(show => ({
              id: show.tmdbId || show.id,
              title: show.name,
              poster: imageUtils.getImageUrl(show.posterPath),
              backdrop: imageUtils.getBackdropUrl(show.backdropPath),
              rating: parseFloat((show.voteAverage || 0).toFixed(1)),
              year: show.firstAirDate ? new Date(show.firstAirDate).getFullYear() : 2024,
              genre: show.genres ? show.genres.map(g => g.name).join(', ') : 'Drama, Thriller',
              overview: show.overview || 'No overview available.',
              numberOfSeasons: show.numberOfSeasons,
              type: 'tv'
            }));
            setPopularTVShows(transformedPopTV);
          } else {
            setPopularTVShows(transformedTVShows);
          }
        } catch (popularError) {
          console.log('Popular content endpoints not available, using trending data');
          setPopularMovies(transformedMovies);
          setPopularTVShows(transformedTVShows);
        }

      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
        
        // Fallback to mock data if API fails
        const mockMovies = [
          {
            id: 1,
            title: "The Dark Knight",
            poster: "https://images.unsplash.com/photo-1594736797933-d0401ba3cd4f?w=300&h=450&fit=crop",
            rating: 9.0,
            year: 2024,
            genre: "Action, Crime",
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham..."
          }
        ];
        
        const mockTVShows = [
          {
            id: 1,
            title: "Breaking Bad",
            poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
            rating: 9.5,
            year: 2024,
            genre: "Crime, Drama",
            overview: "A high school chemistry teacher turned methamphetamine producer..."
          }
        ];
        
        setMovies(mockMovies);
        setTvShows(mockTVShows);
        setPopularMovies(mockMovies);
        setPopularTVShows(mockTVShows);
        setFeaturedContent(mockMovies[0]);
        setTrendingContent([...mockMovies, ...mockTVShows]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Error banner if API failed but we have fallback data */}
      {error && movies.length > 0 && (
        <div className="bg-yellow-600 text-white p-3 text-center">
          <p className="text-sm">Some content may not be up to date. {error}</p>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection 
        featuredContent={featuredContent}
        onWatchClick={handleWatchClick}
        onInfoClick={handleInfoClick}
      />

      {/* Trending Section */}
      <TrendingSection 
        movies={movies.slice(0, 6)}
        tvShows={tvShows.slice(0, 6)}
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
      />

      {/* Content Row Sections */}
      <ContentRowSection 
        title="Popular Movies"
        items={popularMovies.slice(0, 8)}
        type="movies"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="🎬"
      />

      <ContentRowSection 
        title="Top TV Series"
        items={popularTVShows.slice(0, 8)}
        type="series"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="📺"
      />

      <ContentRowSection 
        title="Recently Added"
        items={[...movies.slice(0, 4), ...tvShows.slice(0, 4)]}
        type="mixed"
        onItemClick={handleInfoClick}
        onWatchClick={handleWatchClick}
        icon="⭐"
      />

      {/* Genres Section */}
      <GenresSection onGenreClick={handleGenreClick} />

      {/* Stats Section */}
      <StatsSection />

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

export default UserHome;