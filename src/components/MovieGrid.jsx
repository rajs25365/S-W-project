import MovieCard from './MovieCard';

function MovieGrid({ movies, favoriteMovieIds, expandedMovieIds, onToggleOverview, onToggleFavorite }) {
  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          isFavorite={favoriteMovieIds.includes(movie.id)}
          isExpanded={expandedMovieIds.includes(movie.id)}
          onToggleOverview={onToggleOverview}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default MovieGrid;
