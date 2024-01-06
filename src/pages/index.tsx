import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import { api } from "~/utils/api";

export default function Home() {
  const user = useUser();
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong...</div>;

  return (
    <>
      <Head>
        <title>T3 Playground</title>
        <meta name="description" content="Playground for learning T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {user.isSignedIn ? (
              <SignOutButton />
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {data?.map((post) => (
              <div className="border-b border-slate-400 p-8" key={post.id}>
                {post.content}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
