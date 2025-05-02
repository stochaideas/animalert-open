import { UserService } from "./user.service";
import { TRPCError } from "@trpc/server";
import { type insertUserSchema } from "./user.schema";
import { type z } from "zod";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers() {
    return this.userService.findAll();
  }

  async getUserById(id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with id ${id} not found`,
      });
    }
    return user;
  }

  async createUser(userData: z.infer<typeof insertUserSchema>) {
    return this.userService.create(userData);
  }

  async updateUser(
    id: string,
    userData: Partial<z.infer<typeof insertUserSchema>>,
  ) {
    const user = await this.userService.update(id, userData);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with id ${id} not found`,
      });
    }
    return user;
  }

  async deleteUser(id: string) {
    const success = await this.userService.delete(id);
    if (!success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with id ${id} not found`,
      });
    }
    return { success };
  }
}
