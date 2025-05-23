import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import styles from "./MonacoEditor.module.css";
import type { FileEntry } from "../../types/fileTree.type";

interface MonacoEditorProps {
  monacoContent: string;
  monacoLanguage: string;
  monacoPath: string;
  openTabs: FileEntry[];
  updateContent: (path: string, newContent: string) => void;
}

export default function MonacoEditor({
  monacoContent,
  monacoLanguage,
  monacoPath,
  openTabs,
  updateContent,
}: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const content = monacoContent;
      const language = monacoLanguage;

      const model = monaco.editor.createModel(
        content,
        language,
        monaco.Uri.parse(`file:///${monacoPath}`)
      );

      if (editorRef.current) {
        editorRef.current.dispose();
      }

      editorRef.current = monaco.editor.create(containerRef.current, {
        model,
        theme: "vs-light",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
      });

      editorRef.current.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          const newContent = editorRef.current?.getValue() || "";
          updateContent(monacoPath, newContent);
        }
      );

      return () => {
        editorRef.current?.dispose();
        model.dispose();
      };
    }
  }, [openTabs, monacoContent, monacoLanguage, monacoPath, updateContent]);

  if (!monacoContent) return <div>열린 파일이 없습니다.</div>;

  return <div ref={containerRef} className={styles.editorContainer} />;
}
