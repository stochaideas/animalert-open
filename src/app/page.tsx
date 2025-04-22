import Link from "next/link";
import { SVGAlert } from "~/components/icons";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <main className="bg-tertiary">
      <section className="h-[50rem] bg-[url(/images/homepage-hero.png)] bg-left bg-no-repeat">
        <div className="flex flex-col items-start gap-[2rem] pt-[10.25rem] pl-[20.625rem]">
          <span className="text-heading-1 text-neutral">
            <b>
              Ai întâlnit un animal sălbatic <br /> rănit sau în pericol?
            </b>
          </span>
          <Link href="/raporteaza-incident">
            <Button
              size="lg"
              variant="primary"
              className="shadow-2xl shadow-black/60"
            >
              <SVGAlert /> Raportează incident
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
