import React, { Component } from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

import { StarsRating } from '../StarRating';
import { Genres } from '../Genres';

import './Movie.css';
import '../../assets/img/noposter.jpg';

export default class Movie extends Component {
  static defaultProps = {
    posterPath: '',
    title: 'Movie',
    releaseDate: '',
    overview: 'The information is missed',
    starRate: 0,
    vote: 0,
    genreIds: [],
    ratedMoviesGenres: [],
    rate: () => {},
    rated: false,
  };

  static propTypes = {
    posterPath: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
    starRate: PropTypes.number,
    id: PropTypes.number.isRequired,
    vote: PropTypes.number,
    genreIds: PropTypes.instanceOf(Array),
    ratedMoviesGenres: PropTypes.instanceOf(Array),
    rate: PropTypes.func,
    rated: PropTypes.bool,
  };

  cutText(text, limit, titleLength, arr) {
    let shortText = text;
    if (text.length <= limit) return shortText;
    if (titleLength >= 45) {
      shortText = text.slice(0, limit - 110);
    } else if (titleLength >= 30 && arr.length > 3) {
      shortText = text.slice(0, limit - 98);
    } else if (titleLength >= 30 || arr.length > 3) {
      shortText = text.slice(0, limit - 30);
    } else if (titleLength >= 20) {
      shortText = text.slice(0, limit - 10);
    } else {
      shortText = text.slice(0, limit);
    }
    if (text.lastIndexOf(' ') > 0) {
      shortText = shortText.substr(0, shortText.lastIndexOf(' '));
    }
    return `${shortText}...`;
  }

  render() {
    const { rated, rate, posterPath, title, releaseDate, overview, id, starRate, vote, genreIds, ratedMoviesGenres } =
      this.props;

    const url = posterPath === null ? './noposter.jpg' : `https://image.tmdb.org/t/p/w500${posterPath}`;
    const date = !releaseDate ? null : format(parseISO(releaseDate), 'PP');

    let classNames = 'movie__rate';
    if (vote <= 3) {
      classNames += ' movie__rate--bad';
    } else if (vote > 3 && vote < 5) {
      classNames += ' movie__rate--ok';
    } else if (vote >= 5 && vote < 7) {
      classNames += ' movie__rate--good';
    } else {
      classNames += ' movie__rate--great';
    }

    return (
      <li className="movie">
        <img className="movie__image" src={url} width="183" height="281" alt={title} />
        <div className="movie__info">
          <h1 className="movie__title">{title}</h1>
          <p className="movie__date">{date}</p>
          <Genres genreIds={genreIds} genreArray={ratedMoviesGenres} rated={rated} />
          <p className="movie__description">{this.cutText(overview, 170, title.length, genreIds)}</p>
          <StarsRating rate={rate} id={id} starRate={starRate} />
          <span className={classNames}>{Math.round(vote * 10) / 10}</span>
        </div>
      </li>
    );
  }
}
