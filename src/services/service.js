import axios from 'axios';

const transformMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    overview: movie.overview,
    vote: movie.vote_average,
    genreIds: movie.genre_ids,
    starRate: JSON.parse(localStorage.getItem(movie.id)) || 0,
    ratedMoviesGenres: movie.genres,
  };
};

const apiKey = 'b43ecb4f90e6ab31d4d67240b99c5bf0';

async function getMovies(page, query = null) {
  const url = !query
    ? `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
    : `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
  const movies = axios
    .get(url)
    .then((result) => result.data.results.map(transformMovie))
    .catch((error) => {
      throw new Error(error);
    });
  return movies;
}

async function getTotal(page, query = null) {
  const url = !query
    ? `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
    : `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
  const totalPages = axios
    .get(url)
    .then((result) => result.data.total_pages)
    .catch((error) => {
      throw new Error(error);
    });
  return totalPages;
}

async function getGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  return axios
    .get(url)
    .then((result) => result.data.genres)
    .catch((error) => {
      throw new Error(error);
    });
}

async function getRated(key) {
  const url = `https://api.themoviedb.org/3/movie/${key}?api_key=${apiKey}`;
  return axios
    .get(url)
    .then((result) => transformMovie(result.data))
    .catch((error) => {
      throw new Error(error);
    });
}

export { getMovies, getTotal, getGenres, getRated };
