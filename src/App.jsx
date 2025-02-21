// import React from 'react'
import { useState, useEffect } from 'react';
import MooviesDB from './components/mooviesDB/mooviesDb';
import './App.css';
import Lists from './components/lists/lists';
import { Input } from 'antd';
import { Pagination } from 'antd';
import { Skeleton } from 'antd';
import { debounce } from 'lodash';

function App() {
  const [moviesrate, setMoviesRate] = useState([]);
  const [movie, setMovies] = useState([]);
  const [rated, setRated] = useState(false);
  const [searchValue, setSearchValue] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [movieLength, setMovieLength] = useState(1);
  const [genres, setGenres] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const body = new MooviesDB();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const moovies = await body.getRequest(pageNumber);
        if (isMounted) {
          if (!search) {
            setMovies(moovies.results);
            setMovieLength(moovies.total_pages);
            // setGenres(moovies.genre_ids);
            // console.log(moovies.results.genre_ids);
          }
          const genres = await body.getGenres();
          if (isMounted) {
            setGenres(genres.genres); // Устанавливаем жанры
          }
        }
      } catch (error) {
        if (isMounted) {
          console.log(`Ошибка: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pageNumber, search, rated]);

  const handleRateClick = async (movieId, rating) => {
    try {
      await body.addRating(movieId, rating);
      console.log('Рейтинг добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении рейтинга:', error);
      console.log('Не удалось добавить рейтинг.');
    }
  };

  const debouncedSearch = debounce(async (value) => {
    if (value) {
      try {
        const searchMovies = await body.getSearchForInput(value, pageNumber);
        setMovies(searchMovies.results);
        setMovieLength(searchMovies.total_pages);
      } catch (error) {
        console.log(`Ошибка: ${error.message}`);
      }
    }
  }, 1500);

  const handleChangeValue = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPageNumber(1);
    debouncedSearch(value);
  };
  function handleClickMooviesShow(event) {
    const { name } = event.target;
    if (name === 'search') {
      setRated(false);
      setSearchValue(true);
    }
  }
  async function handleClickRatedShow(event) {
    const { name } = event.target;
    if (name === 'rated') {
      setRated(true);
      setSearchValue(false);

      try {
        const ratedMovies = await body.getRatedMovies(); // Вызов метода для получения фильмов с рейтингами
        setMoviesRate(ratedMovies.results); // Обновление состояния с новыми фильмами
        setMovieLength(ratedMovies.total_pages);
      } catch (error) {
        console.error('Ошибка при получении фильмов с рейтингами:', error);
      }
    }
  }

  const handelChangedPage = (event) => {
    setPageNumber(event);
  };
  return (
    <div>
      <h1 className="movie__title">Movies</h1>
      <div className="top_header-menu">
        <button
          name="search"
          className={!searchValue ? 'search_btn--active' : 'search_btn--active-click'}
          onClick={handleClickMooviesShow}
        >
          Search
        </button>
        <button
          name="rated"
          className={rated ? 'rated_btn--active-click' : 'rated_btn--active'}
          onClick={handleClickRatedShow}
        >
          Rated
        </button>
      </div>
      <div className="movie__search-input">
        {!rated ? <Input placeholder="Basic usage" onChange={(e) => handleChangeValue(e)} /> : null}
      </div>

      <div className="movie__block">
        <ul className="movie__block-list">
          <ul className="movie__block-list">
            {
              movie.length > 0 && searchValue
                ? movie.map((item) => (
                    <Lists key={item.id} item={item} genres={genres} handleRateClick={handleRateClick} />
                  ))
                : moviesrate.length > 0 && rated
                  ? moviesrate.map((item) => (
                      <Lists key={item.id} item={item} genres={genres} handleRateClick={handleRateClick} />
                    ))
                  : null // Сообщение, если фильмов нет
            }
          </ul>
        </ul>
        {loading ? (
          <>
            <Skeleton active loading gradientFromColor="rgba(255,255,255,1)" gradientToColor="rgba(155,155,155,0.8)" />
            <Skeleton active loading gradientFromColor="rgba(255,255,255,1)" gradientToColor="rgba(155,155,155,0.8)" />
            <Skeleton active loading gradientFromColor="rgba(255,255,255,1)" gradientToColor="rgba(155,155,155,0.8)" />
            <Skeleton active loading gradientFromColor="rgb(217, 52, 217)" gradientToColor="rgba(214, 28, 28, 0.8)" />
            <Skeleton active loading gradientFromColor="rgba(255,255,255,1)" gradientToColor="rgba(155,155,155,0.8)" />
            <Skeleton active loading gradientFromColor="rgb(217, 52, 217)" gradientToColor="rgba(214, 28, 28, 0.8)" />
          </>
        ) : null}
        <Pagination align="center" defaultCurrent={1} total={movieLength} onChange={(e) => handelChangedPage(e)} />
      </div>
    </div>
    // </div>
  );
}

export default App;
