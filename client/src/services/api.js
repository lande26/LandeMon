// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL)
  ? process.env.REACT_APP_API_BASE_URL
  : 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for auth token (if needed)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Movies API
export const moviesAPI = {
  // Get trending movies
  getTrending: async () => {
    try {
      const response = await apiClient.get('/movie/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    try {
      const response = await apiClient.get(`/movie/popular?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get movie details
  getDetails: async (movieId) => {
    try {
      const response = await apiClient.get(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get movie streaming URL
  getStreamUrl: async (movieId) => {
    try {
      const response = await apiClient.get(`/movies/${movieId}/stream`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie stream URL:', error);
      throw error;
    }
  },

  // Search movies
  search: async (query, page = 1) => {
    try {
      const response = await apiClient.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movies by genre
  getByGenre: async (genreId, page = 1) => {
    try {
      const response = await apiClient.get(`/movies/genre/${genreId}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  }
};

// TV Shows API
export const tvShowsAPI = {
  // Get trending TV shows
  getTrending: async () => {
    try {
      const response = await apiClient.get('/series/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  },

  // Get popular TV shows
  getPopular: async (page = 1) => {
    try {
      const response = await apiClient.get(`/series/popular?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Get TV show details
  getDetails: async (showId) => {
    try {
      const response = await apiClient.get(`/series/${showId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  // Get TV show streaming URL
  getStreamUrl: async (showId, season, episode) => {
    try {
      const response = await apiClient.get(`/series/${showId}/stream/${season}/${episode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show stream URL:', error);
      throw error;
    }
  },

  // Search TV shows
  search: async (query, page = 1) => {
    try {
      const response = await apiClient.get(`/series/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  }
};

// General API
export const generalAPI = {
  // Get genres for movies
  getMovieGenres: async () => {
    try {
      const response = await apiClient.get('/genres/movies');
      return response.data;
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw error;
    }
  },

  // Get genres for TV shows
  getTVGenres: async () => {
    try {
      const response = await apiClient.get('/genres/tv');
      return response.data;
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      throw error;
    }
  }
};

// Utility functions
export const imageUtils = {
  // Get full image URL
  getImageUrl: (path, size = 'w500') => {
    if (!path) return '/placeholder-image.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Get backdrop URL
  getBackdropUrl: (path, size = 'w1280') => {
    if (!path) return '/placeholder-backdrop.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};

// Data transformation utilities
export const dataTransforms = {
  // Transform movie data from API to component format
  transformMovie: (movie) => ({
    id: movie.tmdbId || movie.id,
    title: movie.title,
    poster: imageUtils.getImageUrl(movie.posterPath || movie.poster_path),
    backdrop: imageUtils.getBackdropUrl(movie.backdropPath || movie.backdrop_path),
    rating: movie.voteAverage || movie.vote_average || 0,
    year: new Date(movie.releaseDate || movie.release_date).getFullYear(),
    genre: movie.genres ? movie.genres.map(g => g.name).join(', ') : '',
    overview: movie.overview,
    imdbId: movie.imdbId,
    type: 'movie'
  }),

  // Transform TV show data from API to component format
  transformTVShow: (show) => ({
    id: show.tmdbId || show.id,
    title: show.name || show.title,
    poster: imageUtils.getImageUrl(show.posterPath || show.poster_path),
    backdrop: imageUtils.getBackdropUrl(show.backdropPath || show.backdrop_path),
    rating: show.voteAverage || show.vote_average || 0,
    year: new Date(show.firstAirDate || show.first_air_date).getFullYear(),
    genre: show.genres ? show.genres.map(g => g.name).join(', ') : '',
    overview: show.overview,
    imdbId: show.imdbId,
    numberOfSeasons: show.numberOfSeasons || show.number_of_seasons,
    type: 'tv'
  }),

  // Transform mixed content (movies and TV shows)
  transformMixedContent: (items) => {
    return items.map(item => {
      if (item.title) {
        return dataTransforms.transformMovie(item);
      } else if (item.name) {
        return dataTransforms.transformTVShow(item);
      }
      return item;
    });
  }
};

export default apiClient;