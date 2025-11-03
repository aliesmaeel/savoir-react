import React, { useMemo } from "react";
import styles from "./SponsorsSwiper.module.css";

type Logo = { id: string; image: string; alt?: string; width?: number; height?: number };
type Props = { speedSeconds?: number; logos: Logo[] };

export default function SponsorsSwiper({ speedSeconds = 20, logos }: Props) {
  // create 3x content for safety
  const loop = useMemo(
    () => [0, 1, 2].flatMap((rep) => logos.map((l) => ({ ...l, _k: `${l.id}-${rep}` }))),
    [logos]
  );

  const style = { ["--speed" as unknown as "speed"]: `${speedSeconds}s` } as React.CSSProperties;

  return (
    <div className={`bg-white py-6 ${styles.wrapper}`}>
      <div className={styles.track} style={style}>
        {loop.map((src, i) => {
          const isFirstSet = i < logos.length;
          return (
            <div className={styles.item} key={`${src.id ?? i}-${isFirstSet ? "a" : "b"}`}>
              <img
                src={src.image}
                alt={src.alt ?? `sponsor-${i}`}
                draggable={false}
                loading={isFirstSet ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
