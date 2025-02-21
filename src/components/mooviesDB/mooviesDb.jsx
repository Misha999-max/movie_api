import { options } from '../apiAccess/apiaccess';

class MooviesDB {
  _apiMooviesDB = '44ba22899a10059bf2e5a947e456b6ed';
  _apiAccessKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGJhMjI4OTlhMTAwNTliZjJlNWE5NDdlNDU2YjZlZCIsIm5iZiI6MTczNzYzNTIyOS44NzksInN1YiI6IjY3OTIzNTlkNTE0OGY4NzY3Y2ZhNzkzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.usH8-9epL0YEocBZ8LPTu8y-rt07JYdKd9sEpDFn-BE';
  // _apiBase = 'https://api.themoviedb.org/3/movie/550?api_key=44ba22899a10059bf2e5a947e456b6ed';
  _baseURL = 'https://api.themoviedb.org/3/';
  async getRequest(number) {
    const res = await fetch(`${this._baseURL}movie/now_playing?language=en-US&page=${number}`, options);
    if (!res.ok) {
      throw new Error(` received ${res.status}`);
    }
    return await res.json();
  }
  async getGenres() {
    const res = await fetch(`${this._baseURL}genre/movie/list?language=en`, options);
    if (!res.ok) {
      throw new Error(` received ${res.status}`);
    }
    return await res.json();
  }
  async getSearchForInput(value, number) {
    const res = await fetch(
      `${this._baseURL}search/movie?query=${value}&include_adult=false&language=en-US&page=${number}`,
      options
    );
    if (!res.ok) {
      throw new Error(` received ${res.status}`);
    }
    return res.json();
  }

  async addRating(movieId, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._apiAccessKey}`, // Добавьте токен доступа
      },
      body: JSON.stringify({ value: rating }), // Убедитесь, что ключ соответствует API
    };

    const response = await fetch(`${this._baseURL}movie/${movieId}/rating`, options); // Исправленный URL

    if (!response.ok) {
      throw new Error(`Ошибка при добавлении рейтинга: ${response.status}`);
    }

    return response.json();
  }

  async getRatedMovies() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this._apiAccessKey}`,
      },
    };

    const response = await fetch(
      `${this._baseURL}account/{account_id}/rated/movies?language=en-US&sort_by=created_at.asc`,
      options
    );

    if (!response.ok) {
      throw new Error(`Ошибка при получении фильмов с рейтингами: ${response.status}`);
    }

    return response.json();
  }
}

export default MooviesDB;
