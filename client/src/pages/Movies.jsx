import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Movies = () => {
    console.log('Movies component rendered');
    return (
        <div>
        <h1>Movies</h1>
        {/* <ul>
            {movies.map(movie => (
            <li key={movie.id}>{movie.title}</li>
            ))}
        </ul> */}
        </div>
    );
    }
export default Movies;