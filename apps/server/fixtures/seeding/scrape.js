currentYear = "";
[...document.querySelector("table.wikitable").querySelectorAll("tr")]
  .reduce((acc, item) => {
    if (
      item.querySelectorAll("a").length === 1 &&
      item.querySelector("a").innerText.startsWith("20") |
        item.querySelector("a").innerText.startsWith("19")
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
            if (curr.innerText !== "") {
              let ss = curr.textContent
                .replace(/\[[^\]]*\]/g, "")
                .trim()
                .toLowerCase();

              result = [];

              ["time travel"].forEach((item) => {
                if (ss.indexOf(item) !== -1) {
                  ss.replace(item);

                  result.push(
                    item
                      .split(" ")
                      .filter((item) => item.lenght !== 0)
                      .map((item) => item[0].toUpperCase() + item.slice(1))
                      .join(" ")
                  );
                }
              });

              acc["genres"] = [
                ...result,
                ...ss
                  .split(" ")
                  .filter((item) => item !== "")
                  .map((item) => item[0].toUpperCase() + item.slice(1)),
              ];
            } else {
              acc["genres"] = [];
            }

            break;
        }
        return acc;
      }, {}),
    });
    return acc;
  }, [])
  .filter((item) => item.title);
