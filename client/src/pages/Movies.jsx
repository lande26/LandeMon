import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCards from '../components/ui/MovieCards';


const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/movie');
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch movies');
        setLoading(false);
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Trending Movies</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCards key={movie.tmdbId} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;