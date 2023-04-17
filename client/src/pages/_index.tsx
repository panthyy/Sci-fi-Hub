import { Button, Layout } from "components/index";
import { trpc } from "@utils/trpc";
import { withLayout } from "@utils/withLayout";
import tw from "twin.macro";
import { ChangeEvent, forwardRef, useState } from "react";
import { debounce } from "@utils/debounce";
import { flushSync } from "react-dom";
import { useClickedOutside } from "@hooks/useClickedOutside";

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
};

const Star = ({ color }: { color?: string }) => {
  return (
    <svg
      fill={color || "#999"}
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>star</title>
        <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z"></path>{" "}
      </g>
    </svg>
  );
};
let timeout: ReturnType<typeof setTimeout> | null = null;

const Search = ({
  setMovies,
  movies,
}: {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropDownMovies, setDropDownMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    limit: 100,
    orderBy: "year",
    yearGte: 0,
    yearLte: new Date().getFullYear(),
  });
  const searchMutation = trpc.movies.search.useMutation();

  const handleSearch = async (query?: string) => {
    setLoading(true);
    const res = await searchMutation.mutateAsync({
      query: query || search,
      ...options,
    } as any);

    setShowDropdown(false);

    setLoading(false);
    setMovies(res.results);
  };

  const handleDropdownSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setShowDropdown(false);
      return;
    } else {
      const res = await searchMutation.mutateAsync({
        query: e.target.value,
        ...options,
        limit: 10,
      } as any);

      setDropDownMovies(res.results);
      setShowDropdown(true);
    }
  };

  const DropDown = forwardRef<HTMLDivElement, { selectedIndex: number }>(
    (props: { selectedIndex: number }, ref) => {
      return (
        <div
          ref={ref}
          id="dropdown"
          tw=" absolute px-2 top-12 right-0 py-2 flex flex-col gap-2 w-full bg-gray-100 rounded-lg shadow-md"
        >
          {dropDownMovies.map((movie, i) => (
            <div
              key={movie.id}
              css={[
                tw`border-b border-transparent`,
                tw`hover:cursor-pointer hover:border-gray-300 p-2 transition-all duration-200`,
                selectedIndex === i && tw`bg-gray-200`,
              ]}
            >
              {movie.title}
            </div>
          ))}

          {dropDownMovies.length === 0 && (
            <div tw="p-2">No results found for "{search}"</div>
          )}
        </div>
      );
    }
  );

  const debouncedDropdownSearch = (e: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      handleDropdownSearch(e);
    }, 300);
  };
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropDownRef = useClickedOutside(() => {
    setShowDropdown(false);
  });

  return (
    <div
      tw="flex flex-col justify-center 
     w-full md:w-[600px] h-full p-4 gap-4
    items-center"
    >
      <h1 tw="text-4xl w-fit font-bold text-slate-800">Search Movies</h1>
      <div tw="flex gap-4 mt-4 w-full  ">
        <div tw="relative w-full">
          <input
            type="text"
            placeholder="Search"
            onKeyDown={async (e) => {
              if (e.key === "Escape") {
                setSelectedIndex(-1);
              }
              if (e.key === "Enter") {
                if (dropDownMovies[selectedIndex]) {
                  flushSync(() => {
                    setSearch(dropDownMovies[selectedIndex].title);
                    handleSearch(dropDownMovies[selectedIndex].title);
                  });
                } else {
                  handleSearch();
                }
                setShowDropdown(false);
              }
              console.log(e.key);
              if (e.key === "ArrowDown") {
                if (selectedIndex < dropDownMovies.length - 1) {
                  setSelectedIndex(selectedIndex + 1);
                } else {
                  setSelectedIndex(0);
                }
              }
              if (e.key === "ArrowUp") {
                if (selectedIndex > 0) {
                  setSelectedIndex(selectedIndex - 1);
                } else {
                  setSelectedIndex(dropDownMovies.length - 1);
                }
              }
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedDropdownSearch(e);
            }}
            tw="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
          {showDropdown && (
            <DropDown ref={dropDownRef} selectedIndex={selectedIndex} />
          )}
        </div>
        <Button primary onClick={handleSearch} loading={loading}>
          Search
        </Button>
      </div>
    </div>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <div
      tw="flex flex-col justify-between hover:cursor-pointer
    hover:shadow-lg hover:scale-105 transition-all duration-200
    h-48 w-1/4 p-4 bg-gray-100 rounded-lg shadow-md"
    >
      <div tw="flex flex-col ">
        <h2 tw="text-2xl text-slate-800 font-bold">{movie.title}</h2>
        <p tw="text-lg  text-slate-600">{movie.year}</p>
      </div>
      <div tw=" flex gap-0.5">
        {Array.from({ length: movie.rating }, (_, i) => (
          <Star key={i} color="gold" />
        ))}
        {Array.from({ length: 5 - movie.rating }, (_, i) => (
          <Star key={i} />
        ))}
      </div>
    </div>
  );
};
export const IndexPage = withLayout(() => {
  const { data, isLoading, error } = trpc.movies.list.useQuery({
    limit: 50,
    orderBy: "year",
  });
  const { data: genres, isLoading: genresLoading } = trpc.genre.list.useQuery({
    limit: 10,
  });

  const [searchedMovies, setSearchedMovies] = useState<Movie[] | null>(null);

  const GenreToggle = ({
    toggleGenre,
    genre,
  }: {
    toggleGenre: (genre: string) => void;
    genre: string;
  }) => {
    const [active, setActive] = useState(false);
    return (
      <Button
        {...{
          primary: active,
          outline: !active,
        }}
        primary
        onClick={() => {
          setActive(!active);
          toggleGenre(genre);
        }}
      >
        {genre}
      </Button>
    );
  };

  const GenreGroup = () => {
    const [choosen, setChoosen] = useState<string[]>([]);

    const toggleGenre = (genre: string) => {
      if (choosen.includes(genre)) {
        setChoosen(choosen.filter((g) => g !== genre));
      } else {
        setChoosen([...choosen, genre]);
      }
    };

    return (
      <div tw="flex flex-wrap gap-4 justify-center ">
        {genres?.results?.map((genre) => (
          <GenreToggle
            key={genre.id}
            genre={genre.name}
            toggleGenre={toggleGenre}
          />
        ))}
      </div>
    );
  };

  return (
    <div tw="flex flex-col gap-4 items-center w-full pt-12">
      <h5 tw=" font-bold"> Total Movies: {data?.total}</h5>
      <Search
        setMovies={setSearchedMovies as any}
        movies={data?.results || []}
      />
      <div tw="flex flex-wrap gap-4 justify-center mt-12">
        <GenreGroup />
        <Button primary outline>
          More...
        </Button>
      </div>

      <div tw="flex flex-wrap gap-4 justify-center w-full mt-12">
        {isLoading && <div tw="text-2xl font-bold">Loading...</div>}

        {searchedMovies
          ? searchedMovies.length > 0
            ? searchedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            : "No movies found"
          : data?.results?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>
    </div>
  );
});
