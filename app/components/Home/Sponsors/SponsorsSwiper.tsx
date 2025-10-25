import React from "react";
import styles from "./SponsorsSwiper.module.css";

type Props = {
  speedSeconds?: number; // tweak speed if you want
  logos: any;
};

export default function SponsorsSwiper({ speedSeconds = 20, logos }: Props) {
  // Duplicate once to create a seamless loop
  const loop = [...logos, ...logos];

  return (
    <div className={`bg-white py-6 ${styles.wrapper}`}>
      <div className={styles.track} style={{ ["--speed" as any]: `${speedSeconds}s` }}>
        {loop.map((src, i) => (
          <div className={styles.item} key={i}>
            <img loading="lazy" src={src.image} alt={`sponsor-${i}`} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
