import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import ControlsPanel from './components/ControlsPanel';
import LoadMoreSection from './components/LoadMoreSection';
import MovieGrid from './components/MovieGrid';
import ResultsBar from './components/ResultsBar';
import './App.css';

const TRENDING_ENDPOINT = 'https://api.themoviedb.org/3/trending/movie/week';
const SEARCH_ENDPOINT = 'https://api.themoviedb.org/3/search/movie';

const sortLabels = {
  'popularity-desc': 'Popularity',
  'rating-desc': 'Rating',
  'year-desc': 'Latest',
  'title-asc': 'A-Z',
};

function buildMoviesRequest(apiKey, page, query) {
  const isJwt = /^eyJ/.test(apiKey);
  const hasQuery = Boolean(query);
  const endpoint = hasQuery ? SEARCH_ENDPOINT : TRENDING_ENDPOINT;
  const params = new URLSearchParams();

  params.set('page', String(page));

  if (hasQuery) {
    params.set('query', query);
    params.set('include_adult', 'false');
  }

  if (!isJwt) {
    params.set('api_key', apiKey);
  }

  return {
    url: `${endpoint}?${params.toString()}`,
    options: isJwt
      ? { headers: { Authorization: `Bearer ${apiKey}`, accept: 'application/json' } }
      : { headers: { accept: 'application/json' } },
  };
}

async function fetchMoviesPage(apiKey, page, query = '') {
  const request = buildMoviesRequest(apiKey, page, query);
  const response = await fetch(request.url, request.options);

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const error = new Error('TMDB request failed');
    error.status = response.status;
    error.body = errBody;
    throw error;
  }

  return response.json();
}

function Movie4fun() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortOption, setSortOption] = useState('popularity-desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedMovieIds, setExpandedMovieIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('movie4fun-theme') || 'dark');
  const [favoriteMovieIds, setFavoriteMovieIds] = useState(() => {
    const saved = localStorage.getItem('movie4fun-favorites');

    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('movie4fun-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('movie4fun-favorites', JSON.stringify(favoriteMovieIds));
  }, [favoriteMovieIds]);

  useEffect(() => {
    if (!API_KEY) {
      console.warn('TMDB API key missing. Set VITE_TMDB_API_KEY in .env and restart dev server.');
      setErrorMessage('TMDB API key is missing. Add VITE_TMDB_API_KEY in .env to load movies.');
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(1);
      setIsLoading(false);
      return;
    }

    const fetchInitialMovies = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        setLoadMoreError('');
        setCurrentPage(1);
        setTotalPages(1);

        const data = await fetchMoviesPage(API_KEY, 1, debouncedQuery);
        setMovies(Array.isArray(data.results) ? data.results : []);
        setTotalPages(Number(data.total_pages) || 1);
        setCurrentPage(1);
      } catch (error) {
        console.error('TMDB fetch failed:', error.status, error.body || error);
        setMovies([]);
        setErrorMessage('Could not fetch movies right now. Please check your API key and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMovies();
  }, [API_KEY, debouncedQuery]);

  const handleLoadMore = async () => {
    if (!API_KEY || isLoading || isLoadingMore || currentPage >= totalPages) {
      return;
    }

    const nextPage = currentPage + 1;

    try {
      setIsLoadingMore(true);
      setLoadMoreError('');

      const data = await fetchMoviesPage(API_KEY, nextPage, debouncedQuery);
      const nextResults = Array.isArray(data.results) ? data.results : [];

      setMovies((prevMovies) => {
        const uniqueNextResults = nextResults.filter((nextMovie) => {
          return !prevMovies.some((prevMovie) => prevMovie.id === nextMovie.id);
        });

        return [...prevMovies, ...uniqueNextResults];
      });

      setCurrentPage(nextPage);
      setTotalPages(Number(data.total_pages) || 1);
    } catch (error) {
      console.error('TMDB load more failed:', error.status, error.body || error);
      setLoadMoreError('Could not load more movies right now. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const visibleMovies = useMemo(() => {
    const filteredMovies = movies.filter((movie) => {
      if (ratingFilter === 'all') {
        return true;
      }

      return (movie.vote_average ?? 0) >= Number(ratingFilter);
    });

    const favoriteFilteredMovies = filteredMovies.filter((movie) => {
      return showFavoritesOnly ? favoriteMovieIds.includes(movie.id) : true;
    });

    return [...favoriteFilteredMovies].sort((a, b) => {
      switch (sortOption) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'rating-desc':
          return (b.vote_average ?? 0) - (a.vote_average ?? 0);
        case 'year-desc':
          return Number(b.release_date?.slice(0, 4) || 0) - Number(a.release_date?.slice(0, 4) || 0);
        case 'popularity-desc':
        default:
          return (b.popularity ?? 0) - (a.popularity ?? 0);
      }
    });
  }, [movies, debouncedQuery, ratingFilter, showFavoritesOnly, favoriteMovieIds, sortOption]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleFavorite = (movieId) => {
    setFavoriteMovieIds((prevFavoriteMovieIds) => {
      return prevFavoriteMovieIds.includes(movieId)
        ? prevFavoriteMovieIds.filter((id) => id !== movieId)
        : [...prevFavoriteMovieIds, movieId];
    });
  };

  const toggleOverview = (movieId) => {
    setExpandedMovieIds((prevExpandedMovieIds) => {
      return prevExpandedMovieIds.includes(movieId)
        ? prevExpandedMovieIds.filter((id) => id !== movieId)
        : [...prevExpandedMovieIds, movieId];
    });
  };

  const clearAllControls = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setRatingFilter('all');
    setSortOption('popularity-desc');
    setShowFavoritesOnly(false);
  };

  const activeFilterChips = [
    debouncedQuery ? `Search: "${searchQuery.trim()}"` : '',
    ratingFilter !== 'all' ? `Rating ${ratingFilter}+` : '',
    sortOption !== 'popularity-desc' ? `Sort: ${sortLabels[sortOption]}` : '',
    showFavoritesOnly ? 'Favorites only' : '',
  ].filter(Boolean);

  return (
    <div className={`app-container ${theme}`}>
      <div className="bg-blur bg-blur-one"></div>
      <div className="bg-blur bg-blur-two"></div>

      <AppHeader
        moviesCount={movies.length}
        favoritesCount={favoriteMovieIds.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ControlsPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly((prevValue) => !prevValue)}
        onClear={clearAllControls}
      />

      <ResultsBar visibleCount={visibleMovies.length} activeFilterChips={activeFilterChips} />

      <main className="main-content">
        {isLoading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <h2>Loading movies...</h2>
          </div>
        ) : errorMessage ? (
          <div className="message-box">{errorMessage}</div>
        ) : visibleMovies.length === 0 ? (
          <div className="message-box">No movies match your current search or filters.</div>
        ) : (
          <>
            <MovieGrid
              movies={visibleMovies}
              favoriteMovieIds={favoriteMovieIds}
              expandedMovieIds={expandedMovieIds}
              onToggleOverview={toggleOverview}
              onToggleFavorite={toggleFavorite}
            />

            <LoadMoreSection
              currentPage={currentPage}
              totalPages={totalPages}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              loadMoreError={loadMoreError}
              isSearchMode={Boolean(debouncedQuery)}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Movie4fun;