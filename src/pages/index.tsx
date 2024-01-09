import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { useState } from "react";
import toast from "react-hot-toast";
import { type NextPage } from "next";
import Link from "next/link";
dayjs.extend(relativeTime);

const CreatePost: NextPage = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  // grab the context of the trpc cache
  const ctx = api.useUtils();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      // disregard(void) the promise since we don't need to wait for it
      void ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 ">
      <UserButton />
      <input
        placeholder="Type some emojis"
        className="grow border border-slate-400 bg-transparent px-3"
        type="text"
        value={input}
        disabled={isPosting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      <button
        className="border border-slate-400 bg-transparent px-3"
        onClick={() => {
          mutate({ content: input });
        }}
        disabled={isPosting}
      >
        {isPosting ? <LoadingSpinner /> : "Post"}
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        width={48}
        height={48}
        src={author.profileImageUrl}
        alt="Profile Image"
        className="h-12 w-12 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt,
            ).fromNow()} `}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading)
    return (
      <LoadingSpinner
        size={60}
        className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center"
      />
    );
  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isSignedIn } = useUser();
  // will be cached by react-query
  api.post.getAll.useQuery();

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {isSignedIn ? (
              <div>
                <CreatePost />
              </div>
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
