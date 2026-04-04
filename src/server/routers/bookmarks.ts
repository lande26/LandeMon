import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";

export const bookmarkRouter = router({
  addBookmark: protectedProcedure
    .input(z.object({ tmdbId: z.number(), mediaType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.bookmark.create({
        data: {
          userId: ctx.session.user.id,
          tmdbId: input.tmdbId,
          mediaType: input.mediaType,
        },
      });
    }),

  removeBookmark: protectedProcedure
    .input(z.object({ tmdbId: z.number(), mediaType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.bookmark.delete({
        where: {
          userId_tmdbId_mediaType: {
            userId: ctx.session.user.id,
            tmdbId: input.tmdbId,
            mediaType: input.mediaType,
          },
        },
      });
    }),

  getUserBookmarks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.bookmark.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { addedAt: "desc" },
    });
  }),

  isBookmarked: protectedProcedure
    .input(z.object({ tmdbId: z.number(), mediaType: z.string() }))
    .query(async ({ ctx, input }) => {
      const bookmark = await ctx.prisma.bookmark.findUnique({
        where: {
          userId_tmdbId_mediaType: {
            userId: ctx.session.user.id,
            tmdbId: input.tmdbId,
            mediaType: input.mediaType,
          },
        },
      });
      return !!bookmark;
    }),
});
