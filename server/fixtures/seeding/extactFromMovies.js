const movies = require("./movies.json");
const fs = require("fs");
const path = require("path");

/**
 * actors {
 * name: "John Doe"}
 */
const actors = movies.reduce((acc, movie) => {
  movie.cast.forEach((actor) => {
    acc.push({ name: actor });
  });
  return acc;
}, []);

const countries = movies.reduce((acc, movie) => {
  movie.country.forEach((country) => {
    acc.push({ name: country });
  });
  return acc;
}, []);

const uniqueCountries = [...new Set(countries.map((item) => item.name))].map(
  (item) => ({ name: item })
);

const uniqueActors = [...new Set(actors)];

const directors = movies.reduce((acc, movie) => {
  acc.push({ name: movie.director });
  return acc;
}, []);

const uniqueDirectors = [...new Set(directors.map((item) => item.name))].map(
  (item) => ({ name: item })
);

const genres = movies.reduce((acc, movie) => {
  movie.genres.forEach((genre) => {
    acc.push({ name: genre });
  });
  return acc;
}, []);

const uniquegenres = [...new Set(genres.map((item) => item.name))].map(
  (item) => ({ name: item })
);

fs.writeFileSync(
  path.join(__dirname, "genres.json"),
  JSON.stringify(uniquegenres, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, "actors.json"),
  JSON.stringify(uniqueActors, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, "countries.json"),
  JSON.stringify(uniqueCountries, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, "directors.json"),
  JSON.stringify(uniqueDirectors, null, 2)
);
