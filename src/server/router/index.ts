// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { postRouter } from "./posts";
import { commentRouter } from "./comment";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("question.", protectedExampleRouter)
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
