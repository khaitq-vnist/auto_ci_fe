'use client';

import React from 'react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language }) => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Editor
        height="100%"
        defaultValue={code}
        defaultLanguage={language}
        theme="vs-dark"
        options={{
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
