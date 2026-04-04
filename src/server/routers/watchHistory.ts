import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";

export const historyRouter = router({
  logHistory: protectedProcedure
    .input(
      z.object({
        tmdbId: z.number(),
        mediaType: z.string(),
        progress: z.number().optional().default(0), // Can't fetch actual progress safely due to iframe CORS, defaults to 0
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.watchHistory.upsert({
        where: {
          userId_tmdbId_mediaType: {
            userId: ctx.session.user.id,
            tmdbId: input.tmdbId,
            mediaType: input.mediaType,
          },
        },
        update: {
          progress: input.progress,
          watchedAt: new Date(),
        },
        create: {
          userId: ctx.session.user.id,
          tmdbId: input.tmdbId,
          mediaType: input.mediaType,
          progress: input.progress,
        },
      });
    }),

  getUserHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.watchHistory.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { watchedAt: "desc" },
    });
  }),
});
