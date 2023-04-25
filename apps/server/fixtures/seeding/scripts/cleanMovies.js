const movies = require("../movies.json");
const fs = require("fs");
const path = require("path");

const newMovies = movies.reduce((acc, movie) => {
  if (movie.title === "") {
    return acc;
  }
  if (!movie.cast) {
    return acc;
  }

  acc.push(movie);

  return acc;
}, []);

fs.writeFileSync(
  path.join(__dirname, "../newMovies.json"),
  JSON.stringify(newMovies, null, 2)
);
