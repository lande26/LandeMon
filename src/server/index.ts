import { bookmarkRouter } from "@/server/routers/bookmarks";
import { historyRouter } from "@/server/routers/watchHistory";
import { router } from "@/server/trpc";

export const appRouter = router({
  bookmark: bookmarkRouter,
  history: historyRouter,
});

export type AppRouter = typeof appRouter;
