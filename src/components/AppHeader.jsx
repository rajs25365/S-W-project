function AppHeader({ moviesCount, favoritesCount, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="brand-block">
        <h1 className="logo">Movie4fun</h1>
        <span className="subtitle">Discover this week&apos;s trending stories</span>
      </div>

      <div className="header-actions">
        <div className="quick-stats">
          <span>{moviesCount} movies</span>
          <span>{favoritesCount} favorites</span>
        </div>

        <button className="theme-toggle" onClick={onToggleTheme} type="button">
          {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
