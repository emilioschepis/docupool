import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import queryClient from "../lib/query/client";
import supabase from "../lib/supabase";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        });

        if (event === "SIGNED_IN") {
          if (typeof router.query.redirectedFrom === "string") {
            router.push(router.query.redirectedFrom);
          } else {
            router.push("/app");
          }
        } else if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
