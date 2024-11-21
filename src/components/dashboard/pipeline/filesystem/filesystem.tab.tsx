'use client'

import { fetchFileFromGitHub } from "@/utils/api/github.service";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CodeEditor from "../../code-editor/code_editor";
import FileSystem from "./filesystem";

const FileSystemTab = () => {
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript');
    const [files] = useState<{ name: string; path: string; isDirectory: boolean }[]>([
      { name: 'src', path: 'src', isDirectory: true },
      { name: 'index.tsx', path: 'src/index.tsx', isDirectory: false },
      { name: 'App.tsx', path: 'src/App.tsx', isDirectory: false },
      { name: 'README.md', path: 'README.md', isDirectory: false },
    ]);
  
    const handleFileSelect = async (filePath: string) => {
      const owner = 'khaitq-vnist';
      const repo = 'auto_ci_be';
  
      try {
        const content = await fetchFileFromGitHub(owner, repo, filePath);
        setCode(content);
  
        if (filePath.endsWith('.tsx')) setLanguage('typescript');
        else if (filePath.endsWith('.md')) setLanguage('markdown');
        else if (filePath.endsWith('.js')) setLanguage('javascript');
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };
  
    return (
      <Container fluid style={{ height: '100vh' }}>
        <Row style={{ height: '100%' }}>
          <Col md={3} style={{ overflow: 'auto' }}>
            <h5>File Explorer</h5>
            <FileSystem files={files} onFileSelect={handleFileSelect} />
          </Col>
          <Col md={9}>
            <h5>Code Editor</h5>
            <CodeEditor code={code} language={language} />
          </Col>
        </Row>
      </Container>
    );
}

export default FileSystemTab;