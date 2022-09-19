// src/server/router/index.ts
import superjson from 'superjson';
import postRouter from '@/server/router/posts';
import commentRouter from '@/server/router/comment';
import userRouter from '@/server/router/user';
import bookmarkRouter from '@/server/router/bookmark';
import tagRouter from '@/server/router/tag';
import communityRouter from '@/server/router/community';
import searchRouter from '@/server/router/search';
import exploreRouter from '@/server/router/explore';
import notificationRouter from '@/server/router/notification';
import { createRouter } from './context';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('post.', postRouter)
  .merge('comment.', commentRouter)
  .merge('user.', userRouter)
  .merge('bookmarks.', bookmarkRouter)
  .merge('tags.', tagRouter)
  .merge('community.', communityRouter)
  .merge('search.', searchRouter)
  .merge('explore.', exploreRouter)
  .merge('notification.', notificationRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
