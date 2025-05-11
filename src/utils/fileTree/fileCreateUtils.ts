import type { FileEntry } from "../../types/fileTree.type";
import { detectLanguageFromPath } from "../detectLanguageFromPath";

export const sortFileEntries = (entries: FileEntry[]): FileEntry[] => {
  return [...entries].sort((a, b) => {
    // 폴더를 파일보다 위에 정렬
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }
    // 같은 타입일 경우 이름으로 정렬
    return a.name.localeCompare(b.name);
  });
};

export const createNewFile = (
  fileName: string,
  parentPath: string
): FileEntry => {
  const path = parentPath === "/" ? fileName : `${parentPath}/${fileName}`;
  const { language } = detectLanguageFromPath(path);
  return {
    name: fileName,
    path,
    isDirectory: false,
    content: "새로 생성된 파일",
    language,
    children: undefined,
    imageUrl: undefined,
  };
};

export const updateFileTreeRecursively = (
  nodes: FileEntry[],
  targetPath: string,
  newFile: FileEntry
): FileEntry[] => {
  return nodes.map((item) => {
    if (item.path === targetPath) {
      return {
        ...item,
        children: sortFileEntries([newFile, ...(item.children || [])]),
      };
    }
    if (item.children) {
      return {
        ...item,
        children: updateFileTreeRecursively(item.children, targetPath, newFile),
      };
    }
    return item;
  });
};
