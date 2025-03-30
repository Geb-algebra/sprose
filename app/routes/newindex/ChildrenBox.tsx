import styles from "./ChildrenBox.module.css";

export function ChildrenBox(props: {
	children: React.ReactNode;
}) {
	return <div className={styles.layout}>{props.children}</div>;
}
