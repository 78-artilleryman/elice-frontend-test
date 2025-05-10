import "./App.module.css";
import FileUploader from "./components/FileUploader/FileUploader";
import styles from "./App.module.css";
import { FileSystemProvider } from "./contexts/FileSystemContext";
import { FileTree } from "./components/FileTree/FileTree";

function App() {
  return (
    <FileSystemProvider>
      <div className={styles.container}>
        <FileUploader />
        <div className={styles.content}>
          <FileTree />
        </div>
      </div>
    </FileSystemProvider>
  );
}

export default App;
