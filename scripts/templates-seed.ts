import fs from "fs/promises";
import path from "path";
import { complaintTemplates } from "~/server/api/modules/complaint-template/complaint_template.schema";
import {
  complaintCategories,
  complaintCategoryInstitutions,
  docTypes,
  institutions,
} from "~/server/api/modules/complaint/complaint_taxonomy.schema";
import { db } from "~/server/db";

type IdMap = Map<string, number>;

const CATEGORY_SEED = [
  { codeAlpha: "POA", codeNumeric: "01", name: "Poaching" },
  { codeAlpha: "WLD", codeNumeric: "02", name: "Wildlife Issue" },
  { codeAlpha: "WST", codeNumeric: "03", name: "Waste" },
  { codeAlpha: "PLT", codeNumeric: "04", name: "Pollution" },
  { codeAlpha: "CNS", codeNumeric: "05", name: "Illegal Constructions" },
  { codeAlpha: "OFR", codeNumeric: "06", name: "Off-road Activity" },
  { codeAlpha: "CND", codeNumeric: "07", name: "Bad Animal Conditions" },
  { codeAlpha: "CRU", codeNumeric: "08", name: "Cruelty" },
  { codeAlpha: "INF", codeNumeric: "09", name: "Information Request" },
  { codeAlpha: "MCD", codeNumeric: "10", name: "Misconduct" },
  { codeAlpha: "INS", codeNumeric: "11", name: "Internal Matter" },
  { codeAlpha: "REP", codeNumeric: "12", name: "Institutional Report" },
];

const INSTITUTION_SEED = [
  { code: "POL", name: "Police" },
  { code: "ENV", name: "Environmental Authority" },
  { code: "GNM", name: "National Environmental Guard" },
  { code: "APM", name: "Environmental Protection Agency" },
  { code: "WAT", name: "Water Authority" },
  { code: "VET", name: "Veterinary Authority" },
  { code: "ISU", name: "Firefighters" },
];

const DOC_TYPE_SEED = [
  { code: "PET", name: "Petition", description: "Petitii publice" },
  { code: "ADR", name: "Adresa", description: "Adrese generale" },
  { code: "CMP", name: "Complaint", description: "Plangeri formale" },
  { code: "MEM", name: "Memorandum", description: "Memoriu oficial" },
  { code: "DCL", name: "Declaration", description: "Declaratii" },
];

const CATEGORY_INSTITUTION_MAP: Record<string, string[]> = {
  POA: ["POL"],
  WLD: ["POL"],
  WST: ["ENV"],
  PLT: ["ENV"],
  CNS: ["POL"],
  OFR: ["POL", "GNM"],
  CND: ["VET"],
  CRU: ["POL"],
  INF: ["ENV"],
  MCD: ["POL"],
  INS: ["POL"],
  REP: ["ENV"],
};

const TEMPLATE_FILES = [
  { displayName: "DEPUNERE ILEGALA DE DESEURI", name: "petitie-deseu.html", categoryCode: "WST" },
  { displayName: "CRUZIME IMPOTRIVA ANIMALELOR", name: "petitie-cruzime.html", categoryCode: "CRU" },
  { displayName: "BRACONAJ", name: "petitie-braconaj.html", categoryCode: "POA" },
];

async function seedCategories(): Promise<IdMap> {
  const map: IdMap = new Map();
  for (const cat of CATEGORY_SEED) {
    const [row] = await db
      .insert(complaintCategories)
      .values(cat)
      .onConflictDoUpdate({
        target: complaintCategories.codeAlpha,
        set: {
          codeNumeric: cat.codeNumeric,
          name: cat.name,
        },
      })
      .returning({ id: complaintCategories.id, codeAlpha: complaintCategories.codeAlpha });
    if (row) map.set(row.codeAlpha, row.id);
  }
  return map;
}

async function seedInstitutions(): Promise<IdMap> {
  const map: IdMap = new Map();
  for (const inst of INSTITUTION_SEED) {
    const [row] = await db
      .insert(institutions)
      .values(inst)
      .onConflictDoUpdate({
        target: institutions.code,
        set: { name: inst.name },
      })
      .returning({ id: institutions.id, code: institutions.code });
    if (row) map.set(row.code, row.id);
  }
  return map;
}

async function seedDocTypes() {
  for (const doc of DOC_TYPE_SEED) {
    await db
      .insert(docTypes)
      .values(doc)
      .onConflictDoUpdate({
        target: docTypes.code,
        set: { name: doc.name, description: doc.description },
      });
  }
}

async function seedCategoryInstitutionMap(categoryMap: IdMap, institutionMap: IdMap) {
  for (const [categoryCode, instCodes] of Object.entries(CATEGORY_INSTITUTION_MAP)) {
    const categoryId = categoryMap.get(categoryCode);
    if (!categoryId) continue;
    for (const code of instCodes) {
      const institutionId = institutionMap.get(code);
      if (!institutionId) continue;
      await db
        .insert(complaintCategoryInstitutions)
        .values({ categoryId, institutionId })
        .onConflictDoNothing({
          target: [
            complaintCategoryInstitutions.categoryId,
            complaintCategoryInstitutions.institutionId,
          ],
        });
    }
  }
}

async function seedTemplates(categoryMap: IdMap) {
  for (const file of TEMPLATE_FILES) {
    const filePath = path.join(process.cwd(), "petition-templates", file.name);
    const html = await fs.readFile(filePath, "utf-8");
    const categoryId = categoryMap.get(file.categoryCode) ?? null;

    await db
      .insert(complaintTemplates)
      .values({
        name: file.name,
        displayName: file.displayName,
        html,
        categoryId,
      })
      .onConflictDoUpdate({
        target: complaintTemplates.name,
        set: { html, categoryId },
      });

    console.log(`Seeded template: ${file.name}`);
  }
}

async function main() {
  const categoryMap = await seedCategories();
  const institutionMap = await seedInstitutions();
  await seedDocTypes();
  await seedCategoryInstitutionMap(categoryMap, institutionMap);
  await seedTemplates(categoryMap);
}

main()
  .then(() => {
    console.log("All templates seeded with taxonomy!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
