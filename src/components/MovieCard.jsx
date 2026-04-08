function MovieCard({ movie, index, isFavorite, isExpanded, onToggleOverview, onToggleFavorite }) {
  const overview = movie.overview || 'No overview available for this movie.';
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

  return (
    <div className="movie-card reveal-card" style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}>
      <div className="image-wrapper">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="poster-overlay"></div>
        <div className="rating-badge">{movie.vote_average?.toFixed(1) ?? 'N/A'}</div>
        <div className="year-badge">{releaseYear}</div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">Released {releaseYear}</p>
        <p className="movie-overview">
          {isExpanded ? overview : `${overview.slice(0, 110)}${overview.length > 110 ? '...' : ''}`}
        </p>

        <div className="card-actions">
          <button className="action-button" onClick={() => onToggleOverview(movie.id)} type="button">
            {isExpanded ? 'View Less' : 'View More'}
          </button>
          <button className={`action-button ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite(movie.id)} type="button">
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
