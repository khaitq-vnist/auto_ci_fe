'use client';

import React, { useState, useEffect } from 'react';
import { Container, Form, ToggleButton, ButtonGroup, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import projectService from '@/utils/api/project.service';

// Mock API to simulate fetching branch data
const fetchBranchesMockApi = async (): Promise<{ branches: string[] }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                branches: ['main', 'develop', 'feature/new-feature', 'bugfix/fix-bug'],
            });
        }, 1000); // Simulate 1-second delay
    });
};

interface PipelineSettings {
    name: string;
    trigger: string;
    scope: string;
    branches: string[];
}

interface SettingsProps {
    settings: PipelineSettings;
    onUpdateSettings: (updatedSettings: PipelineSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState<PipelineSettings>({
        ...settings,
        scope: 'Branch', // Set default scope to "Branch"
    });
    const [branchOptions, setBranchOptions] = useState<string[]>([]);
    const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
    const params = useParams()
    // Fetch branches when the page loads if the default scope is "Branch"
    useEffect(() => {
        if (localSettings.scope === 'Branch') {
            fetchBranches();
        }
    }, [localSettings.scope]);

    const handleUpdate = (key: keyof PipelineSettings, value: any) => {
        const updatedSettings = { ...localSettings, [key]: value };
        setLocalSettings(updatedSettings);
        onUpdateSettings(updatedSettings);

        // Fetch branch list when code scope is set to "Branch"
        if (key === 'scope' && value === 'Branch') {
            fetchBranches();
        }
    };

    const fetchBranches = async (): Promise<void> => {
        try {
            setLoadingBranches(true);
            const { id } = params // Get project ID from the query parameters

            if (!id) {
                console.error('Project ID is missing in the query parameters.');
                return;
            }

            const response = await projectService.fetchListBranches(Number(id)); // Replace with real API call
            if (response.status === 200 && response.data) {
                const branchNames = response.data.data.map((branch: any) => branch.name);
                setBranchOptions(branchNames);
            } else {
                console.error('Failed to fetch branches. API response:', response);
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        } finally {
            setLoadingBranches(false);
        }
    };

    return (
        <Container>
            <h3 className="mb-4">Pipeline Settings</h3>

            {/* Name */}
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Name</Form.Label>
                <Form.Control
                    type="text"
                    value={localSettings.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                    placeholder="Enter pipeline name"
                />
            </Form.Group>

            {/* Trigger */}
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Trigger</Form.Label>
                <ButtonGroup className="d-flex">
                    {['Manually', 'On events', 'On schedule'].map((trigger) => (
                        <ToggleButton
                            key={`trigger-${trigger}`}
                            id={`trigger-${trigger}`}
                            type="radio"
                            variant="outline-primary"
                            name="trigger"
                            value={trigger}
                            checked={localSettings.trigger === trigger}
                            onChange={() => handleUpdate('trigger', trigger)}
                            className="flex-fill"
                        >
                            {trigger}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Form.Group>

            {/* Code Scope */}
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Code Scope</Form.Label>
                <ButtonGroup className="d-flex">
                    {['Branch', 'Tag', 'Wildcard', 'Codeless'].map((scope) => (
                        <ToggleButton
                            key={`scope-${scope}`}
                            id={`scope-${scope}`}
                            type="radio"
                            variant="outline-primary"
                            name="scope"
                            value={scope}
                            checked={localSettings.scope === scope}
                            onChange={() => handleUpdate('scope', scope)}
                            className="flex-fill"
                        >
                            {scope}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Form.Group>

            {/* Branch Selection */}
            {localSettings.scope === 'Branch' && (
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Select Branches</Form.Label>
                    {loadingBranches ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table bordered>
                            <tbody>
                                {branchOptions.map((branch) => (
                                    <tr key={branch}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                label={branch}
                                                checked={localSettings.branches.includes(branch)}
                                                onChange={(e) => {
                                                    const updatedBranches = e.target.checked
                                                        ? [...localSettings.branches, branch]
                                                        : localSettings.branches.filter((b) => b !== branch);
                                                    handleUpdate('branches', updatedBranches);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Form.Group>
            )}
        </Container>
    );
};

export default Settings;
