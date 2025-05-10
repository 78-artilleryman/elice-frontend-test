import { useOpenTabs } from "../../contexts/OpenTabsContext";
import MonacoEditor from "../MonacoEditor/MonacoEditor";
import styles from "./FileViewer.module.css";

export default function FileViewer() {
  const {
    openTabs,
    activeTab,
    getContent,
    getLanguge,
    getImageUrl,
    updateContent,
  } = useOpenTabs();

  if (activeTab && getLanguge(activeTab) === "binary") {
    return (
      <img className={styles.image} src={getImageUrl(activeTab)} alt="file" />
    );
  }

  if (activeTab && getLanguge(activeTab) !== "binary") {
    return (
      <MonacoEditor
        monacoContent={getContent(activeTab)}
        monacoLanguage={getLanguge(activeTab)}
        monacoPath={activeTab}
        openTabs={openTabs}
        updateContent={updateContent}
      />
    );
  }
}
