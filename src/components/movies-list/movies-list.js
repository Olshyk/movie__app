import React from 'react';
import PropTypes from 'prop-types';

import Movie from '../movie/movie';

import './movies-list.css';

function MoviesList({ movies, rate }) {
  MoviesList.defaultProps = {
    movies: [],
    rate: () => {},
  };

  MoviesList.propTypes = {
    movies: PropTypes.instanceOf(Array),
    rate: PropTypes.func,
  };

  const elements = movies.map((item) => {
    const { id } = item;
    return <Movie key={id} rate={rate} {...item} />;
  });

  return <ul className="movies-list">{elements}</ul>;
}

export default MoviesList;
