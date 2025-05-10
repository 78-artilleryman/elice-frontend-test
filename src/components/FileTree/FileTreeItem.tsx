import { useState } from "react";
import type { FileEntry } from "../../types/fileTree.type";
import styles from "./FileTreeItem.module.css";
import {
  FaRegFolder,
  FaRegFileAlt,
  FaRegFileImage,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

interface FileTreeItemProps {
  node: FileEntry;
}

export function FileTreeItem({ node }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFileIcon = () => {
    if (node.isDirectory) {
      return <FaRegFolder size={15} className={styles.icon} />;
    }
    if (node.imageUrl) {
      return <FaRegFileImage size={14} className={styles.icon} />;
    }
    return <FaRegFileAlt size={14} className={styles.icon} />;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (node.isDirectory) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div className={styles.fileTreeItem} onClick={handleClick}>
        {node.isDirectory && (
          <span className={styles.expandIcon}>
            {isExpanded ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </span>
        )}
        {getFileIcon()}
        <span className={styles.fileName}>{node.name}</span>
      </div>
      {node.isDirectory &&
        isExpanded &&
        node.children &&
        node.children.length > 0 && (
          <div className={styles.children}>
            {node.children.map((child) => (
              <FileTreeItem key={child.path} node={child} />
            ))}
          </div>
        )}
    </div>
  );
}
