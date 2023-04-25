// wikipedia scarper https://en.wikipedia.org/wiki/List_of_science_fiction_films_of_the_2020s

currentYear = "";
[...document.querySelector("table.wikitable").querySelectorAll("tr")]
  .reduce((acc, item) => {
    if (
      item.querySelectorAll("a").length === 1 &&
      item.querySelector("a").innerText.startsWith("20")
    ) {
      currentYear = item.querySelector("a").innerText;
      return acc;
    }

    acc.push({
      year: currentYear,
      ...[...item.querySelectorAll("td")].reduce((acc, curr, index) => {
        switch (index) {
          case 0:
            acc["title"] = curr.innerText;
            break;
          case 1:
            acc["director"] = curr.innerText;
          case 2:
            acc["cast"] = curr.innerText
              .trim()
              .split(",")
              .map((item) => item.trim());
          case 3:
            acc["country"] = curr.innerText
              .split("\n")
              .filter((item) => item !== "");
          case 4:
            acc["subgenre"] =
              curr.innerText !== "" ? curr.innerText.split(" ") : [];
        }
        return acc;
      }, {}),
    });
    return acc;
  }, [])
  .filter((item) => item.title);
