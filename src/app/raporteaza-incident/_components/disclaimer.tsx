import { Label } from "@radix-ui/react-label";
import { SVGArrowRight } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";
import { Checkbox } from "~/components/ui/simple/checkbox";

export default function Disclaimer({
  disclaimerTermsAccepted,
  setDisclaimerTermsAccepted,
  handleNextPage,
}: {
  disclaimerTermsAccepted: boolean;
  setDisclaimerTermsAccepted: (value: boolean) => void;
  handleNextPage: () => void;
}) {
  return (
    <>
      <section className="bg-primary-disclaimer text-body rounded-md p-6 md:p-12">
        <p className="text-body-strong">⚠️ Important!</p>
        <p>
          AnimAlert Bot este destinat doar pentru raportarea animalelor
          sălbatice rănite, de exemplu căprioare, vulpi, mistreți, păsări
          răpitoare.
        </p>
        <br />
        <p className="text-body-strong">✅ Ce trebuie să faci?</p>
        <br />
        <ul className="list-disc pl-5">
          <li>Raportează cazul în aplicație și urmează instrucțiunile.</li>
          <li>
            Dacă animalul este mic și poate fi transportat, du-l la cea mai
            apropiată clinică veterinară parteneră.
          </li>
          <li>
            USAMV Cluj-Napoca oferă tratament gratuit pentru animale sălbatice
          </li>
        </ul>
        <br />
        <p className="text-body-strong">❌ Ce NU trebuie raportat?</p>
        <p>
          AnimAlert nu se ocupă de animale domestice (câini, pisici, animale de
          fermă).
        </p>
        <p>
          🏥 Dacă ai găsit un animal domestic rănit: du-l imediat la o clinică
          veterinară!
        </p>
        <p>📞 Urgențe non-stop: [număr de telefon]</p>
        <br />
        <p className="text-body-strong">
          🚨 Maltratarea animalelor este infracțiune! Dacă vezi un caz de abuz,
          sună la 112.
        </p>
        <p className="text-body-strong">
          🙏 Fiecare minut contează! Acționează acum!
        </p>
      </section>
      <section className="flex items-start gap-3">
        <Checkbox
          id="terms"
          className="mt-1"
          checked={disclaimerTermsAccepted}
          onCheckedChange={(checked) =>
            setDisclaimerTermsAccepted(checked.valueOf() as boolean)
          }
        />
        <Label htmlFor="terms" className="text-body">
          Am citit informațiile, vreau să continui să raportez incidentul
        </Label>
      </section>
      <section className="flex flex-col items-center justify-end gap-6 md:flex-row-reverse md:justify-start">
        <Button
          className="m-0 w-full sm:w-auto"
          variant="primary"
          size="md"
          onClick={handleNextPage}
          disabled={!disclaimerTermsAccepted}
        >
          Mergi mai departe <SVGArrowRight />
        </Button>
        <Button className="m-0 w-full sm:w-auto" variant="neutral" size="md">
          Vezi acțiuni & info
        </Button>
      </section>
    </>
  );
}
