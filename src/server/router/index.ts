// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { postRouter } from "./posts";
import { commentRouter } from "./comment";
import { userRouter } from "./user";
import { bookmarkRouter } from "./bookmark";
import { tagRouter } from "./tag";
import { communityRouter } from "./community";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("question.", protectedExampleRouter)
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("user.", userRouter)
  .merge("bookmarks.", bookmarkRouter)
  .merge("tags.", tagRouter)
  .merge("community.", communityRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
