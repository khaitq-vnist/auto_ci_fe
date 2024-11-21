'use client'
import React from 'react';
import { ListGroup } from 'react-bootstrap';

interface FileSystemProps {
  files: { name: string; path: string; isDirectory: boolean }[];
  onFileSelect: (path: string) => void;
}

const FileSystem: React.FC<FileSystemProps> = ({ files, onFileSelect }) => {
  return (
    <ListGroup>
      {files.map((file, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => onFileSelect(file.path)}
        >
          {file.isDirectory ? '📁' : '📄'} {file.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FileSystem;
