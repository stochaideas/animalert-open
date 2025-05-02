import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { UserController } from "./user.controller";
import { insertUserSchema } from "./user.schema";
import { phoneNumberRefine } from "~/lib/mobile-validator";

const userController = new UserController();

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return userController.getAllUsers();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return userController.getUserById(input.id);
    }),

  getByPhone: publicProcedure
    .input(
      z.object({
        phone: z.string().refine(phoneNumberRefine),
      }),
    )
    .query(({ input }) => {
      return userController.getUserByPhone(input.phone);
    }),

  create: publicProcedure.input(insertUserSchema).mutation(({ input }) => {
    return userController.createUser(input);
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertUserSchema.partial(),
      }),
    )
    .mutation(({ input }) => {
      return userController.updateUser(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return userController.deleteUser(input.id);
    }),
});
