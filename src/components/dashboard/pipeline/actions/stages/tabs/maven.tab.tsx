'use client'
import React from 'react';
import { Container, Button, Nav, Form, Card, Tab, Row, Col } from 'react-bootstrap';
import PackagesToolsTab from './packagestool.tab';

const MavenTab  = () => {
    return (
        <Container style={{ maxWidth: '800px', marginTop: '20px' }}>

            {/* Tab for Image and Packages & Tools */}
            <Tab.Container defaultActiveKey="image">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="image">Image</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="packages">Packages & Tools</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="image">
                        {/* Image Location Section */}
                        <Card className="mb-3">
                            <Card.Header>Image Location</Card.Header>
                            <Card.Body>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Public registry"
                                    name="imageLocation"
                                    id="publicRegistry"
                                    defaultChecked
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Private registry"
                                    name="imageLocation"
                                    id="privateRegistry"
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="From action"
                                    name="imageLocation"
                                    id="fromAction"
                                />
                            </Card.Body>
                        </Card>

                        {/* Registry Section */}
                        <Card className="mb-3">
                            <Card.Header>Registry</Card.Header>
                            <Card.Body>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Docker Hub"
                                    name="registry"
                                    id="dockerHub"
                                    defaultChecked
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Other"
                                    name="registry"
                                    id="otherRegistry"
                                />
                            </Card.Body>
                        </Card>

                        {/* Image and Version Section */}
                        <Row className="mb-3">
                            <Col>
                                <Card>
                                    <Card.Header>Image</Card.Header>
                                    <Card.Body>
                                        <Form.Text className="text-muted">maven (Official)</Form.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Header>Version</Card.Header>
                                    <Card.Body>
                                        <Form.Text className="text-muted">3.9.9</Form.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* User Section */}
                        <Card className="mb-3">
                            <Card.Header>User</Card.Header>
                            <Card.Body>
                                <Form.Control type="text" placeholder="Optional. Overrides the default user in the image." />
                            </Card.Body>
                        </Card>

                        {/* Options Section */}
                        <Card className="mb-3">
                            <Card.Header>Options</Card.Header>
                            <Card.Body>
                                <Form.Check
                                    type="checkbox"
                                    label="Reset default image entrypoint"
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Don't cache image between runs"
                                />
                            </Card.Body>
                        </Card>

                        {/* Save Changes Button */}
                        <Button variant="primary" size="lg" className="w-100">
                            Save changes
                        </Button>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="packages">
                        <PackagesToolsTab />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default MavenTab;
