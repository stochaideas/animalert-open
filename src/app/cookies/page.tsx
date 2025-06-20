import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-12">
            <h1 className="text-heading-1 mb-2">
              Politica de Cookie-uri AnimAlert
            </h1>
            <h3 className="text-subheading">
              Data ultimei actualizări: 16.06.2025
            </h3>
            <div className="text-body mt-4">
              Această politică explică ce sunt cookie-urile, cum le folosim în
              aplicația AnimAlert și cum poți gestiona preferințele tale în
              legătură cu acestea.
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-heading-2 mt-8 mb-4">
              1. Ce sunt cookie-urile?
            </h2>
            <div className="text-body mb-4">
              Cookie-urile sunt fișiere text de dimensiuni mici, plasate pe
              dispozitivul tău atunci când accesezi o aplicație sau un site web.
              Ele sunt folosite pentru a îmbunătăți experiența ta de utilizare,
              a analiza traficul și a personaliza conținutul.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              2. Cum folosim cookie-urile în AnimAlert?
            </h2>
            <div className="text-body mb-4">
              AnimAlert folosește cookie-uri pentru a:
              <ul className="list-disc pl-5">
                <li>Permite autentificarea și gestionarea contului tău.</li>
                <li>
                  Îmbunătăți securitatea și a proteja împotriva utilizării
                  abuzive.
                </li>
                <li>
                  Analiza modul în care folosești aplicația, pentru a o
                  îmbunătăți.
                </li>
                <li>
                  Permite funcționarea corectă a anumitor caracteristici
                  tehnice.
                </li>
              </ul>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              3. Tipuri de cookie-uri folosite
            </h2>
            <div className="text-body mb-4">
              În funcție de scopul lor, folosim următoarele tipuri de
              cookie-uri:
              <table className="mt-4 w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">
                      Tip cookie
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Scop
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">
                      Strict necesare
                    </td>
                    <td className="border border-gray-300 p-2">
                      Permit funcționarea de bază a aplicației (ex:
                      autentificare, securitate)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Funcționale</td>
                    <td className="border border-gray-300 p-2">
                      Memorează preferințele tale (ex: limbă, setări de afișare)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Analiză</td>
                    <td className="border border-gray-300 p-2">
                      Ajută la analiza traficului și a utilizării aplicației
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              4. Cookie-uri ale terților
            </h2>
            <div className="text-body mb-4">
              Unele servicii integrate în AnimAlert (de exemplu, analiză trafic)
              pot folosi cookie-uri ale terților. Aceste cookie-uri sunt
              gestionate de furnizorii respectivi, iar utilizarea lor este
              supusă politicilor lor de confidențialitate.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              5. Gestionarea cookie-urilor
            </h2>
            <div className="text-body mb-4">
              Poți gestiona sau șterge cookie-urile folosind setările
              browserului sau ale dispozitivului tău. În aplicație, îți poți
              modifica preferințele privind cookie-urile prin intermediul
              setărilor disponibile.
              <br />
              Reține că dezactivarea anumitor cookie-uri poate afecta
              funcționalitatea aplicației.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">
              6. Modificări ale politicii
            </h2>
            <div className="text-body mb-4">
              Această politică poate fi actualizată periodic. Vei fi anunțat(ă)
              despre modificări prin intermediul aplicației sau pe site.
            </div>

            <h2 className="text-heading-2 mt-8 mb-4">7. Contact</h2>
            <div className="text-body">
              Pentru orice întrebări sau solicitări legate de utilizarea
              cookie-urilor, poți contacta echipa AnimAlert la adresa de e-mail:{" "}
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
