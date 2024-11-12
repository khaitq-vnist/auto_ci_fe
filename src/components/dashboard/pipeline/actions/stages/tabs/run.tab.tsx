'use client'
import { Container, Card, Form, Button } from 'react-bootstrap';

const RunTab = () => {
    return (
        <Container>
            {/* Commands Section */}
            <Card className="mb-3">
                <Card.Header as="h5">Commands</Card.Header>
                <Card.Body>
                    <Form.Control as="textarea" rows={4} defaultValue="mvn clean install" />
                </Card.Body>
            </Card>

            {/* Shell and Error Handling Options */}
            <div className="d-flex justify-content-between mb-3">
                <Form.Group controlId="shellSelect" style={{ width: '45%' }}>
                    <Form.Label>Shell</Form.Label>
                    <Form.Select>
                        <option>Bash</option>
                        <option>Sh</option>
                        <option>Zsh</option>
                    </Form.Select>
                </Form.Group>
                
                <Form.Group controlId="errorHandlingSelect" style={{ width: '45%' }}>
                    <Form.Label>Error Handling</Form.Label>
                    <Form.Select>
                        <option>Mark as failed if any command throws an error</option>
                        <option>Ignore errors</option>
                    </Form.Select>
                </Form.Group>
            </div>

            {/* Save Changes Button */}
            <Button variant="primary" size="lg" className="w-100">
                Save changes
            </Button>
        </Container>
    );
};

export default RunTab;
