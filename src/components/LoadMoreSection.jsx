function LoadMoreSection({ currentPage, totalPages, isLoadingMore, onLoadMore, loadMoreError, isSearchMode }) {
  return (
    <div className="load-more-wrap">
      {currentPage < totalPages ? (
        <button className="load-more-button" onClick={onLoadMore} type="button" disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'Load More Movies'}
        </button>
      ) : (
        <p className="end-text">
          {isSearchMode
            ? 'You have reached the end of available search results.'
            : 'You have reached the end of available trending pages.'}
        </p>
      )}

      {loadMoreError ? <p className="load-more-error">{loadMoreError}</p> : null}
    </div>
  );
}

export default LoadMoreSection;
