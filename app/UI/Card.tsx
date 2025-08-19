import styles from "./Card.module.css";

type props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: props) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
