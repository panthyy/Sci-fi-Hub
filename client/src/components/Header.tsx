import { Button } from "components/index";
import { Link } from "react-router-dom";
import tw from "twin.macro";

const Logo = () => {
  return <div>Logo</div>;
};

export const Header = () => {
  return (
    <header css={tw`flex items-center justify-between px-4 py-2`}>
      <div css={tw`flex items-center`}>
        <Logo />
        <h1 css={tw`ml-2 text-2xl font-semibold font-inter`}>My App</h1>
      </div>
      <nav>
        <ul css={tw`flex items-center`}>
          <li css={tw`ml-4`}>
            <Link to="/">Home</Link>
          </li>
          <li css={tw`ml-4`}>
            <Link to="/about">About</Link>
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
