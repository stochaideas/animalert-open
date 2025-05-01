"use client";

import { useState } from "react";
import { Button } from "~/components/ui/simple/button";

import { api } from "~/trpc/react";

import {
  SVGHeart,
  SVGInstagram,
  SVGYoutube,
  SVGFacebook,
  SVGInstagramFilled,
  SVGYoutubeFilled,
  SVGFacebookFilled,
  SVGLogo,
  SVGPaperPage,
  SVGVideoCamera,
  SVGStar,
  SVGMessageBubble,
  SVGAlert,
} from "~/components/icons";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      <div className="text-secondary flex items-center justify-between">
        <SVGAlert className="text-primary" width="46" height="46" />
      </div>
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <Button type="submit" variant="neutral" disabled={createPost.isPending}>
          <SVGHeart />
          {createPost.isPending ? "Submitting..." : "Donează"}
        </Button>
      </form>
    </div>
  );
}
