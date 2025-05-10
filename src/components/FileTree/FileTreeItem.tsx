import { useState } from "react";
import { useOpenTabs } from "../../contexts/OpenTabsContext";

import type { FileEntry } from "../../types/fileTree.type";

import styles from "./FileTreeItem.module.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

import { getFileIcon } from "../../utils/fileIcon";

interface FileTreeItemProps {
  node: FileEntry;
}

export default function FileTreeItem({ node }: FileTreeItemProps) {
  const { openTabs, setOpenTabs, setActiveTab } = useOpenTabs();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (node.isDirectory) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    } else {
      // 이미 열려있는 탭인지 확인
      const isAlreadyOpen = openTabs.some((tab) => tab.path === node.path);

      // 탭이 열려있지 않다면 추가
      if (!isAlreadyOpen) {
        setOpenTabs([...openTabs, node]);
      }

      // 탭 활성화
      setActiveTab(node.path);
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
        {getFileIcon({ node, className: styles.icon })}
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
