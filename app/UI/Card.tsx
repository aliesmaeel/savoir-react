import styles from "./Card.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  luxury?: boolean; // ⬅ new prop
};

export default function Card({ children, className, luxury }: Props) {
  return (
    <div className={`${styles.card} ${luxury ? styles.luxury : ""} ${className || ""} !rounded-[15px] lg:!rounded-[15.5px]`}>
      {children}
    </div>
  );
}
