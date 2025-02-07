'use client';

import React, { useEffect, useState } from 'react';
import { Table, Spinner, Container, Alert, Pagination } from 'react-bootstrap';
import projectService from '@/utils/api/project.service'; // Replace with actual API service
import { useParams, useRouter } from 'next/navigation';

interface Branch {
    name: string;
    default: boolean;
}

interface Execution {
    id: number;
    start_date: number;
    finish_date: number;
    status: string;
    triggered_on: string;
    branch: Branch;
    logs_file?: string[];
    coverage?: number[];
}

interface ApiResponse {
    page: number;
    page_size: number;
    total_page_count: number;
    element_count: number;
    total_element_count: number;
    executions: Execution[];
}

const ExecutionPage: React.FC = () => {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const params = useParams();
    const router = useRouter(); // For navigation

    useEffect(() => {
        fetchExecutions();
    }, [currentPage]);

    const fetchExecutions = async () => {
        try {
            setLoading(true);
            const { id, pipelineId } = params;
            const response = await projectService.fetchListExecutions(Number(id), Number(pipelineId)); // Replace with actual API function

            if (response.status === 200 && response.data) {
                const data: ApiResponse = response.data.data;
                console.log(data);
                setExecutions(data.executions);
                setTotalPages(data.total_page_count);
            } else {
                throw new Error('Failed to fetch executions');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching executions');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowClick = (executionId: number) => {
        const { pipelineId } = params;
        router.push(`${pipelineId}/executions/${executionId}`); // Navigate to the detail page
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the row click event from firing
    };

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h3 className="mb-4 text-center">Execution History</h3>
            <Table bordered hover>
                <thead className="table-header">
                    <tr>
                        <th>#</th>
                        <th>Start Date</th>
                        <th>Finish Date</th>
                        <th>Status</th>
                        <th>Triggered On</th>
                        <th>Branch</th>
                        <th>Coverage</th>
                        <th>Download Logs</th>
                    </tr>
                </thead>
                <tbody>
                    {executions.map((execution, index) => (
                        <tr
                            key={execution.id}
                            onClick={() => handleRowClick(execution.id)} // Handle row click
                            style={{ cursor: 'pointer' }} // Add a pointer cursor for better UX
                        >
                            <td>{index + 1 + (currentPage - 1) * 20}</td>
                            <td>{formatDate(execution.start_date)}</td>
                            <td>{formatDate(execution.finish_date)}</td>
                            <td className={`status-${execution.status.toLowerCase()}`}>
                                {execution.status}
                            </td>
                            <td>{execution.triggered_on}</td>
                            <td>{execution.branch?.name}</td>
                            <td>{execution.coverage}</td>
                            <td>
                                {execution.logs_file && execution.logs_file.length > 0 ? (
                                    <ul>
                                        {execution.logs_file.map((file, fileIndex) => (
                                            <li key={fileIndex}>
                                                <a
                                                    href={file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={handleLinkClick} // Prevent row click
                                                >
                                                    Link {fileIndex + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'No Logs'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className="justify-content-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};

export default ExecutionPage;
