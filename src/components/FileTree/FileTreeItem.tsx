import { useState } from "react";
import { useOpenTabs } from "../../contexts/OpenTabsContext";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { useContextMenu } from "../../contexts/ContextMenuContext";

import FileInput from "./FileInput";

import type { FileEntry } from "../../types/fileTree.type";

import styles from "./FileTreeItem.module.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

import { getFileIcon } from "../../utils/fileIcon";
import { sortFileEntries } from "../../utils/fileTree/fileCreateUtils";

interface FileTreeItemProps {
  node: FileEntry;
}

export default function FileTreeItem({ node }: FileTreeItemProps) {
  const { openTabs, setOpenTabs, setActiveTab } = useOpenTabs();
  const {
    selectedFolderPath,
    setSelectedFolderPath,
    isCreatingFile,
    isCreatingFolder,
  } = useFileSystem();
  const { setContextMenu } = useContextMenu();
  const [isExpanded, setIsExpanded] = useState(false);

  // 파일 트리 아이템 클릭 함수
  const handleClick = (e: React.MouseEvent) => {
    if (node.isDirectory) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
      setSelectedFolderPath(node.path);
    } else {
      const isAlreadyOpen = openTabs.some((tab) => tab.path === node.path);
      if (!isAlreadyOpen) {
        setOpenTabs([...openTabs, node]);
      }
      setActiveTab(node.path);
    }
  };

  // 우클릭 시 컨텍스트 메뉴 띄우기
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetPath: node.path,
      isDirectory: node.isDirectory,
    });
  };

  return (
    <div>
      <div
        className={styles.fileTreeItem}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
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
      {node.isDirectory && isExpanded && (
        <div className={styles.children}>
          {isCreatingFile && selectedFolderPath === node.path && (
            <FileInput parentPath={node.path} type="file" />
          )}
          {isCreatingFolder && selectedFolderPath === node.path && (
            <FileInput parentPath={node.path} type="folder" />
          )}
          {node.children &&
            sortFileEntries(node.children).map((child) => (
              <FileTreeItem key={child.path} node={child} />
            ))}
        </div>
      )}
    </div>
  );
}
