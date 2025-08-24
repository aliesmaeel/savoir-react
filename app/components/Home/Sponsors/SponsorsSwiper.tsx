import React from "react";
import styles from "./SponsorsSwiper.module.css";

type Props = {
  speedSeconds?: number; // tweak speed if you want
};

export default function SponsorsSwiper({ speedSeconds = 20 }: Props) {
  const logos = [
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
    "/images/placeholders/sponsorLogo.svg",
  ];

  // Duplicate once to create a seamless loop
  const loop = [...logos, ...logos];

  return (
    <div className={`bg-white py-6 ${styles.wrapper}`}>
      <div className={styles.track} style={{ ["--speed" as any]: `${speedSeconds}s` }}>
        {loop.map((src, i) => (
          <div className={styles.item} key={i}>
            <img src={src} alt={`sponsor-${i}`} draggable={false} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
