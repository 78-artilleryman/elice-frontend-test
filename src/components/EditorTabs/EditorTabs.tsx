import styles from "./EditorTabs.module.css";
import { useOpenTabs } from "../../contexts/OpenTabsContext";

export default function EditorTabs() {
  const { openTabs, setOpenTabs, activeTab, setActiveTab } = useOpenTabs();

  // 탭 닫기
  const closeTab = (path: string) => {
    const tabIndex = openTabs.findIndex((t) => t.path === path);
    const newTabs = openTabs.filter((t) => t.path !== path);
    setOpenTabs(newTabs);

    if (activeTab === path) {
      if (newTabs.length > 0) {
        // 닫힌 탭의 바로 다음 탭을 활성화하거나, 마지막 탭을 닫은 경우 이전 탭을 활성화
        const newActiveIndex =
          tabIndex < newTabs.length ? tabIndex : newTabs.length - 1;
        setActiveTab(newTabs[newActiveIndex].path);
      } else {
        setActiveTab(null);
      }
    }
  };

  if (!openTabs || openTabs.length === 0) {
    return null;
  }

  return (
    <div className={styles.tabs}>
      {openTabs.map((tab) => (
        <div
          key={tab.path}
          className={`${styles.tab} ${
            tab.path === activeTab ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab(tab.path)}
        >
          {tab.name}
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.path);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
