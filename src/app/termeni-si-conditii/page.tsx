import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-12">
            <h1 className="text-heading-1 mb-2">
              Termeni și Condiții AnimAlert
            </h1>
            <h3 className="text-subheading">
              Data ultimei actualizări: 16.06.2025
            </h3>
            <p className="text-body mt-4">
              Acordul de utilizare (“Termenii și Condițiile”) reglementează
              relația dintre{" "}
              <strong>
                Organizația pentru Protecția Mediului și Combaterea Braconajului
              </strong>{" "}
              (“Organizația”, “noi”, “nostru”) și{" "}
              <strong>utilizatorii aplicației AnimAlert</strong> (“Utilizator”,
              “tine”, “tău”). Prin accesarea și utilizarea aplicației, confirmi
              că ai citit, înțeles și ești de acord cu acești{" "}
              <strong>Termeni și Condiții</strong>.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-heading-2 mt-8 mb-4">
              1. Acceptarea Termenilor
            </h2>
            <p className="text-body mb-4">
              Accesând sau utilizând AnimAlert, confirmi că ești de acord să
              respecți acești Termeni și Condiții. Dacă nu ești de acord, te
              rugăm să nu folosești aplicația.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">
              2. Descrierea Serviciilor
            </h2>
            <p className="text-body mb-4">
              AnimAlert este o aplicație destinată raportării și monitorizării
              animalelor sălbatice, cu scopul de a contribui la protecția
              mediului și combaterea braconajului. Utilizatorii pot înregistra
              observații, trimite fotografii și localizații ale animalelor
              sălbatice.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">
              3. Înregistrarea și Contul Utilizatorului
            </h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Înregistrarea:</strong> Pentru a folosi anumite
                funcționalități, poți fi solicitat să creezi un cont prin
                furnizarea unor date personale (nume, e-mail etc.).
              </li>
              <li>
                <strong>Veridicitatea datelor:</strong> Te obligi să furnizezi
                informații adevărate și actualizate.
              </li>
              <li>
                <strong>Confidențialitatea:</strong> Vezi{" "}
                <Link
                  className="text-blue-700 underline"
                  href="/politica-confidentialitate"
                >
                  Politica de Confidențialitate
                </Link>{" "}
                pentru detalii despre prelucrarea datelor tale.
              </li>
            </ul>

            <h2 className="text-heading-2 mt-8 mb-4">
              4. Utilizarea Aplicației
            </h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Utilizare corectă:</strong> Te obligi să folosești
                aplicația în mod legal și responsabil, fără a încălca drepturile
                altora sau să provoci daune Organizației sau altor utilizatori.
              </li>
              <li>
                <strong>Interzicerea abuzului:</strong> Este interzisă orice
                încercare de acces neautorizat, manipulare, distribuire de
                informații false sau orice altă activitate care poate afecta
                funcționarea aplicației.
              </li>
              <li>
                <strong>Conținutul utilizatorilor:</strong> Ești singurul
                responsabil pentru conținutul pe care îl încarci sau distribui
                prin AnimAlert.
              </li>
            </ul>

            <h2 className="text-heading-2 mt-8 mb-4">
              5. Drepturi de proprietate intelectuală
            </h2>
            <p className="text-body mb-4">
              Toate drepturile de proprietate intelectuală asupra aplicației
              AnimAlert aparțin Organizației. Nu ai dreptul de a copia,
              modifica, distribui sau comercializa orice element al aplicației
              fără acordul scris al Organizației.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">
              6. Limitarea răspunderii
            </h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Utilizare pe propriul risc:</strong> Utilizarea
                aplicației se face pe propriul risc. Organizația nu își asumă
                răspunderea pentru orice daune directe sau indirecte rezultate
                din utilizarea sau imposibilitatea utilizării aplicației.
              </li>
              <li>
                <strong>Disponibilitate:</strong> Organizația se rezervă dreptul
                de a modifica, suspenda sau întrerupe oricând accesul la
                aplicație, fără notificare prealabilă.
              </li>
            </ul>

            <h2 className="text-heading-2 mt-8 mb-4">
              7. Modificări ale Termenilor și Condițiilor
            </h2>
            <p className="text-body mb-4">
              Organizația își rezervă dreptul de a actualiza acești Termeni și
              Condiții periodic. Modificările vor fi comunicate prin intermediul
              aplicației sau pe site. Utilizarea continuată a aplicației după
              publicarea modificărilor reprezintă acceptarea acestora.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">8. Rezilierea</h2>
            <p className="text-body mb-4">
              Organizația își rezervă dreptul de a restricționa, suspenda sau
              închide conturile utilizatorilor care încalcă acești Termeni și
              Condiții sau care utilizează aplicația în mod abuziv.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">
              9. Legea aplicabilă și litigiile
            </h2>
            <p className="text-body mb-4">
              Acești Termeni și Condiții sunt guvernați de legile României.
              Orice litigiu referitor la aplicație va fi rezolvat pe cale
              amiabilă sau, în caz de necesitate, prin instanțele competente din
              România.
            </p>

            <h2 className="text-heading-2 mt-8 mb-4">10. Contact</h2>
            <p className="text-body">
              Pentru orice întrebări sau solicitări legate de Termenii și
              Condiții, poți contacta Organizația la adresa de e-mail:{" "}
              <Link
                href="mailto:ancbp.cluj@gmail.com"
                className="text-blue-700 underline"
              >
                ancbp.cluj@gmail.com
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
