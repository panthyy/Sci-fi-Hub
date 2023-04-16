import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AboutPage, IndexPage, NotFoundPage } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@fontsource/inter/600.css";
import "./App.css";
import { trpc } from "@utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { GlobalStyles } from "twin.macro";
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
          url: "http://localhost:8787/trpc",
          // You can pass any HTTP headers you wish here
        }),
      ],
    })
  );

  console.log("trpcClient", trpcClient);
  console.log("queryClient", queryClient);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <GlobalStyles />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
