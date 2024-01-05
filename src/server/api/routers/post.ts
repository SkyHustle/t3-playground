import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  timedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // These are all procedures that are available on the postRouter
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      console.log(Object.keys(ctx));
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  experiment: timedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      console.log(Object.keys(ctx));
      if (Math.random() < 0.5) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
