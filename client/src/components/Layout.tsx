import { Header } from "components/index";
import tw from "twin.macro";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div css={tw`flex flex-col w-full h-full `}>
      <Header />
      {children}
    </div>
  );
};
