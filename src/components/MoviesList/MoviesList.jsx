import React from 'react';
import PropTypes from 'prop-types';

import { Movie } from '../Movie';

import './MoviesList.css';

function MoviesList({ movies, rate, rated }) {
  MoviesList.defaultProps = {
    movies: [],
    rated: false,
    rate: () => {},
  };

  MoviesList.propTypes = {
    movies: PropTypes.instanceOf(Array),
    rated: PropTypes.bool,
    rate: PropTypes.func,
  };

  const elements = movies.map((item) => {
    const { id, title, posterPath, releaseDate, overview, starRate, vote, genreIds, ratedMoviesGenres } = item;
    return (
      <Movie
        key={id}
        rate={rate}
        title={title}
        vote={vote}
        genreIds={genreIds}
        ratedMoviesGenres={ratedMoviesGenres}
        posterPath={posterPath}
        rated={rated}
        releaseDate={releaseDate}
        starRate={starRate}
        overview={overview}
        id={id}
      />
    );
  });

  return <ul className="movies-list">{elements}</ul>;
}

export default MoviesList;
