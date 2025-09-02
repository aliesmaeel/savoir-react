import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Title from "~/UI/Title";

export default function GlobalAccess() {
  const typedElRef = useRef<HTMLParagraphElement | null>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!typedElRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;

          typedInstanceRef.current = new Typed(typedElRef.current!, {
            strings: [
              "We unlock a world of real estate opportunities with leading agents and real estate professionals through our membership in the largest real estate network in the world. We facilitate access to customers and provide luxury offers from more than 70 countries.",
            ],
            typeSpeed: 10,
            showCursor: false,
            loop: false,
          });

          if (typedElRef.current) {
            observer.unobserve(typedElRef.current);
          }
        }
      },
      {
        root: null,
        threshold: 0.2, // when 20% visible
      }
    );

    observer.observe(typedElRef.current);

    return () => {
      observer.disconnect();
      typedInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-[52px] w-full">
      <div className="flex flex-col items-start gap-[21px] w-full" data-aos="fade-up">
        <Title className="text-[#C6A45A] text-[31px]">
          UNLOCK ENDLESS REAL ESTATE OPPORTUNITIES WITH GLOBAL ACCESS
        </Title>
        <p ref={typedElRef} className="text-[#353635] text-[23px] leading-[225.806%]"></p>
      </div>
      <img src="/images/placeholders/GlobalAccess.svg" alt="" data-aos="fade-up" />
    </div>
  );
}
