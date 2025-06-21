//server/models/Shows.js
const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    default: ''
  },
  posterPath: {
    type: String,
    default: ''
  },
  backdropPath: {
    type: String,
    default: ''
  },
  firstAirDate: {
    type: String,
    default: ''
  },
  lastAirDate: {
    type: String,
    default: ''
  },
  voteAverage: {
    type: Number,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  numberOfSeasons: {
    type: Number,
    default: 1
  },
  numberOfEpisodes: {
    type: Number,
    default: 0
  },
  genreIds: [{
    type: Number
  }],
  genres: [{
    id: Number,
    name: String
  }],
  imdbId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  networks: [{
    id: Number,
    name: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);