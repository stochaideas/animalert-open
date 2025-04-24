import { SVGBotAvatar, SVGCross } from "~/components/icons";

export default function Page4() {
  return (
    <section className="bg-neutral text-neutral-foreground">
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
      <div className="border-tertiary-border rounded-b-md border-x-1 border-b-1 bg-white py-[2rem]"></div>
    </section>
  );
}
