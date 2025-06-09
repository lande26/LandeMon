import React from 'react';
import { 
  Zap, 
  Heart, 
  Laugh, 
  Ghost, 
  Sword, 
  Rocket, 
  Music, 
  Users, 
  Gamepad2, 
  Camera,
  Crown,
  TreePine
} from 'lucide-react';

const GenresSection = ({ onGenreClick }) => {
  const genres = [
    { id: 28, name: 'Action', icon: Zap, color: 'from-red-500 to-orange-500', count: '2.5K+' },
    { id: 35, name: 'Comedy', icon: Laugh, color: 'from-yellow-500 to-orange-500', count: '1.8K+' },
    { id: 18, name: 'Drama', icon: Heart, color: 'from-pink-500 to-rose-500', count: '3.2K+' },
    { id: 27, name: 'Horror', icon: Ghost, color: 'from-purple-500 to-indigo-500', count: '950+' },
    { id: 878, name: 'Sci-Fi', icon: Rocket, color: 'from-blue-500 to-cyan-500', count: '1.2K+' },
    { id: 10749, name: 'Romance', icon: Heart, color: 'from-pink-400 to-red-400', count: '1.5K+' },
    { id: 53, name: 'Thriller', icon: Zap, color: 'from-gray-600 to-gray-800', count: '1.7K+' },
    { id: 16, name: 'Animation', icon: Users, color: 'from-green-500 to-emerald-500', count: '800+' },
    { id: 80, name: 'Crime', icon: Sword, color: 'from-red-600 to-red-800', count: '1.1K+' },
    { id: 12, name: 'Adventure', icon: TreePine, color: 'from-emerald-500 to-teal-500', count: '1.9K+' },
    { id: 14, name: 'Fantasy', icon: Crown, color: 'from-purple-600 to-pink-600', count: '1.3K+' },
    { id: 10402, name: 'Music', icon: Music, color: 'from-indigo-500 to-purple-500', count: '650+' }
  ];

  const GenreCard = ({ genre }) => {
    const IconComponent = genre.icon;
    
    return (
      <div 
        onClick={() => onGenreClick && onGenreClick(genre)}
        className="group cursor-pointer relative overflow-hidden rounded-2xl p-6 h-32 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-90`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
        
        <div className="relative z-10">
          <IconComponent className="h-8 w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-white font-bold text-lg group-hover:text-xl transition-all duration-300">
            {genre.name}
          </h3>
        </div>
        
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">{genre.count} titles</p>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    );
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore by Genre
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover your next favorite movie or TV show by browsing through our extensive collection of genres
          </p>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => onGenreClick && onGenreClick({ name: 'All Genres' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View All Genres
          </button>
        </div>
      </div>
    </section>
  );
};

export default GenresSection;