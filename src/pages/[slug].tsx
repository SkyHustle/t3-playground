import Head from "next/head";
import { type NextPage } from "next";
import { api } from "~/utils/api";

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
