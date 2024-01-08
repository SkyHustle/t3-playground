import Head from "next/head";
import { type NextPage } from "next";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>T3 Playground</title>
        <meta name="description" content="Playground for learning T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="">Profile View</div>
      </main>
    </>
  );
};

export default ProfilePage;
