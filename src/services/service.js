export default class Service {
  async getResourse(url) {
    const res = await fetch(`${url}`);
    if (!res.ok) throw new Error(`Could not fetch ${url}`);
    return res.json();
  }

  async getMovies(url) {
    const result = await this.getResourse(url);
    return result.results.map(this.transformMovie);
  }

  async getTotal(url) {
    const result = await this.getResourse(url);
    const totalPages = result.total_pages;
    return totalPages;
  }

  async createSession(url) {
    const result = await this.getResourse(url);
    const sessionId = result.guest_session_id;
    return sessionId;
  }

  async getGenres(url) {
    const result = await this.getResourse(url);
    return result.genres;
  }

  async getRated(url) {
    const result = await this.getResourse(url);
    return this.transformMovie(result);
  }

  transformMovie = (movie) => {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      overview: movie.overview,
      vote: movie.vote_average,
      genreIds: movie.genre_ids,
      starRate: JSON.parse(localStorage.getItem(movie.id)) || 0,
    };
  };
}
