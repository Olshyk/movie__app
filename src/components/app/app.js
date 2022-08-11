import React, { Component } from 'react';
import { debounce } from 'lodash';

import Service from '../../services/service';
import Spinner from '../spinner';
import AlertMessage from '../alert-message';
import MoviesList from '../movies-list';
import SearchForm from '../search-form';
import PagePagination from '../page-pagination';
import { GenresProvider } from '../../services/context';

import './app.css';

export default class App extends Component {
  service = new Service();

  state = {
    movies: [],
    loading: true,
    error: false,
    online: window.navigator.onLine,
    page: 1,
    query: 'return',
    totalPages: 1,
    rated: false,
    ratedMovies: [],
    genres: [],
    apiKey: 'b43ecb4f90e6ab31d4d67240b99c5bf0',
  };

  debouncedSearch = debounce(() => {
    const { page, query, apiKey } = this.state;

    let link = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;

    if (!query) {
      link = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    }

    this.setState({ loading: true });

    this.service.getMovies(link).then(this.onMoviesLoaded).catch(this.onError);
    this.service.getTotal(link).then(this.getTotal).catch(this.onError);
    this.service
      .getGenres(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(this.getGenresList)
      .catch(this.onError);
  }, 500);

  componentDidMount() {
    const { page, query, apiKey } = this.state;

    const link = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;

    this.service.getMovies(link).then(this.onMoviesLoaded).catch(this.onError);

    this.service.getTotal(link).then(this.getTotal).catch(this.onError);
    this.service
      .getGenres(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(this.getGenresList)
      .catch(this.onError);

    this.onRatedLoaded();

    window.addEventListener('offline', this.handleNetworkChange);
    window.addEventListener('online', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.handleNetworkChange);
    window.removeEventListener('online', this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    this.setState({ online: window.navigator.onLine });
  };

  onError = () => this.setState({ error: true, loading: false });

  onMoviesLoaded = (movies) => this.setState({ movies, loading: false });

  onRatedLoaded = () => {
    const { apiKey } = this.state;

    const keys = Object.keys(localStorage);
    const ratedArray = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      this.service
        .getRated(`https://api.themoviedb.org/3/movie/${key}?api_key=${apiKey}`)
        .then((movie) =>
          this.setState(() => {
            ratedArray.push(movie);
            return {
              ratedMovies: ratedArray,
            };
          })
        )
        .catch(this.onError);
    }
  };

  getTotal = (totalPages) => this.setState({ totalPages });

  getGenresList = (genres) => this.setState({ genres });

  onSearch = (search) => {
    this.setState({ query: search, page: 1 });
    this.debouncedSearch();
  };

  onChange = (cur) => {
    this.setState({ page: cur });
    this.debouncedSearch();
  };

  rate = async (id, value) => {
    await this.setState(({ movies }) => {
      const newArr = movies.map((el) => {
        const newItem = { ...el };
        if (newItem.id === id) {
          newItem.starRate = value;
        }
        return newItem;
      });

      return {
        movies: newArr,
      };
    });
    await this.onRatedLoaded();
  };

  onRate = () => this.setState({ rated: true });

  onSearchButton = () => this.setState({ rated: false });

  render() {
    const { movies, loading, error, online, page, query, totalPages, rated, ratedMovies, genres } = this.state;

    const hasData = !(loading || error);
    const errorMessage =
      error || !online || (movies.length === 0 && !loading) ? <AlertMessage movies={movies} online={online} /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? (
      !rated ? (
        <MoviesList movies={movies} rate={this.rate} />
      ) : (
        <MoviesList movies={ratedMovies} rate={this.rate} />
      )
    ) : null;

    let classNames = 'header__button';
    const searchTab = !rated ? (classNames += ' header__button--active') : 'header__button';
    const rateTab = rated ? (classNames += ' header__button--active') : 'header__button';

    return (
      <section className="movie-app">
        <GenresProvider value={genres}>
          <header className="header">
            <nav>
              <button className={searchTab} type="button" onClick={this.onSearchButton}>
                Search
              </button>
              <button className={rateTab} type="button" onClick={this.onRate}>
                Rate
              </button>
            </nav>
            <SearchForm onSearch={this.onSearch} rated={rated} />
          </header>
          <main className="main">
            {errorMessage}
            {spinner}
            {content}
          </main>
          <footer className="footer">
            <PagePagination page={page} query={query} totalPages={totalPages} onChange={this.onChange} />
          </footer>
        </GenresProvider>
      </section>
    );
  }
}
