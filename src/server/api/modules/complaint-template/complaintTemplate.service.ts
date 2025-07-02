import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { complaintTemplates } from "./complaint_template.schema";

export class ComplaintTemplateService {
  async getTemplate(id: number) {
    const [template] = await db
      .select({ html: complaintTemplates.html })
      .from(complaintTemplates)
      .where(eq(complaintTemplates.id, id));

    return template?.html ?? null;
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
