import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>T3 Playground</title>
        <meta name="description" content="Playground for learning T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" />
      <Component {...pageProps} />
      <SpeedInsights />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
