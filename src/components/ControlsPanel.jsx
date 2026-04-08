function ControlsPanel({
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  sortOption,
  onSortOptionChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onClear,
}) {
  return (
    <section className="controls-panel">
      <label className="control-field control-search">
        <span className="control-label">Search</span>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Type movie title"
        />
      </label>

      <label className="control-field">
        <span className="control-label">Rating Filter</span>
        <select value={ratingFilter} onChange={(event) => onRatingFilterChange(event.target.value)} className="control-select">
          <option value="all">All Ratings</option>
          <option value="6">Rating 6+</option>
          <option value="7">Rating 7+</option>
          <option value="8">Rating 8+</option>
        </select>
      </label>

      <label className="control-field">
        <span className="control-label">Sort By</span>
        <select value={sortOption} onChange={(event) => onSortOptionChange(event.target.value)} className="control-select">
          <option value="popularity-desc">Popularity</option>
          <option value="rating-desc">Rating</option>
          <option value="year-desc">Latest Year</option>
          <option value="title-asc">A-Z</option>
        </select>
      </label>

      <div className="control-buttons">
        <button className="favorites-toggle" onClick={onToggleFavoritesOnly} type="button">
          {showFavoritesOnly ? 'All Movies' : 'Favorites'}
        </button>
        <button className="clear-button" onClick={onClear} type="button">
          Clear
        </button>
      </div>
    </section>
  );
}

export default ControlsPanel;
