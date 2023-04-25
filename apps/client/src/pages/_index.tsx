import { Button, Layout } from "components/index";
import { trpc } from "@utils/trpc";
import { withLayout } from "@utils/withLayout";
import tw from "twin.macro";
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { debounce } from "@utils/debounce";
import { flushSync } from "react-dom";
import { useClickedOutside } from "@hooks/useClickedOutside";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from "primereact/multiselect";
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
  const [search, setSearch] = useState<string>("");
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
    const res = await searchMutation.mutateAsync({
      query: query || search,
      ...options,
    } as any);

    setMovies(res.results);
  };

  const handleDropdownSearch = async (value: string) => {
    if (value === "") {
      setShowDropdown(false);
      return;
    } else {
      const res = await searchMutation.mutateAsync({
        query: value,
        ...options,
        limit: 10,
      } as any);

      setDropDownMovies(res.results);
      setShowDropdown(true);
    }
  };

  const debouncedDropdownSearch = (e: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      handleDropdownSearch(e);
    }, 300);
  };
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div
      tw="flex flex-col justify-center 
     w-full md:w-[600px]  p-4 gap-4
    items-center"
    >
      <h1 tw="text-4xl w-fit font-bold text-slate-800">Search Movies</h1>
      <div tw="flex gap-4 mt-4 w-full  ">
        <div tw="relative w-full">
          <AutoComplete
            css={tw`w-full`}
            value={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                handleSearch(dropDownMovies[selectedIndex]?.title || search);
            }}
            inputStyle={{ width: "100%" }}
            suggestions={dropDownMovies}
            completeMethod={(e) => {
              handleDropdownSearch(e.query);
            }}
            onChange={(e) => setSearch(e.value?.title || e.value)}
            field="title"
          />
        </div>
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

let searchGenreTimeout: ReturnType<typeof setTimeout> | null = null;
export const IndexPage = withLayout(() => {
  const { data, isLoading, error } = trpc.movies.list.useQuery(
    {
      limit: 50,
      orderBy: "year",
    },
    { refetchOnWindowFocus: false }
  );

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

  const searchGenreMutation = trpc.genre.search.useMutation();
  const [genreData, setGenreData] = useState<
    | {
        id: number;
        name: string;
      }[]
    | null
  >(null);

  const [selectedGenres, setSelectedGenres] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [searchGenre, setSearchGenre] = useState("");
  return (
    <div tw="flex flex-col gap-4 items-center w-full ">
      <div
        css="
        background-image: radial-gradient(lightgray 2px, transparent 0);
        background-size: 40px 40px;
        background-position: -19px -19px;
      "
        tw="flex flex-col gap-4 pt-14 items-center shrink-0 w-full h-[450px] "
      >
        <Search
          setMovies={setSearchedMovies as any}
          movies={data?.results || []}
        />

        <div css={tw`flex  items-center gap-4 w-2/3 justify-center`}>
          {selectedGenres.length > 0 && (
            <div tw="flex flex-wrap gap-4 h-full justify-center  ">
              {selectedGenres.map((genre) => (
                <div
                  className="group"
                  css={[
                    tw`hover:cursor-pointer hover:bg-red-500 relative `,
                    tw`bg-[#3B82F6] h-full flex items-center  justify-center font-medium text-white p-2 rounded-md`,
                  ]}
                >
                  <div css={tw`group-hover:text-transparent`}>{genre.name}</div>
                  <div
                    onClick={() => {
                      setSelectedGenres(
                        selectedGenres.filter((g) => g.id !== genre.id)
                      );
                    }}
                    css={tw`hidden group-hover:flex absolute w-full h-full top-0 left-0 items-center justify-center`}
                  >
                    <div css={tw` `} className="pi pi-times" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <AutoComplete
            placeholder="Search Genre"
            value={searchGenre}
            inputStyle={{ minWidth: "150px" }}
            size={10}
            suggestions={(genreData || []).filter((genre) => {
              return !selectedGenres.find((g) => g.id === genre.id);
            })}
            field="name"
            forceSelection
            dropdown
            completeMethod={async (e) => {
              const data = await searchGenreMutation.mutateAsync({
                query: e.query,
              });
              setGenreData(data);
            }}
            onChange={(e) => {
              setSearchGenre(e.value?.name || e.value);
            }}
            onSelect={(e) => {
              setSelectedGenres([...selectedGenres, e.value]);
              setSearchGenre("");
            }}
          />
        </div>
      </div>
      <div tw="flex h-1 bg-gray-200 w-full rounded-md mb-10" />

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
