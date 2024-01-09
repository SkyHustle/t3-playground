import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db,
      userId: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug as string;

  if (typeof slug !== "string") throw new Error("slug is not a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "skyhustle",
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>404 Not found</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="">Profile View for @{data.username}</div>
      </main>
    </>
  );
};

export default ProfilePage;
