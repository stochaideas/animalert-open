import { useState, type Dispatch } from "react";
import {
  recommendationsOptions,
  type SectionItem,
} from "../_constants/recommendations-options";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/simple/select"; // Adjust import path as needed
import { SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";

function renderSectionItems(items: SectionItem[]) {
  return (
    <ul className="text-body list-inside list-disc space-y-2 pl-4">
      {items.map((item, idx) =>
        typeof item === "string" ? (
          <li key={idx}>{item}</li>
        ) : (
          <li key={idx}>
            {item.text}
            <ol className="text-body-small mt-1 list-disc pl-5">
              {item.sublist.map((sub, subIdx) => (
                <li key={subIdx}>{sub}</li>
              ))}
            </ol>
          </li>
        ),
      )}
    </ul>
  );
}

export default function Recommendations({
  setRecommendationsFinished,
}: {
  setRecommendationsFinished: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selected, setSelected] = useState(
    recommendationsOptions[0]?.name ?? "",
  );
  const animal = recommendationsOptions.find((a) => a.name === selected)!;

  return (
    <section className="bg-neutral text-neutral-foreground border-tertiary-border mb-4 flex flex-col gap-6 rounded-md border-1 px-4 py-8 md:p-12">
      <div>
        <h1 className="text-heading-3 mb-2">
          Specii considerate nedorite, periculoase, dăunătoare sau neobisnuite
        </h1>
        <h2 className="text-subheading">
          - Recomandări de gestionare a interacțiunilor nedorite și a
          conflictelor -
        </h2>
      </div>
      <label htmlFor="animal-select" className="text-body block font-semibold">
        Selectează specia despre care vrei să primești informații:
      </label>
      <Select onValueChange={setSelected} defaultValue={selected}>
        <SelectTrigger className="text-body w-full p-6 hover:cursor-pointer">
          <SelectValue placeholder="Selectează animal" />
        </SelectTrigger>
        <SelectContent className="bg-neutral">
          {recommendationsOptions.map((a) => (
            <SelectItem
              className="hover:bg-neutral-hover text-body hover:cursor-pointer"
              key={a.name}
              value={a.name}
            >
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-heading-2 mt-6 mb-4 flex flex-col items-start gap-1 font-bold md:flex-row md:items-center md:gap-3">
        <div>
          <span className="mr-1">{animal.emoji}</span>
          <span>{animal.name}</span>
        </div>
        <span className="text-body-small text-gray-500 italic md:ml-2">
          ({animal.scientificName})
        </span>
      </div>

      {animal.sections.map((section, idx) => (
        <div key={idx} className={`${section.title ? "mb-6" : ""}`}>
          {section.title && (
            <h3 className="text-heading-3 mb-2 pb-4">
              <span>
                {idx + 1}. {section.title}
              </span>
            </h3>
          )}
          {renderSectionItems(section.items)}
        </div>
      ))}
      <section className="flex flex-col items-center justify-end gap-6 md:flex-row-reverse md:justify-start">
        <Button
          className="m-0 w-full sm:w-auto"
          variant="primary"
          size="md"
          type="submit"
          onClick={() => {
            setRecommendationsFinished(true);
          }}
        >
          Continuă <SVGArrowRight />
        </Button>
      </section>
    </section>
  );
}
