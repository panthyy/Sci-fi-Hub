import { Button, Layout } from "components/index";
import { trpc } from "@utils/trpc";
import { withLayout } from "@utils/withLayout";
import tw from "twin.macro";
import { useState } from "react";

export const IndexPage = withLayout(() => {
  const { data, isLoading, error } = trpc.example.hello.useQuery();

  const [loading, setLoading] = useState(false);

  return (
    <div css={tw`flex w-full h-full justify-center items-center`}>
      <div css={tw`flex flex-col gap-2`}>
        <Button onClick={() => setLoading(!loading)} loading={loading} primary>
          Click me!
        </Button>
        <Button primary>Click me!</Button>
        <Button primary disabled>
          Click me!
        </Button>

        <Button primary outline>
          Click me!
        </Button>
        <Button primary disabled outline>
          Click me!
        </Button>
      </div>
      <div css={tw`flex flex-col gap-2 ml-4`}>
        <Button danger>Click me!</Button>
        <Button danger disabled>
          Click me!
        </Button>
        <Button danger outline>
          Click me!
        </Button>

        <Button danger disabled outline>
          Click me!
        </Button>
      </div>
      <div css={tw`flex flex-col gap-2 ml-4`}>
        <Button success>Click me!</Button>
        <Button success disabled>
          Click me!
        </Button>
        <Button success outline>
          Click me!
        </Button>

        <Button success disabled outline>
          Click me!
        </Button>
      </div>
    </div>
  );
});
