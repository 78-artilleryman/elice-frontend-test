import { useFileSystem } from "../../contexts/FileSystemContext";
import styles from "./FileTree.module.css";
import { FileTreeItem } from "./FileTreeItem";

export default function FileTree() {
  const { fileTree } = useFileSystem();

  return (
    <div className={styles.fileTreeContainer}>
      <div className={styles.fileTree}>
        {fileTree && fileTree.length > 0 ? (
          fileTree.map((node) => <FileTreeItem key={node.path} node={node} />)
        ) : (
          <div className={styles.emptyMessage}>파일이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
