import styles from "./App.module.css";

import FileUploader from "./components/FileUploader/FileUploader";
import EditorTabs from "./components/EditorTabs/EditorTabs";
import FileTree from "./components/FileTree/FileTree";
import FileViewer from "./components/FileViewer/FileViewer";
import FileActionMenu from "./components/FileTree/FileActionMenu";

import { FileSystemProvider } from "./contexts/FileSystemContext";
import { OpenTabsProvider } from "./contexts/OpenTabsContext";
import { FileActionMenuProvider } from "./contexts/FileActionMenuContext";

function App() {
  return (
    <FileSystemProvider>
      <div className={styles.container}>
        <FileUploader />
        <FileActionMenuProvider>
          <OpenTabsProvider>
            <div className={styles.content}>
              <FileTree />
              <div className={styles.editor}>
                <EditorTabs />
                <FileViewer />
              </div>
            </div>
            <FileActionMenu />
          </OpenTabsProvider>
        </FileActionMenuProvider>
      </div>
    </FileSystemProvider>
  );
}

export default App;
