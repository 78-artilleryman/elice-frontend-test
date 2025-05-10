import styles from "./FileUploader.module.css";
import { useRef } from "react";
import { BiImport, BiExport } from "react-icons/bi";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";
import { useFileSystem } from "../../contexts/FileSystemContext";
export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { setRawFile } = useFileSystem();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <div className={styles.buttonContainer}>
        <button className={styles.fileUploaderButton}>
          <FiFilePlus />
        </button>
        <button className={styles.fileUploaderButton}>
          <FiFolderPlus />
        </button>
        <button className={styles.fileUploaderButton} onClick={openFileDialog}>
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
