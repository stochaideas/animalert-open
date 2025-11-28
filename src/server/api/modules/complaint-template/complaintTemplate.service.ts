import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { complaintCategories } from "../complaint/complaint_taxonomy.schema";
import { complaintTemplates } from "./complaint_template.schema";

export class ComplaintTemplateService {
  async getTemplate(id: number, tx = db) {
    const [template] = await tx
      .select({
        html: complaintTemplates.html,
        displayName: complaintTemplates.displayName,
        categoryId: complaintTemplates.categoryId,
        categoryCodeAlpha: complaintCategories.codeAlpha,
        categoryCodeNumeric: complaintCategories.codeNumeric,
      })
      .from(complaintTemplates)
      .leftJoin(
        complaintCategories,
        eq(complaintCategories.id, complaintTemplates.categoryId),
      )
      .where(eq(complaintTemplates.id, id));

    return template ?? null;
  }

  async getTemplateTypes() {
    const result = await db
      .select({
        id: complaintTemplates.id,
        displayName: complaintTemplates.displayName,
      })
      .from(complaintTemplates);
    return result;
  }
}
