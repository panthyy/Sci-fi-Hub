import { withLayout } from "@utils/withLayout";
import tw from "twin.macro";

export const AboutPage = withLayout(() => {
  return (
    <div css={tw`flex flex-col items-center justify-center h-full`}>
      <h1 css={tw`text-4xl font-bold`}>About</h1>
      <p css={tw`mt-4 text-center`}>
        This is an example of a Next.js app with Tailwind CSS and TypeScript.
      </p>
    </div>
  );
});
