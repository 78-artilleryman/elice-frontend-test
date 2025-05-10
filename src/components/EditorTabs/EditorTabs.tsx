import styles from "./EditorTabs.module.css";

export default function EditorTabs() {
  return (
    <div className={styles.tabs}>
      <div className={`${styles.tab} ${styles.activeTab}`}>
        index.html
        <button className={styles.closeButton}>×</button>
      </div>
      <div className={styles.tab}>
        styles.css
        <button className={styles.closeButton}>×</button>
      </div>
      <div className={styles.tab}>
        script.js
        <button className={styles.closeButton}>×</button>
      </div>
    </div>
  );
}
