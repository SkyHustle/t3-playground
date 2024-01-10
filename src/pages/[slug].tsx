import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import PostView from "~/components/postview";

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

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
      username,
      // could set custom refetch and revalidate times here
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) {
    return (
      <LoadingSpinner
        size={60}
        className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center"
      />
    );
  }

  if (!data || data.length === 0) {
    return <div>User has No posts</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((fullPost) => {
        return <PostView key={fullPost.post.id} {...fullPost} />;
      })}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404 Not found</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-48  bg-slate-500">
          <Image
            className="absolute bottom-0 left-0 -mb-[64px] ml-6 rounded-full border-4 border-black"
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export default ProfilePage;
