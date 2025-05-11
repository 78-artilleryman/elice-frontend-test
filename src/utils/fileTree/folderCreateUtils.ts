import type { FileEntry } from "../../types/fileTree.type";

export const createNewFolder = (
  folderName: string,
  parentPath: string
): FileEntry => {
  const path = parentPath === "/" ? folderName : `${parentPath}/${folderName}`;
  return {
    name: folderName,
    path,
    isDirectory: true,
    children: [],
  };
};
