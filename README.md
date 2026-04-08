# Movie4fun App

Movie4fun is a React + Vite movie app that shows trending movies from TMDB and adds interactive features for searching, filtering, sorting, favorites, and theme switching.

## Milestone 3 - Core Features

Implemented features:

- Search movies by title
- Filter movies by rating (6+, 7+, 8+)
- Sort movies by popularity, rating, year, and title (A-Z)
- Button interactions:
  - Favorite or unfavorite a movie
  - View more or view less overview text
- Dark mode and light mode toggle

Important implementation note:

- Search, filtering, and sorting are implemented using array higher-order functions: filter, sort, and map
- No traditional for or while loops are used for these operations

Bonus features included:

- Debounced search input
- Loading indicator
- Local storage persistence for:
  - Theme preference
  - Favorite movies

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- CSS
- TMDB API

## Setup Instructions

1. Install dependencies:

	npm install

2. Copy the sample env file:

	cp .env.example .env

3. Add your TMDB API key in the .env file:

	VITE_TMDB_API_KEY=your_api_key_here

4. Start the development server:

	npm run dev

5. Open the app in browser:

	http://localhost:5173

## Build for Production

Run:

npm run build

The production files are generated in the dist folder.

## Milestone 4 - Documentation, Cleanup, Deployment

Completed:

- README updated with final project details
- Codebase cleaned and refactored for readability
- Interactive features organized with clear state management

Deployment options:

1. Vercel
2. Netlify
3. GitHub Pages (with Vite static build)

Recommended quick deploy:

- Push project to GitHub
- Import repository in Vercel or Netlify
- Set environment variable VITE_TMDB_API_KEY in deployment settings
- Deploy

## Author

- Student project submission for final milestones
