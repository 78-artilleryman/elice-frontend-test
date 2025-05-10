import styles from "./App.module.css";

import FileUploader from "./components/FileUploader/FileUploader";
import EditorTabs from "./components/EditorTabs/EditorTabs";
import FileTree from "./components/FileTree/FileTree";

import { FileSystemProvider } from "./contexts/FileSystemContext";
import { OpenTabsProvider } from "./contexts/OpenTabsContext";

function App() {
  return (
    <FileSystemProvider>
      <div className={styles.container}>
        <FileUploader />
        <OpenTabsProvider>
          <div className={styles.content}>
            <FileTree />
            <div className={styles.editor}>
              <EditorTabs />
            </div>
          </div>
        </OpenTabsProvider>
      </div>
    </FileSystemProvider>
  );
}

export default App;
