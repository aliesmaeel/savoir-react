import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";

export default function PopularAbout() {
  const arrow = useArrow();
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[34px]">About Dubai Marina</Header>
      <p className="text-[#353635] text-[22px] leading-[233.333%]">
        Nestled along the shimmering waters of the Arabian Gulf, Dubai Marina stands as a beacon of
        luxury and sophistication in the heart of Dubai. Stretching over 3 kilometers of prime
        waterfront real estate, this meticulously planned community boasts a skyline adorned with
        towering skyscrapers and elegant residential towers, offering residents an unparalleled
        living experience.
        <br />
        Dubai Marina is renowned for its exquisite selection of upscale residences, including lavish
        apartments, opulent penthouses, and luxurious villas. Each property is meticulously designed
        to blend modern aesthetics with premium amenities, providing residents with a sanctuary of
        comfort and refinement. From panoramic views of the marina and the Gulf to sleek
        contemporary interiors, every aspect of life in Dubai Marina exudes luxury and elegance.
      </p>
      <Button className="w-[299px]">
        Read more <img src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
      </Button>
    </div>
  );
}
