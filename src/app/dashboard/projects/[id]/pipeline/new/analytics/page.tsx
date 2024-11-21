'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, ListGroup, Button } from 'react-bootstrap';

interface AnalysisResult {
    language: string;
    tools: string[];
}

const AnalysisTab: React.FC = () => {
    const router = useRouter();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const result = await mockApiFetchAnalysis();
                setAnalysis(result);
            } catch (error) {
                console.error("Failed to fetch analysis:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (!analysis) {
        return (
            <Container className="text-center mt-5">
                <p>Failed to load analysis data.</p>
            </Container>
        );
    }
    const handleNextClick = () => {
        router.push('/dashboard/pipeline')
        // Add navigation logic or additional functionality here
    };

    return (
        <Container>
             <Row className="p-3 border-bottom align-items-center">
                <Col>
                    <h5 className="m-0">Analysis</h5>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleNextClick}>
                        Next
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                {/* Programming Language Card */}
                <Col md={6}>
                    <Card>
                        <Card.Header as="h5">Programming Language</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Detected:</strong> {analysis.language}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Supported Build Tools Card */}
                <Col md={6}>
                    <Card>
                        <Card.Header as="h5">Supported Build Tools</Card.Header>
                        <Card.Body>
                            <ListGroup>
                                {analysis.tools.map((tool, index) => (
                                    <ListGroup.Item key={index}>{tool}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

// Mock API implementation
const mockApiFetchAnalysis = async (): Promise<AnalysisResult> => {
    // Simulated API response
    return Promise.resolve({
        language: "Java",
        tools: ["Maven"],
    });
};

export default AnalysisTab;
