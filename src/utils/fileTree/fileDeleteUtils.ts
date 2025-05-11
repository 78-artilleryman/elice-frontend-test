import type { FileEntry } from "../../types/fileTree.type";

export function deleteRecursively(
  nodes: FileEntry[],
  targetPath: string
): FileEntry[] {
  return nodes
    .filter((n) => n.path !== targetPath)
    .map((n) =>
      n.children
        ? { ...n, children: deleteRecursively(n.children, targetPath) }
        : n
    );
}
