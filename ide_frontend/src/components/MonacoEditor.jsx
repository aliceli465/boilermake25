import React from "react";
import { Editor } from "@monaco-editor/react";

const MonacoEditor = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Editor
        height="100vh"
        width="100vw"
        defaultLanguage="javascript"
        defaultValue="// Start coding..."
        theme="vs-dark"
      />
    </div>
  );
};

export default MonacoEditor;