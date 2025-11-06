const apiKey = "382c2cd5"; // my key
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieResults = document.getElementById("movieResults");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

let currentMovies = [];

//Search
searchBtn.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovies();
});

//Sort
sortSelect.addEventListener("change", sortMovies);

//Toggle dark/light theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  movieResults.innerHTML = `<p>Loading...</p>`;
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      currentMovies = data.Search;
      displayMovies(currentMovies);
    } else {
      movieResults.innerHTML = `<p>No results found. Try another search.</p>`;
    }
  } catch {
    movieResults.innerHTML = `<p>Error fetching data. Please try again.</p>`;
  }
}

function displayMovies(movies) {
  movieResults.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Image"}" alt="${movie.Title}">
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          <p>${movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</p>
        </div>
      </div>
    `
    )
    .join("");
}

function sortMovies() {
  if (sortSelect.value === "default" || currentMovies.length === 0) return;

  if (sortSelect.value === "yearAsc")
    currentMovies.sort((a, b) => a.Year.localeCompare(b.Year));
  else if (sortSelect.value === "yearDesc")
    currentMovies.sort((a, b) => b.Year.localeCompare(a.Year));
  else if (sortSelect.value === "titleAsc")
    currentMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  else if (sortSelect.value === "titleDesc")
    currentMovies.sort((a, b) => b.Title.localeCompare(a.Title));

  displayMovies(currentMovies);
}
