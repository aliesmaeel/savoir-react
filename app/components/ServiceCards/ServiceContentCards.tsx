type ServiceCardItem = {
  title: string;
  text: string;
  image: string;
  link: string;
};

type ServiceContentCardsProps = {
  items: ServiceCardItem[];
  visitSiteIndexes?: number[];
  getVisitLink?: (item: ServiceCardItem, index: number) => string;
};

const textStyle = {
  color: "#111111",
  fontWeight: 600,
  opacity: 1,
};

const headingStyle = {
  color: "#111111",
  fontWeight: 700,
  opacity: 1,
};

const headingBg =
  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)";

export default function ServiceContentCards({
  items,
  visitSiteIndexes = [],
  getVisitLink,
}: ServiceContentCardsProps) {
  return (
    <div className="flex w-full flex-col items-center gap-[56px] lg:gap-[70px]">
      {items.map((item, index) => {
        const imageRight = index % 2 === 0;
        const showVisitButton = visitSiteIndexes.includes(index);
        const isLongSection = item.text.length > 520;
        const visitLink = getVisitLink?.(item, index) ?? item.link;

        const textBlock = (
          <div className="flex w-full min-w-0 flex-col items-start lg:flex-1">
            <div
              className="
                mb-[22px] flex w-full items-center
                border-l-[3px] border-[#111111]
                px-[16px] py-[10px]
                lg:px-[18px] lg:py-[12px]
              "
              style={{ background: headingBg }}
            >
              <h2
                className="CormorantGaramond text-[20px] leading-[1.12] lg:text-[30px]"
                style={headingStyle}
              >
                {item.title}
              </h2>
            </div>

            <p
              className="whitespace-pre-line text-[14px] leading-[175%] lg:text-[17px]"
              style={textStyle}
            >
              {item.text.replace(/\./g, ".\n")}
            </p>

            {showVisitButton && (
              <a
                href={visitLink}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-[24px] inline-flex items-center justify-center
                  rounded-[8px] bg-[#111111]
                  px-[24px] py-[11px]
                  text-[14px] font-semibold text-white
                  transition-all duration-300
                  hover:scale-[1.02] hover:bg-[#000000]
                  hover:shadow-[0_14px_32px_rgba(17,17,17,0.18)]
                "
              >
                Visit the Site
              </a>
            )}
          </div>
        );

        const imageBlock = (
          <div
            className={`flex w-full shrink-0 justify-center lg:w-[420px] ${
              isLongSection ? "lg:sticky lg:top-[130px]" : ""
            }`}
          >
            <img
              loading="lazy"
              src={item.image}
              alt={item.title}
              className={`w-full max-w-[420px] rounded-[18px] object-cover object-center shadow-[0_18px_44px_rgba(0,0,0,0.08)] ${
                isLongSection ? "h-[250px] lg:h-[300px]" : "h-[235px] lg:h-[305px]"
              }`}
            />
          </div>
        );

        return (
          <section
            key={item.title}
            className="
              w-full max-w-[1100px]
              rounded-[18px]
              border border-[#E8DFD2]
              bg-white
              px-[22px] py-[28px]
              shadow-[0_22px_60px_rgba(0,0,0,0.055)]
              lg:px-[32px] lg:py-[32px]
            "
          >
            <div className="flex w-full flex-col gap-[30px] lg:flex-row lg:items-start lg:gap-[46px]">
              {imageRight ? (
                <>
                  {textBlock}
                  {imageBlock}
                </>
              ) : (
                <>
                  {imageBlock}
                  {textBlock}
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
