import React, { Component } from 'react';
import { debounce } from 'lodash';

import { getMovies, getTotal, getGenres, getRated } from '../../services/service';
import { Spinner } from '../Spinner';
import { AlertMessage } from '../AlertMessage';
import { MoviesList } from '../MoviesList';
import { SearchForm } from '../SearchForm';
import { PagePagination } from '../PagePagination';
import { GenresProvider } from '../../services/context';

import './App.css';

export default class App extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    online: window.navigator.onLine,
    page: 1,
    query: '',
    totalPages: 1,
    rated: false,
    ratedMovies: [],
    genres: [],
  };

  debouncedSearch = debounce(() => {
    const { page, query } = this.state;

    this.setState({ loading: true });

    getMovies(page, query).then(this.onMoviesLoaded).catch(this.onError);
    getTotal(page, query).then(this.getTotal).catch(this.onError);
    getGenres().then(this.getGenresList).catch(this.onError);
  }, 500);

  componentDidMount() {
    const { page } = this.state;

    getMovies(page).then(this.onMoviesLoaded).catch(this.onError);
    getTotal(page).then(this.getTotal).catch(this.onError);
    getGenres().then(this.getGenresList).catch(this.onError);
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
    const keys = Object.keys(localStorage);
    const ratedArray = [];

    for (const key of keys) {
      getRated(key)
        .then((movie) => {
          ratedArray.push(movie);
        })
        .then(() => {
          this.setState(() => {
            return {
              ratedMovies: ratedArray,
            };
          });
        })
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
      const newArr = movies.map((item) => {
        const newItem = { ...item };
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
        <MoviesList movies={ratedMovies} rate={this.rate} rated={rated} />
      )
    ) : null;

    const pagesCount = !rated ? totalPages : 1;

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
            <PagePagination page={page} query={query} totalPages={pagesCount} onChange={this.onChange} />
          </footer>
        </GenresProvider>
      </section>
    );
  }
}
