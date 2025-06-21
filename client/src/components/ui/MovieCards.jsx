import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
      alt={movie.title}
      className="w-full h-64 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 truncate">{movie.title}</h3>
      <p className="text-sm text-gray-600">{movie.releaseDate}</p>
      <Link
        to={`/user/movie/${movie.tmdbId}`}
        className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default MovieCard;