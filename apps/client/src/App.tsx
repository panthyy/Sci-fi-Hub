import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AboutPage, IndexPage, NotFoundPage } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@fontsource/inter/600.css";
import "./App.css";
import { trpc } from "@utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { GlobalStyles as BaseStyles } from "twin.macro";
import React from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { css, Global } from "@emotion/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
]);

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/trpc",

          // You can pass any HTTP headers you wish here
        }),
      ],
    })
  );

  const customStyles = {};

  return (
    <>
      <Global styles={css([BaseStyles])} />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}
