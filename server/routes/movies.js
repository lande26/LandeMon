// // router.get('/trending', async (req, res) => {
// //   try {
// //     const response = await axios.get(
// //       `${process.env.TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
// //     );
// //     const movies = response.data.results;

// //     const moviePromises = movies.map(async (movie) => {
// //       const movieData = {
// //         tmdbId: movie.id.toString(),
// //         title: movie.title,
// //         overview: movie.overview,
// //         posterPath: movie.poster_path,
// //         releaseDate: movie.release_date,
// //       };

// //       const details = await axios.get(
// //         `${process.env.TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
// //       );
// //       movieData.imdbId = details.data.external_ids.imdb_id;

// //       return Movie.findOneAndUpdate({ tmdbId: movieData.tmdbId }, movieData, {
// //         upsert: true,
// //         new: true,
// //       });
// //     });

// //     await Promise.all(moviePromises);
// //     const updatedMovies = await Movie.find();
// //     res.json(updatedMovies);
// //   } catch (error) {
// //     if (error.response && error.response.status === 429) {
// //       res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
// //     } else {
// //       res.status(500).json({ error: error.message });
// //     }
// //   }
// // });

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const Movie = require('../models/Movie');

// // Helper function to transform TMDB movie data
// const transformMovieData = (movie) => ({
//   tmdbId: movie.id.toString(),
//   title: movie.title,
//   overview: movie.overview,
//   posterPath: movie.poster_path,
//   backdropPath: movie.backdrop_path,
//   releaseDate: movie.release_date,
//   voteAverage: movie.vote_average,
//   voteCount: movie.vote_count,
//   popularity: movie.popularity,
//   genreIds: movie.genre_ids,
//   originalLanguage: movie.original_language,
//   originalTitle: movie.original_title,
//   adult: movie.adult,
//   video: movie.video
// });

// // Fetch trending movies from TMDB and store in MongoDB
// router.get('/trending', async (req, res) => {
//   try {
//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
//     );
//     const movies = response.data.results;

//     const moviePromises = movies.map(async (movie) => {
//       const movieData = transformMovieData(movie);
      
//       // Get additional details including IMDb ID
//       try {
//         const details = await axios.get(
//           `${process.env.TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
//         );
//         movieData.imdbId = details.data.external_ids.imdb_id;
//         movieData.genres = details.data.genres;
//       } catch (detailError) {
//         console.error(`Error fetching details for movie ${movie.id}:`, detailError.message);
//       }

//       return Movie.findOneAndUpdate({ tmdbId: movieData.tmdbId }, movieData, {
//         upsert: true,
//         new: true,
//       });
//     });

//     await Promise.all(moviePromises);
//     const updatedMovies = await Movie.find().sort({ popularity: -1 });
//     res.json(updatedMovies);
//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

// // Fetch popular movies from TMDB
// router.get('/popular', async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
//     );
//     const movies = response.data.results;

//     const moviePromises = movies.map(async (movie) => {
//       const movieData = transformMovieData(movie);
      
//       // Get additional details including IMDb ID
//       try {
//         const details = await axios.get(
//           `${process.env.TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
//         );
//         movieData.imdbId = details.data.external_ids.imdb_id;
//         movieData.genres = details.data.genres;
//       } catch (detailError) {
//         console.error(`Error fetching details for movie ${movie.id}:`, detailError.message);
//       }

//       return Movie.findOneAndUpdate({ tmdbId: movieData.tmdbId }, movieData, {
//         upsert: true,
//         new: true,
//       });
//     });

//     await Promise.all(moviePromises);
//     const updatedMovies = await Movie.find().sort({ popularity: -1 }).limit(20);
//     res.json(updatedMovies);
//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

// // Search movies
// router.get('/search', async (req, res) => {
//   try {
//     const { query, page = 1 } = req.query;
//     if (!query) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }

//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
//     );
    
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get movies by genre
// router.get('/genre/:genreId', async (req, res) => {
//   try {
//     const { genreId } = req.params;
//     const { page = 1 } = req.query;
    
//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
//     );
    
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Fetch movie details
// router.get('/:id', async (req, res) => {
//   try {
//     const movie = await Movie.findOne({ tmdbId: req.params.id });
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }

//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`
//     );
    
//     const movieDetails = {
//       ...movie._doc,
//       cast: response.data.credits.cast.slice(0, 10).map((actor) => ({
//         name: actor.name,
//         character: actor.character,
//         profilePath: actor.profile_path
//       })),
//       director: response.data.credits.crew.find(person => person.job === 'Director')?.name,
//       videos: response.data.videos.results.filter(video => video.type === 'Trailer').slice(0, 3)
//     };

//     res.json(movieDetails);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Fetch streaming URL
// router.get('/:id/stream', async (req, res) => {
//   try {
//     const movie = await Movie.findOne({ tmdbId: req.params.id });
//     if (!movie || !movie.imdbId) {
//       return res.status(404).json({ error: 'Movie not found or no IMDb ID' });
//     }
    
//     const streamUrl = `https://vidsrc.to/embed/movie/${movie.imdbId}`;
//     res.json({ streamUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movies');

// Fetch trending movies from TMDB and store in MongoDB
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
    );
    const movies = response.data.results;

    const moviePromises = movies.map(async (movie) => {
      const movieData = {
        tmdbId: movie.id.toString(),
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        adult: movie.adult,
        originalLanguage: movie.original_language,
        genreIds: movie.genre_ids
      };

      // Get additional details including IMDb ID
      try {
        const details = await axios.get(
          `${process.env.TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
        );
        movieData.imdbId = details.data.external_ids.imdb_id;
        movieData.runtime = details.data.runtime;
        movieData.genres = details.data.genres;
      } catch (detailError) {
        console.log('Error fetching movie details:', detailError.message);
      }

      return Movie.findOneAndUpdate(
        { tmdbId: movieData.tmdbId }, 
        movieData, 
        { upsert: true, new: true }
      );
    });

    await Promise.all(moviePromises);
    const updatedMovies = await Movie.find().sort({ popularity: -1 });
    res.json(updatedMovies);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Fetch popular movies
router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    );
    
    const movies = response.data.results.map(movie => ({
      tmdbId: movie.id.toString(),
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      adult: movie.adult,
      originalLanguage: movie.original_language,
      genreIds: movie.genre_ids
    }));

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie streaming URL
router.get('/:id/stream', async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.id });
    if (!movie || !movie.imdbId) {
      return res.status(404).json({ error: 'Movie not found or no IMDb ID' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;