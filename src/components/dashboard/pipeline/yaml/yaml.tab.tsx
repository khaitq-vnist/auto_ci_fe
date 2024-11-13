'use client'
// YamlTab.tsx

import React from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import yaml from 'js-yaml';
import { useYamlContext } from '../context/yaml.context';


const YamlTab: React.FC = () => {
    const { yamlData } = useYamlContext();
    const yamlOutput = yaml.dump(yamlData);

    return (
        <Container>
            <Card className="mb-3">
                <Card.Header as="h5">YAML Configuration</Card.Header>
                <Card.Body>
                    <Form.Control as="textarea" rows={20} value={yamlOutput} readOnly />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default YamlTab;
