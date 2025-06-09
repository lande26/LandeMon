import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Play, Plus, ChevronDown } from 'lucide-react';

const ContentRowSection = ({ 
  title, 
  items = [], 
  type = 'mixed',
  onItemClick,
  onWatchClick,
  showMoreButton = true,
  icon 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const itemsPerView = 6;
  const maxIndex = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const ContentCard = ({ item, index }) => (
    <div 
      className="relative group cursor-pointer flex-shrink-0 w-48 transition-all duration-300"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => onItemClick && onItemClick(item)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800 group-hover:scale-110 group-hover:z-50 transition-all duration-300">
        {/* Poster */}
        <div className="relative h-72">
          <img 
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {item.rating}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onWatchClick && onWatchClick(item);
              }}
              className="bg-white text-black p-4 rounded-full hover:bg-gray-200 transition-colors transform scale-0 group-hover:scale-100 duration-300"
            >
              <Play className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Expanded Info Panel (appears on hover) */}
        {hoveredItem === item.id && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b-lg p-4 shadow-2xl z-50 transform translate-y-0 group-hover:block">
            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>{item.year}</span>
              <span>•</span>
              <span>{item.genre}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">{item.overview}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchClick && onWatchClick(item);
                }}
                className="flex-1 bg-white text-black py-2 px-3 rounded text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Play
              </button>
              <button className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors">
                <Plus className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick && onItemClick(item);
                }}
                className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!items.length) return null;

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            {title}
          </h2>
          
          {showMoreButton && (
            <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View All
            </button>
          )}
        </div>

        {/* Content Slider */}
        <div className="relative group">
          {/* Navigation Buttons */}
          {items.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / Math.ceil(items.length / itemsPerView))}%)`,
                width: `${Math.ceil(items.length / itemsPerView) * 100}%`
              }}
            >
              {items.map((item, index) => (
                <ContentCard 
                  key={`${item.id}-${index}`} 
                  item={item} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentRowSection;