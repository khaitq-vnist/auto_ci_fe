'use client'
// SettingsTab.tsx

import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import { useYamlContext } from '../../context/yaml.context';


const SettingsTab = () => {
    const { yamlData, updateYamlField } = useYamlContext();

    const [name, setName] = useState(yamlData.pipeline);
    const [trigger, setTrigger] = useState(yamlData.on);
    const [scope, setScope] = useState("Branch");
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranches, setSelectedBranches] = useState(yamlData.refs);

    // Mock API call to fetch branches when "Branch" is selected in CODE SCOPE
    useEffect(() => {
        if (scope === "Branch") {
            // Simulate an API call
            setTimeout(() => {
                setBranches(["main", "develop", "feature/new-feature", "bugfix/fix-bug"]);
            }, 500);
        } else {
            setBranches([]); // Clear branches if scope is not "Branch"
            setSelectedBranches([]); // Reset selected branches
        }
    }, [scope]);

    const handleBranchSelect = (branch: string) => {
        setSelectedBranches((prevSelected) =>
            prevSelected.includes(branch)
                ? prevSelected.filter((b) => b !== branch)
                : [...prevSelected, branch]
        );
    };

    // Update YAML fields in context whenever a setting is changed
    const handleSaveChanges = () => {
        console.log("Saving changes...");
        console.log(JSON.stringify(
            {
                pipeline: name,
                on: trigger,
                refs: selectedBranches
            },
            null,
            2
        ));
        updateYamlField("pipeline", name);       // Update the "pipeline" field in YAML context
        updateYamlField("on", trigger);          // Update the "on" field in YAML context
        updateYamlField("refs", selectedBranches); // Update the "refs" field in YAML context

        alert("Settings saved to YAML context!");
    };

    return (
        <Container>
            <Tab.Container defaultActiveKey="settings">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="settings">Settings</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    {/* Settings Tab */}
                    <Tab.Pane eventKey="settings">
                        <Card className="mb-3">
                            <Card.Body>
                                <Form.Group controlId="pipelineName" className="mb-3">
                                    <Form.Label>NAME</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="trigger" className="mb-3">
                                    <Form.Label>TRIGGER</Form.Label>
                                    <div className="d-flex">
                                        {["Manually", "On events", "On schedule"].map((option) => (
                                            <Button
                                                key={option}
                                                variant={trigger === option ? "primary" : "outline-primary"}
                                                onClick={() => setTrigger(option)}
                                                className="me-2"
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="scope" className="mb-3">
                                    <Form.Label>CODE SCOPE</Form.Label>
                                    <div className="d-flex">
                                        {["Branch", "Tag", "Wildcard", "Codeless"].map((option) => (
                                            <Button
                                                key={option}
                                                variant={scope === option ? "primary" : "outline-primary"}
                                                onClick={() => setScope(option)}
                                                className="me-2"
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>

                                {/* Conditional Branch List Display */}
                                {scope === "Branch" && (
                                    <Card className="mb-3">
                                        <Card.Header as="h5">Select Branches</Card.Header>
                                        <Card.Body>
                                            {branches.length > 0 ? (
                                                branches.map((branch) => (
                                                    <Form.Check
                                                        key={branch}
                                                        type="checkbox"
                                                        label={branch}
                                                        checked={selectedBranches.includes(branch)}
                                                        onChange={() => handleBranchSelect(branch)}
                                                    />
                                                ))
                                            ) : (
                                                <p>Loading branches...</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                )}
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            <Button variant="primary" size="lg" className="w-100" onClick={handleSaveChanges}>
                Save changes
            </Button>
        </Container>
    );
};

export default SettingsTab;
