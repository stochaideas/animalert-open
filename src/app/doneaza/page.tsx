import Image from "next/image";
import Link from "next/link";

export default function Doneaza() {
  return (
    <main className="bg-tertiary px-6 pt-20 pb-40 md:px-20 2xl:px-64">
      <section className="grid grid-cols-1 gap-14 2xl:grid-cols-[max-content_1fr]">
        <div className="2xl:col-span-2">
          <div>
            <h1 className="text-heading-1 text-center">Donează</h1>
          </div>
          <p className="text-subheading text-center">
            Fiecare contribuție ajută echipa noastră să intervină rapid, să
            transporte și să manipuleze corect animalele sălbatice aflate în
            pericol. Cu sprijinul tău, le putem oferi apoi îngrijirea necesară,
            o șansă reală la supraviețuire.
          </p>
        </div>
        <div className="bg-neutral flex flex-col gap-8 rounded-md px-4 py-8 md:mx-auto md:p-12">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-subheading">Transfer bancar (RON/EUR)</div>
              <div className="text-body">
                În contul organizației (CUI: 45573474)
              </div>
            </div>
            <div>
              <div className="text-subheading">Cont RON</div>
              <div className="text-body">➡️ RO73BTRLRONCRT0629229001</div>
            </div>
            <div>
              <div className="text-subheading">Cont EURO</div>
              <div className="text-body">➡️ RO96BTRL01304201U42470XX</div>
            </div>
          </div>
          <div>
            <div className="text-subheading">Donații rapide</div>
            <div className="text-body">BT PAY & Revolut: 0741 028 697</div>
          </div>
          <div>
            <div className="text-subheading">Donație online</div>
            <div className="text-body">
              PayPal: 👉{" "}
              <Link
                className="underline"
                href="https://www.paypal.com/paypalme/OCLAUDIU"
                target="_blank"
              >
                Donați aici
              </Link>
            </div>
          </div>
          <div>
            <div className="text-subheading">Abonament lunar</div>
            <div className="text-body">
              Patreon: 👉{" "}
              <Link
                className="underline"
                href="https://bit.ly/3wNKzQ3"
                target="_blank"
              >
                Sprijină-ne lunar
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-[16/9] w-full 2xl:h-full 2xl:min-h-[400px]">
          <Image
            src="/images/image-placeholder.png"
            alt="Image placeholder"
            fill
            className="rounded-md object-cover"
            priority
          />
        </div>
      </section>
    </main>
  );
}
