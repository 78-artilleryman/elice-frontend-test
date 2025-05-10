import React, { createContext, useContext, useState } from "react";
import type { FileEntry } from "../types/fileTree.type";

type OpenTabsContextType = {
  openTabs: FileEntry[];
  setOpenTabs: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  getContent: (path: string) => string;
  getLanguge: (path: string) => string;
  getImageUrl: (path: string) => string;
};

const OpenTabsContext = createContext<OpenTabsContextType | undefined>(
  undefined
);

interface OpenTabsProviderProps {
  children: React.ReactNode;
}

export function OpenTabsProvider({ children }: OpenTabsProviderProps) {
  const [openTabs, setOpenTabs] = useState<FileEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const getContent = (path: string): string => {
    const tab = openTabs.find((t) => t.path === path);
    return tab?.content || "";
  };

  const getLanguge = (path: string): string => {
    const tab = openTabs.find((t) => t.path === path);
    return tab?.language || "plaintext";
  };

  const getImageUrl = (path: string): string => {
    const tab = openTabs.find((t) => t.path === path);
    return tab?.imageUrl || "";
  };

  return (
    <OpenTabsContext.Provider
      value={{
        openTabs,
        setOpenTabs,
        activeTab,
        setActiveTab,
        getContent,
        getLanguge,
        getImageUrl,
      }}
    >
      {children}
    </OpenTabsContext.Provider>
  );
}

export const useOpenTabs = () => {
  const context = useContext(OpenTabsContext);
  if (!context) {
    throw new Error(
      "OpenTabsProvider 내부에서만 useOpenTabs를 사용할 수 있습니다."
    );
  }
  return context;
};
