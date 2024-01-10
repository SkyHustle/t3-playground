import Head from "next/head";
import type { NextPage } from "next";
import { api } from "~/utils/api";

const SinglePostPage: NextPage = () => {
  const { data } = api.post.getPost.useQuery({
    id: "8",
  });

  if (!data) return <div>Post does not exist</div>;

  console.log(data);

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="">Single Post Page</div>
      </main>
    </>
  );
};

export default SinglePostPage;
