import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-12">
            <h1 className="text-heading-1 mb-2">
              Politica de Confidențialitate AnimAlert
            </h1>
            <h3 className="text-subheading">
              Data ultimei actualizări: 16.06.2025
            </h3>
            <p className="text-body mt-4">
              Această <strong>Politică de Confidențialitate</strong>{" "}
              reglementează modul în care{" "}
              <strong>
                Organizația pentru Protecția Mediului și Combaterea Braconajului
              </strong>
              (“Organizația”, “noi”, “niște”, “al nostru”) colectează,
              utilizează și protejează informațiile personale ale{" "}
              <strong>utilizatorilor aplicației AnimAlert</strong>{" "}
              (“Utilizator”, “tine”, “tău”). Prin accesarea și utilizarea
              aplicației, confirmi că ai citit, înțeles și ești de acord cu
              această Politică de Confidențialitate.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-heading-2 mt-8 mb-4">
              1. Identitatea și datele de contact
            </h2>
            <div className="text-body mb-4">
              <strong>
                Responsabil cu prelucrarea datelor cu caracter personal:
              </strong>
              <br />
              <strong>Nume organizație:</strong> Organizația pentru Protecția
              Mediului și Combaterea Braconajului
              <br />
              <strong>Adresă:</strong> Cluj-Napoca, Cluj, România
              <br />
              <strong>E-mail de contact:</strong>{" "}
              <Link
                className="text-blue-700 underline"
                href="mailto:ancbp.cluj@gmail.com"
              >
                ancbp.cluj@gmail.com
              </Link>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">2. Ce date colectăm</h2>
            <div className="text-body mb-4">
              În funcție de modul în care folosești aplicația, putem colecta
              următoarele informații:
              <ul className="list-disc pl-5">
                <li>
                  <strong>Date personale:</strong> nume, adresă de e-mail, orice
                  alte informații pe care le furnizezi voluntar la înregistrare
                  sau în raportări.
                </li>
                <li>
                  <strong>Date de localizare:</strong> locația unde ai observat
                  animalul (dacă este permis).
                </li>
                <li>
                  <strong>Detalii despre observații:</strong> descrierea
                  animalului, poze, data și ora observației.
                </li>
                <li>
                  <strong>Date de utilizare:</strong> tipul dispozitivului,
                  sistemul de operare, adresa IP (pentru analiză și securitate).
                </li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              3. Scopul colectării datelor
            </h2>
            <div className="text-body mb-4">
              Datele tale sunt folosite pentru:
              <ul className="list-disc pl-5">
                <li>Procesarea raportărilor animalelor sălbatice.</li>
                <li>
                  Comunicarea cu tine privind raportările sau alte solicitări.
                </li>
                <li>Îmbunătățirea aplicației și a serviciilor noastre.</li>
                <li>
                  Cercetare științifică și conservare, doar cu acordul tău
                  explicit sau în mod anonimizat.
                </li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              4. Temei juridic și consimțământ
            </h2>
            <div className="text-body mb-4">
              Prelucrarea datelor se bazează pe:
              <ul className="list-disc pl-5">
                <li>
                  Consimțământul tău (pentru datele pe care le furnizezi
                  voluntar).
                </li>
                <li>
                  Interesele legitime (pentru analiza utilizării și
                  îmbunătățirea serviciilor).
                </li>
                <li>Îndeplinirea unor obligații legale (dacă este cazul).</li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              5. Destinatarii datelor
            </h2>
            <div className="text-body mb-4">
              Datele tale pot fi partajate cu:
              <ul className="list-disc pl-5">
                <li>
                  Părți terțe pentru servicii de hosting, analiză sau suport
                  tehnic (doar cu garanții de confidențialitate).
                </li>
                <li>
                  Organizații de cercetare și conservare a animalelor sălbatice
                  (doar cu acordul tău sau în mod anonimizat).
                </li>
                <li>Autorități competente (doar dacă este cerut legal).</li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">6. Perioada de stocare</h2>
            <div className="text-body mb-4">
              Datele tale sunt păstrate doar atât timp cât este necesar pentru
              îndeplinirea scopurilor pentru care au fost colectate sau pentru a
              respecta obligațiile legale.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">7. Drepturile tale</h2>
            <div className="text-body mb-4">
              În conformitate cu GDPR, ai dreptul la:
              <ul className="list-disc pl-5">
                <li>Acces la datele tale personale.</li>
                <li>Rectificarea sau completarea datelor incorecte.</li>
                <li>Ștergerea datelor („dreptul de a fi uitat”).</li>
                <li>Restricționarea prelucrării.</li>
                <li>Portabilitatea datelor.</li>
                <li>
                  Opoziție la prelucrare și la luarea de decizii automatizate.
                </li>
                <li>
                  Retragerea consimțământului (dacă prelucrarea se bazează pe
                  consimțământ).
                </li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">8. Securitatea datelor</h2>
            <div className="text-body mb-4">
              AnimAlert ia măsuri tehnice și organizatorice pentru a proteja
              datele tale împotriva accesului neautorizat, pierderii sau
              distrugerii.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              9. Modificări ale politicii
            </h2>
            <div className="text-body mb-4">
              Această politică poate fi actualizată periodic. Vei fi anunțat(ă)
              despre modificări prin intermediul aplicației sau pe site.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">10. Contact</h2>
            <div className="text-body">
              Pentru orice întrebări sau solicitări legate de datele tale
              personale, poți contacta echipa AnimAlert la adresa de e-mail:{" "}
              <Link
                href="mailto:ancbp.cluj@gmail.com"
                className="text-blue-700 underline"
              >
                ancbp.cluj@gmail.com
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
