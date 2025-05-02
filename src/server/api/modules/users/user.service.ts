import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users, type InsertUser, type User } from "./user.schema";

export class UserService {
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (!result[0]) {
      throw new Error("User not found");
    }

    return result[0];
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.phone, phone));
    if (!result[0]) {
      return undefined;
    }

    return result[0];
  }

  async create(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    if (!result[0]) {
      throw new Error("Failed to create user");
    }

    return result[0];
  }

  async update(
    id: string,
    userData: Partial<InsertUser>,
  ): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return !!result;
  }
}
