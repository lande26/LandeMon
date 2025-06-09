// import React, { useState, useEffect } from "react";
// import { Play, Search, User, LogIn, Menu, X, Home, Film, Tv, TrendingUp, Bell } from 'lucide-react';

// const Navbar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       console.log('Searching for:', searchTerm);
//       setSearchTerm("");
//     }
//   };

//   const handleNavClick = (path) => {
//     console.log('Navigating to:', path);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       isScrolled 
//         ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
//         : 'bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <div className="flex items-center">
//             <div onClick={() => handleNavClick('/')} className="flex items-center group cursor-pointer">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
//                   <Play className="h-5 w-5 text-white" fill="white" />
//                 </div>
//               </div>
//               <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
//                 LandeMon
//               </span>
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             <div
//               onClick={() => handleNavClick('/')}
//               className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
//             >
//               <Home className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
//               Home
//             </div>

//             <div
//               onClick={() => handleNavClick('/movies')}
//               className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
//             >
//               <Film className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
//               Movies
//             </div>

//             <div
//               onClick={() => handleNavClick('/shows')}
//               className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
//             >
//               <Tv className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
//               TV Shows
//             </div>

//             <div
//               onClick={() => handleNavClick('/trending')}
//               className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
//             >
//               <TrendingUp className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" />
//               Trending
//             </div>
//           </div>

//           {/* Search & Auth */}
//           <div className="hidden md:flex items-center space-x-4">

//             {/* Notifications */}
//             <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 relative group">
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>

//             {/* Auth Buttons */}
//             <div className="flex items-center space-x-2">
//               <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center">
//                 <LogIn className="h-4 w-4 mr-2" />
//                 Login
//               </button>
//               <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl">
//                 <User className="h-4 w-4 mr-2" />
//                 Sign Up
//               </button>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center space-x-3">

//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
//             <div className="px-4 py-4 space-y-2">

//               {/* Mobile Navigation Links */}
//               <div
//                 onClick={() => {handleNavClick('/'); setIsOpen(false);}}
//                 className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <Home className="h-5 w-5 mr-3" />
//                 Home
//               </div>
              
//               <div
//                 onClick={() => {handleNavClick('/movies'); setIsOpen(false);}}
//                 className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <Film className="h-5 w-5 mr-3" />
//                 Movies
//               </div>
              
//               <div
//                 onClick={() => {handleNavClick('/shows'); setIsOpen(false);}}
//                 className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <Tv className="h-5 w-5 mr-3" />
//                 TV Shows
//               </div>
              
//               <div
//                 onClick={() => {handleNavClick('/trending'); setIsOpen(false);}}
//                 className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <TrendingUp className="h-5 w-5 mr-3" />
//                 Trending
//               </div>

//               {/* Mobile Auth */}
//               <div className="pt-4 border-t border-gray-700/50 space-y-2">
//                 <button className="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
//                 <Link to ="/login">
//                   <LogIn className="h-5 w-5 mr-2" />
//                   Login
//                   </Link>
//                 </button>
//                 <button className="w-full flex items-center justify-center px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200">
//                   <Link to ="/signup">
//                   <User className="h-5 w-5 mr-2" />
//                   Sign Up
//                   </Link>
//                 </button>
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
import { Play, Search, User, LogIn, Menu, X, Home, Film, Tv, TrendingUp, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      setSearchTerm("");
    }
  };

  const handleNavClick = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
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
            <div onClick={() => handleNavClick(isAuthenticated ? '/user' : '/')} className="flex items-center group cursor-pointer">
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

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-4">

            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleLogin}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </button>
                <button 
                  onClick={handleSignUp}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign Up
                </button>
              </div>
            )}
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

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-700/50 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => {handleLogin(); setIsOpen(false);}}
                      className="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </button>
                    <button 
                      onClick={() => {handleSignUp(); setIsOpen(false);}}
                      className="w-full flex items-center justify-center px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Sign Up
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {handleLogout(); setIsOpen(false);}}
                    className="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;