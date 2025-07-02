import fs from "fs/promises";
import path from "path";
import { complaintTemplates } from "~/server/api/modules/complaint-template/complaint_template.schema";
import { db } from "~/server/db";

async function seedTemplates() {
  const files = [
    { displayName: "DEPUNERE ILEGALĂ DE DEȘEURI", name: "petitie-deseu.html" },
    {
      displayName: "CRUZIME ÎMPOTRIVA ANIMALELOR",
      name: "petitie-cruzime.html",
    },
    { displayName: "BRACONAJ", name: "petitie-braconaj.html" },
  ];

  for (const file of files) {
    const name = file.name.replace(".html", "");
    const filePath = path.join(process.cwd(), "petition-templates", file.name);
    const html = await fs.readFile(filePath, "utf-8");

    await db
      .insert(complaintTemplates)
      .values({
        name: file.name,
        displayName: file.displayName,
        html,
      })
      .onConflictDoUpdate({
        target: complaintTemplates.id,
        set: { html },
      });

    console.log(`Seeded template: ${name}`);
  }
}

seedTemplates()
  .then(() => {
    console.log("All templates seeded!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
