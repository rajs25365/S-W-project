function ResultsBar({ visibleCount, activeFilterChips }) {
  return (
    <section className="results-row">
      <p className="results-text">
        Showing {visibleCount} movie{visibleCount === 1 ? '' : 's'}
      </p>

      <div className="active-chips">
        {activeFilterChips.length > 0 ? (
          activeFilterChips.map((chip) => (
            <span key={chip} className="chip">
              {chip}
            </span>
          ))
        ) : (
          <span className="chip muted">No active filters</span>
        )}
      </div>
    </section>
  );
}

export default ResultsBar;
