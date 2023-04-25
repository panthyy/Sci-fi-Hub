import * as cheerio from "cheerio";
import fs from "fs";
import meta from "./meta.json" assert { type: "json" };

const { entry: entryUrl } = meta;

const fetcher = async (url: string) => {
  return await fetch(url).then((res) => res.text());
};

const initializeUrls = async () => {
  const $ = cheerio.load(await fetcher(entryUrl));

  const urls = $(".div-col")
    .first()
    .find("li")
    .find("a")
    .map((i, el) => {
      return $(el).attr("href");
    })
    .get();

  let newMeta = {
    ...meta,
    urls: [...new Set([...meta.urls, ...urls])],
  };
  fs.writeFileSync("./meta.json", JSON.stringify(newMeta, null, 2));

  return newMeta;
};

const parseCasts = (str: string) => {
  if (str === "") return [];
  return str.split(",").map((c) => {
    return c.trim();
  });
};

const parseGenres = (str: string) => {
  if (str === "") return [];

  return str
    .trim()
    .split(" ")
    .map((g) => {
      return g.replace(/\[.*\]/, "").trim();
    })
    .filter((g) => g !== "");
};

const parseCountry = (str: string) => {
  return str
    .trim()
    .split(",")
    .map((g) => {
      return g.replace(/\[.*\]/, "").trim();
    });
};

const { urls } = await initializeUrls();

const fetchAndParse = async (url: string) => {
  const $ = cheerio.load(await fetcher(url));
  const table = $(".wikitable").first();
  let headers: string[] = [];
  let data: { [key: string]: string }[] = [];
  let year = "";

  const isHeaderRow = (i: number, el: cheerio.Element) => {
    return $(el).find("th").length > 0;
  };
  table.find("tr").each((i, el) => {
    if (isHeaderRow(i, el)) {
      headers = $(el)
        .find("th")
        .map((i, el) => {
          return $(el).text();
        })
        .get();
    }

    if ($(el).find("td").length === 1) {
      year = $(el).find("td").text();
    } else if (headers.length > 0) {
      const td = $(el)
        .find("td")
        .map((i, el) => {
          return $(el).text();
        })
        .get()
        .reduce((acc: { [key: string]: any }, curr, i) => {
          const key = headers[i]?.trim().toLowerCase();
          const value = curr?.trim();

          if (!key) return acc;

          if (key === "cast") acc[key] = parseCasts(value);

          if (key === "genre" || key === "subgenre/notes")
            acc["genre"] = parseGenres(value);

          if (key === "country") acc[key] = parseCountry(value);

          if (key === "title") acc[key] = value;

          if (key === "director") acc[key] = value;

          acc["year"] = year.trim();

          return acc;
        }, {});

      // check if td is empty
      if (Object.keys(td).length > 0) {
        data.push(td);
      }
    }
  });

  return data;
};

let movies: { [key: string]: string }[] = [];

for (const url of urls) {
  const data = await fetchAndParse("https://en.wikipedia.org" + url);
  movies = [...movies, ...data];
}

const extractGenres = (movies: { [key: string]: string }[]) => {
  const genres = movies.reduce(
    (
      acc: string[],
      curr: {
        genre?: string[];
      }
    ) => {
      return [...acc, ...(curr.genre ?? [])];
    },
    []
  );

  return [...new Set(genres)];
};

const extractCountries = (movies: { [key: string]: string }[]) => {
  const countries = movies.reduce((acc: string[], curr) => {
    return [...acc, ...(curr.countries ?? [])];
  }, []);

  return [...new Set(countries)];
};

const extractDirectors = (movies: { [key: string]: string }[]) => {
  const directors = movies.reduce((acc: string[], curr) => {
    return [...acc, ...(curr.director ?? []).split(",")];
  }, []);

  return [...new Set(directors)];
};

const extractActors = (movies: { [key: string]: string }[]) => {
  const actors = movies.reduce((acc: string[], curr) => {
    return [...acc, ...(curr.cast ?? [])];
  }, []);

  return [...new Set(actors)];
};

const genres = extractGenres(movies);
const countries = extractCountries(movies);
const directors = extractDirectors(movies);
const actors = extractActors(movies);

fs.writeFileSync("./data/movies.json", JSON.stringify(movies, null, 2));
fs.writeFileSync("./data/genres.json", JSON.stringify(genres, null, 2));
fs.writeFileSync("./data/countries.json", JSON.stringify(countries, null, 2));
fs.writeFileSync("./data/directors.json", JSON.stringify(directors, null, 2));
fs.writeFileSync("./data/actors.json", JSON.stringify(actors, null, 2));
