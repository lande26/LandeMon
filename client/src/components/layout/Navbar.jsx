// //2 gpt edited
// // src/components/layout/Navbar.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search } from 'lucide-react';

// const Navbar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       // Navigate to search results page with query
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//       setSearchTerm("");
//       console.log('Searching for:', searchTerm);
//     }
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownOpen) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   return (
//     <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <Link to="/" className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300">
//                 LandeMon
//               </Link>
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link 
//               to="/" 
//               className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Home
//             </Link>

//             <Link 
//               to="/movies" 
//               className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               Movies
//             </Link>

//             <Link 
//               to="/shows" 
//               className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//             >
//               TV Shows
//             </Link>

//             {/* Genres Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleDropdown();
//                 }}
//                 className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
//               >
//                 Genres
//                 <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                   <Link to="/genre/action" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Action
//                   </Link>
//                   <Link to="/genre/comedy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Comedy
//                   </Link>
//                   <Link to="/genre/drama" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Drama
//                   </Link>
//                   <Link to="/genre/horror" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Horror
//                   </Link>
//                   <Link to="/genre/romance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Romance
//                   </Link>
//                   <Link to="/genre/thriller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Thriller
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Search Bar */}
//             <div className="flex items-center">
//               <form onSubmit={handleSearch} className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search movies, shows..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition duration-300"
//                 >
//                   <Search className="h-4 w-4" />
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="text-white hover:text-blue-400 focus:outline-none focus:text-blue-400"
//             >
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
//               {/* Mobile Search */}
//               <div className="mb-4">
//                 <form onSubmit={handleSearch} className="flex">
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-l-md focus:outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-3 py-2 rounded-r-md"
//                   >
//                     <Search className="h-4 w-4" />
//                   </button>
//                 </form>
//               </div>

//               <Link 
//                 to="/" 
//                 className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link 
//                 to="/movies" 
//                 className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Movies
//               </Link>
//               <Link 
//                 to="/shows" 
//                 className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
//                 onClick={() => setIsOpen(false)}
//               >
//                 TV Shows
//               </Link>

//               {/* Mobile Genres */}
//               <div className="px-3 py-2">
//                 <p className="text-gray-400 text-sm font-medium mb-2">Genres</p>
//                 <div className="space-y-1 ml-4">
//                   <Link to="/genre/action" className="text-white hover:text-blue-400 block py-1 text-sm" onClick={() => setIsOpen(false)}>
//                     Action
//                   </Link>
//                   <Link to="/genre/comedy" className="text-white hover:text-blue-400 block py-1 text-sm" onClick={() => setIsOpen(false)}>
//                     Comedy
//                   </Link>
//                   <Link to="/genre/drama" className="text-white hover:text-blue-400 block py-1 text-sm" onClick={() => setIsOpen(false)}>
//                     Drama
//                   </Link>
//                   <Link to="/genre/horror" className="text-white hover:text-blue-400 block py-1 text-sm" onClick={() => setIsOpen(false)}>
//                     Horror
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Star, Calendar, Clock, Menu, X, ChevronDown, Search, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300 flex items-center">
                <Play className="h-6 w-6 mr-2 text-blue-500" />
                LandeMon
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700"
            >
              Home
            </Link>

            <Link
              to="/movies"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700"
            >
              Movies
            </Link>

            <Link
              to="/shows"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700"
            >
              TV Shows
            </Link>

            <div className="flex items-center justify-center">
              <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 transition duration-300 ease-in-out"
                  />
                </div>
              </form>
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-3">
              <button className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700 flex items-center">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-400 focus:outline-none focus:text-blue-400"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2 border border-gray-700">
              <div className="mb-4">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-l-md focus:outline-none border border-gray-600"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded-r-md border border-blue-600"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <Link
                to="/"
                className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Movies
              </Link>
              <Link
                to="/shows"
                className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                TV Shows
              </Link>

              <div className="px-3 py-2 border-t border-gray-600 mt-4">
                <div className="flex flex-col space-y-2">
                  <button className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700 flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;