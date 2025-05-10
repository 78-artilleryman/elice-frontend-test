export type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileEntry[];
  file?: File;
  content?: string;
  imageUrl?: string;
  language?: string;
};
