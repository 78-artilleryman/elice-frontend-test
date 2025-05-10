import { FaRegFolder, FaRegFileAlt, FaRegFileImage } from "react-icons/fa";
import type { FileEntry } from "../types/fileTree.type";

interface GetFileIconProps {
  node: FileEntry;
  className?: string;
}

export function getFileIcon({ node, className }: GetFileIconProps) {
  if (node.isDirectory) {
    return <FaRegFolder size={15} className={className} />;
  }
  if (node.imageUrl) {
    return <FaRegFileImage size={14} className={className} />;
  }
  return <FaRegFileAlt size={14} className={className} />;
}
