'use client';

import CodeEditor from '@/components/dashboard/code-editor/code_editor';
import FileSystem from '@/components/dashboard/pipeline/filesystem/filesystem';
import { fetchFileFromGitHub } from '@/utils/api/github.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

const FileSystemPage = () => {
    const router = useRouter();
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

    const handleNextClick = () => {
        router.push('analytics')
        // Add navigation logic or additional functionality here
    };

    return (
        <Container fluid style={{ height: '100vh' }}>
            {/* Header Section */}
            <Row className="p-3 border-bottom align-items-center">
                <Col>
                    <h5 className="m-0">File System</h5>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleNextClick}>
                        Next
                    </Button>
                </Col>
            </Row>

            {/* Main Content */}
            <Row style={{ height: '100%' }}>
                <Col md={3} style={{ overflow: 'auto', borderRight: '1px solid #ddd' }}>
                    <h5 className="p-3">File Explorer</h5>
                    <FileSystem files={files} onFileSelect={handleFileSelect} />
                </Col>
                <Col md={9} className="p-3 d-flex flex-column">
                    <h5>Code Editor</h5>
                    <div style={{ flex: 1, overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                        <CodeEditor code={code} language={language} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default FileSystemPage;
