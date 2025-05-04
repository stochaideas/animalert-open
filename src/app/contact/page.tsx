import Image from "next/image";

export default function Contact() {
  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 lg:flex-row 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-heading-1">Contact</h1>
        <p className="text-body">
          Ne poți contacta pentru a semnala un animal sălbatic rănit sau în
          pericol, pentru informații despre proiectele noastre sau pentru a afla
          cum poți ajuta.
        </p>
        <p className="text-subheading">
          Împreună protejăm și ajutăm fauna sălbatică!
        </p>
        <div className="grid h-full gap-3 md:grid-cols-2 md:grid-rows-2">
          {/* Image 1 */}
          <div className="h-full w-full md:col-start-1 md:row-start-1">
            <Image
              alt="Colaborare"
              src="/images/contact-hands.png"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Image 2 */}
          <div className="h-full w-full md:col-start-1 md:row-start-2">
            <Image
              alt="Colaborare"
              src="/images/contact-bird.svg"
              width={330}
              height={172}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Image 3 */}
          <div className="h-full w-full md:col-start-2 md:row-span-2 md:row-start-1">
            <Image
              alt="Colaborare"
              src="/images/contact-bunny.png"
              width={330}
              height={344} // 172+172=344 to match left side
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
