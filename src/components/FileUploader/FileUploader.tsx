import styles from "./FileUploader.module.css";
import { useRef } from "react";
import { BiImport, BiExport } from "react-icons/bi";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <div className={styles.buttonContainer}>
        <button className={styles.fileUploaderButton}>
          <FiFilePlus />
        </button>
        <button className={styles.fileUploaderButton}>
          <FiFolderPlus />
        </button>
        <button className={styles.fileUploaderButton}>
          <BiImport />
        </button>
        <button
          className={`${styles.fileUploaderButton} ${styles.exportButton} ${styles.disabled}`}
          disabled={true}
        >
          <BiExport />
        </button>
      </div>
    </div>
  );
}
