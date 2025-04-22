import { Stepper } from "../_components/stepper";

export default async function IncidentReport() {
  return (
    <main className="mx-[30.75rem] mt-[6.25rem] flex flex-col justify-center gap-[3rem]">
      <h1 className="text-heading-2">Raportează incident</h1>
      <Stepper currentStep={1} />
      <section className="bg-primary-disclaimer text-body rounded-md p-[3rem]">
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
    </main>
  );
}
