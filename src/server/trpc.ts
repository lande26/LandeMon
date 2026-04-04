import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth, prisma } from "@/auth";

export const createTRPCContext = async () => {
  const session = await auth();
  return {
    session,
    prisma,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  const userId = ctx.session?.user?.id;
  if (!ctx.session?.user || !userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: { ...ctx.session.user, id: userId } },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
