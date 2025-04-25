import { SVGBotAvatar, SVGCross } from "~/components/icons";

export default function Page4() {
  return (
    <section className="bg-neutral text-neutral-foreground text-single-line-body-base">
      <div className="bg-secondary border-tertiary-border flex flex-row items-center justify-between rounded-t-md border-x-1 border-t-1 p-[1.5rem] text-white">
        <div className="flex flex-row items-center gap-[1rem]">
          <SVGBotAvatar width="60" height="60" />
          <div className="flex flex-col">
            <h3 className="text-heading-3">AnimAlert Bot</h3>
            <span className="text-subheading-1">Online</span>
          </div>
        </div>
        <SVGCross className="cursor-pointer" width="32" height="32" />
      </div>
      {/* Chat body */}
      <div className="border-tertiary-border flex flex-col gap-[1.5rem] rounded-b-md border-x-1 border-b-1 bg-white px-[1.5rem] py-[2rem]">
        {/* Bot message */}
        <div className="flex">
          <div className="bg-tertiary text-neutral-foreground text-single-line-body-base rounded-t-lg rounded-r-lg p-[1rem]">
            <span className="text-base">
              Te rog, spune-mi despre ce tip de animal sălbatic e vorba?
              (Exemplu: Vulpe, căprior, mistreț, urs, etc.)
            </span>
          </div>
        </div>

        {/* User reply */}
        <div className="flex justify-end">
          <div className="text-neutral-foreground text-single-line-body-base max-w-[60%] rounded-t-lg rounded-l-lg bg-[#F2F2F2] p-[1rem]">
            Vulpe
          </div>
        </div>

        {/* Next question */}
        <div className="mr-auto">
          <div className="bg-tertiary text-neutral-foreground text-single-line-body-base mb-[0.5rem] rounded-t-lg rounded-r-lg p-[1rem] font-medium">
            Unde ai găsit animalul?
          </div>
          <div className="bg-tertiary flex flex-col gap-0 rounded-r-lg rounded-b-lg">
            <span className="hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer rounded-tr-lg border-b-[1px] p-[1rem]">
              În apropierea unui drum/trafic intens
            </span>
            <span className="hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer border-b-[1px] p-[1rem]">
              În pădure/parc
            </span>
            <span className="hover:bg-tertiary-hover hover:text-tertiary-hover-foreground border-tertiary-border cursor-pointer border-b-[1px] p-[1rem]">
              În apropierea locuințelor
            </span>
            <span className="hover:bg-tertiary-hover hover:text-tertiary-hover-foreground cursor-pointer rounded-b-lg p-[1rem]">
              Alte locații (te rog specifică)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
