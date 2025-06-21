// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const Show = require('../models/Show');

// // Fetch trending shows from TMDB and store in MongoDB
// router.get('/trending', async (req, res) => {
//   try {
//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/trending/tv/week?api_key=${process.env.TMDB_API_KEY}`
//     );
//     const shows = response.data.results;

//     const showPromises = shows.map(async (show) => {
//       const showData = {
//         tmdbId: show.id.toString(),
//         name: show.name,
//         overview: show.overview,
//         posterPath: show.poster_path,
//         firstAirDate: show.first_air_date,
//         numberOfSeasons: show.number_of_seasons,
//       };

//       const details = await axios.get(
//         `${process.env.TMDB_BASE_URL}/tv/${show.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
//       );
//       showData.imdbId = details.data.external_ids.imdb_id;

//       return Show.findOneAndUpdate({ tmdbId: showData.tmdbId }, showData, {
//         upsert: true,
//         new: true,
//       });
//     });

//     await Promise.all(showPromises);
//     const updatedShows = await Show.find();
//     res.json(updatedShows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Fetch show details
// router.get('/:id', async (req, res) => {
//   try {
//     const show = await Show.findOne({ tmdbId: req.params.id });
//     if (!show) {
//       return res.status(404).json({ error: 'Show not found' });
//     }

//     const response = await axios.get(
//       `${process.env.TMDB_BASE_URL}/tv/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`
//     );
//     const showDetails = {
//       ...show._doc,
//       cast: response.data.credits.cast.slice(0, 5).map((actor) => actor.name),
//     };

//     res.json(showDetails);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Fetch streaming URL
// router.get('/:id/stream/:season/:episode', async (req, res) => {
//   try {
//     const show = await Show.findOne({ tmdbId: req.params.id });
//     if (!show || !show.imdbId) {
//       return res.status(404).json({ error: 'Show not found or no IMDb ID' });
//     }
//     const { season, episode } = req.params;
//     const streamUrl = `https://vidsrc.to/embed/tv/${show.imdbId}/${season}/${episode}`;
//     res.json({ streamUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


// server/routes/series.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Show = require('../models/Shows');

// Helper function to transform TMDB TV show data
const transformShowData = (show) => ({
  tmdbId: show.id.toString(),
  name: show.name,
  overview: show.overview,
  posterPath: show.poster_path,
  backdropPath: show.backdrop_path,
  firstAirDate: show.first_air_date,
  voteAverage: show.vote_average,
  voteCount: show.vote_count,
  popularity: show.popularity,
  genreIds: show.genre_ids,
  originalLanguage: show.original_language,
  originalName: show.original_name,
  originCountry: show.origin_country
});

// Fetch trending shows from TMDB and store in MongoDB
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/trending/tv/week?api_key=${process.env.TMDB_API_KEY}`
    );
    const shows = response.data.results;

    const showPromises = shows.map(async (show) => {
      const showData = transformShowData(show);
      
      // Get additional details including IMDb ID
      try {
        const details = await axios.get(
          `${process.env.TMDB_BASE_URL}/tv/${show.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
        );
        showData.imdbId = details.data.external_ids.imdb_id;
        showData.numberOfSeasons = details.data.number_of_seasons;
        showData.numberOfEpisodes = details.data.number_of_episodes;
        showData.genres = details.data.genres;
      } catch (detailError) {
        console.error(`Error fetching details for show ${show.id}:`, detailError.message);
      }

      return Show.findOneAndUpdate({ tmdbId: showData.tmdbId }, showData, {
        upsert: true,
        new: true,
      });
    });

    await Promise.all(showPromises);
    const updatedShows = await Show.find().sort({ popularity: -1 });
    res.json(updatedShows);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Fetch popular shows from TMDB
router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    );
    const shows = response.data.results;

    const showPromises = shows.map(async (show) => {
      const showData = transformShowData(show);
      
      // Get additional details including IMDb ID
      try {
        const details = await axios.get(
          `${process.env.TMDB_BASE_URL}/tv/${show.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`
        );
        showData.imdbId = details.data.external_ids.imdb_id;
        showData.numberOfSeasons = details.data.number_of_seasons;
        showData.numberOfEpisodes = details.data.number_of_episodes;
        showData.genres = details.data.genres;
      } catch (detailError) {
        console.error(`Error fetching details for show ${show.id}:`, detailError.message);
      }

      return Show.findOneAndUpdate({ tmdbId: showData.tmdbId }, showData, {
        upsert: true,
        new: true,
      });
    });

    await Promise.all(showPromises);
    const updatedShows = await Show.find().sort({ popularity: -1 }).limit(20);
    res.json(updatedShows);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'TMDB API rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Search TV shows
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch show details
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findOne({ tmdbId: req.params.id });
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/tv/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos`
    );
    
    const showDetails = {
      ...show._doc,
      cast: response.data.credits.cast.slice(0, 10).map((actor) => ({
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path
      })),
      creator: response.data.created_by.map(creator => creator.name),
      videos: response.data.videos.results.filter(video => video.type === 'Trailer').slice(0, 3)
    };

    res.json(showDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch streaming URL
router.get('/:id/stream/:season/:episode', async (req, res) => {
  try {
    const show = await Show.findOne({ tmdbId: req.params.id });
    if (!show || !show.imdbId) {
      return res.status(404).json({ error: 'Show not found or no IMDb ID' });
    }
    const { season, episode } = req.params;
    const streamUrl = `https://vidsrc.to/embed/tv/${show.imdbId}/${season}/${episode}`;
    res.json({ streamUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;