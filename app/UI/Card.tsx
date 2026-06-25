import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  luxury?: boolean;
  style?: CSSProperties;
};

export default function Card({ children, className, luxury, style }: Props) {
  return (
    <div
      className={`${styles.card} ${luxury ? styles.luxury : ""} ${
        className || ""
      } !rounded-[15px] lg:!rounded-[15.5px]`}
      style={style}
    >
      {children}
    </div>
  );
}
