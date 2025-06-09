import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Film, Tv, Star, Play, Info } from 'lucide-react';

const TrendingSection = ({ movies = [], tvShows = [], onItemClick, onWatchClick }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const allTrending = [
    ...movies.slice(0, 6).map(item => ({ ...item, type: 'movie' })),
    ...tvShows.slice(0, 6).map(item => ({ ...item, type: 'tv' }))
  ].sort(() => Math.random() - 0.5);

  const getDisplayItems = () => {
    switch (activeTab) {
      case 'movies':
        return movies.slice(0, 10).map(item => ({ ...item, type: 'movie' }));
      case 'series':
        return tvShows.slice(0, 10).map(item => ({ ...item, type: 'tv' }));
      default:
        return allTrending;
    }
  };

  const displayItems = getDisplayItems();
  const itemsPerView = 6;
  const maxIndex = Math.max(0, Math.ceil(displayItems.length / itemsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const TrendingCard = ({ item, index }) => (
    <div className="relative group cursor-pointer flex-shrink-0 w-64">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border border-gray-700">
        {/* Trending Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            #{index + 1}
          </div>
        </div>

        {/* Content Type Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {item.type === 'movie' ? <Film className="h-3 w-3" /> : <Tv className="h-3 w-3" />}
            {item.type === 'movie' ? 'Movie' : 'Series'}
          </div>
        </div>

        {/* Poster */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchClick && onWatchClick(item);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-300"
              >
                <Play className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick && onItemClick(item);
                }}
                className="bg-gray-800/80 text-white p-3 rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{item.year}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{item.rating}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{item.overview}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              Trending Now
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-1 flex">
            {[
              { key: 'all', label: 'All', icon: TrendingUp },
              { key: 'movies', label: 'Movies', icon: Film },
              { key: 'series', label: 'Series', icon: Tv }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === key 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {displayItems.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 border border-gray-600"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 border border-gray-600"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / Math.ceil(displayItems.length / itemsPerView))}%)`,
                width: `${Math.ceil(displayItems.length / itemsPerView) * 100}%`
              }}
            >
              {displayItems.map((item, index) => (
                <TrendingCard 
                  key={`${item.id}-${item.type}-${index}`} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {displayItems.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;