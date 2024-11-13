'use client'

import MavenTab from '@/components/dashboard/pipeline/actions/stages/tabs/maven.tab';
import RunTab from '@/components/dashboard/pipeline/actions/stages/tabs/run.tab';
import { useState } from 'react';
import { Container, Button, Nav, Tab } from 'react-bootstrap';



const StageDetail = () => {
    const [initialTab, setInitialTab] = useState<string>('run');

    const handleClick = (tab: string) => {
        setInitialTab(tab);
    };

    return (
        <Container style={{ maxWidth: '800px', marginTop: '20px' }}>
            {/* Top Navigation */}
            <Nav variant="tabs" className="justify-content-start mb-3">
                <Nav.Item>
                    <Nav.Link eventKey="run" onClick={() => handleClick("run")}>Run</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="maven" onClick={() => handleClick("maven")}>maven @ 3.9.9</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="outline-primary" className="me-2">Services</Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="outline-primary" className="me-2">Variables</Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="outline-primary" className="me-2">Options</Button>
                </Nav.Item>
            </Nav>

            {/* Tab Container for different tabs */}
            <Tab.Container activeKey={initialTab}>
                <Tab.Content>
                    <Tab.Pane eventKey="run">
                        <RunTab />
                    </Tab.Pane>
                    <Tab.Pane eventKey="maven">
                        <MavenTab />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default StageDetail;
