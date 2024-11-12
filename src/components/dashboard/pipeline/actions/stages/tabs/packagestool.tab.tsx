'use client'

import { Container, Card, Form, Alert, Button } from 'react-bootstrap';

const PackagesToolsTab = () => {
    return (
        <Container>
            {/* Commands Section */}
            <Card className="mb-3">
                <Card.Header as="h5">Commands Executed on First Pipeline Run</Card.Header>
                <Card.Body>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Example: apt-get update && apt-get -y install git"
                    />
                </Card.Body>
            </Card>

            {/* Important Message */}
            <Alert variant="warning" className="mb-3">
                <strong>IMPORTANT:</strong> These commands are run before the pipeline filesystem with pulled repository is available.
            </Alert>

            {/* Save Changes Button */}
            <Button variant="primary" size="lg" className="w-100">
                Save changes
            </Button>
        </Container>
    );
};

export default PackagesToolsTab;