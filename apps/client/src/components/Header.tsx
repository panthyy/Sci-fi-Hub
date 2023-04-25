import { Button } from "components/index";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { HubLogo } from "./HubLogo";
import { SLogo } from "./SLogo";

const Logo = () => {
  return <div>Logo</div>;
};

export const Header = () => {
  return (
    <header css={tw`flex items-center justify-between px-4 py-4`}>
      <a href="/" css={tw`flex items-center gap-2`}>
        <SLogo />
        <h1 css={tw`ml-2 text-2xl text-slate-600 font-bold font-inter`}>
          Sci-Fi Hub
        </h1>
      </a>
      <nav>
        <ul css={tw`flex items-center list-none`}>
          <li css={tw`ml-4`}>
            <Link to="/">Popular</Link>
          </li>
          <li css={tw`ml-4`}>
            <Link to="/upcoming">Upcoming</Link>
          </li>
          <li css={tw`ml-4`}>
            <Link to="/top">Top Rated</Link>
          </li>
          <li css={tw`ml-4`}>
            <Link to="/now">Now Playing</Link>
          </li>
        </ul>
      </nav>
      <div css={tw`flex items-center`}>
        <Button primary onClick={() => console.log("Clicked!")}>
          Click me!
        </Button>
      </div>
    </header>
  );
};
