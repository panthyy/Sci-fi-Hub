// withLayout util that takes in a layout,children and returns a component

import { Layout } from "components/index";

export const withLayout = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  _Layout: (props: { children: React.ReactNode }) => JSX.Element = Layout
) => {
  return function withLayoutComponent(props: T) {
    return (
      <_Layout>
        <Component {...props} />
      </_Layout>
    );
  };
};
