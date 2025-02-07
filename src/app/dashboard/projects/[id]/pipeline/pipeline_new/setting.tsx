'use client';

import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Spinner } from 'react-bootstrap';
import projectService from '@/utils/api/project.service';
import { useParams, useSearchParams } from 'next/navigation';

interface PipelineSettings {
    name: string;
    trigger: string;
    scope: string;
    branches: string[];
    events: string[];
}

interface SettingsProps {
    settings: PipelineSettings;
    onUpdateSettings: (updatedSettings: PipelineSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState<PipelineSettings>({
        ...settings,
        scope: 'Branch', // Default scope to "Branch"
        events: [], // Default events
    });
    const [branchOptions, setBranchOptions] = useState<string[]>([]);
    const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
    const eventOptions = ['PUSH']; // Hardcoded events
    const searchParams = useSearchParams();
    const params = useParams();

    useEffect(() => {
        if (localSettings.scope === 'Branch') {
            fetchBranches();
        }
    }, [localSettings.scope]);

    const handleUpdate = (key: keyof PipelineSettings, value: any) => {
        const updatedSettings = { ...localSettings, [key]: value };
        setLocalSettings(updatedSettings);
        onUpdateSettings(updatedSettings);
    };

    const fetchBranches = async (): Promise<void> => {
        try {
            setLoadingBranches(true);
            const { id } = params; // Get project ID from the query parameters

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
                <Form.Select
                    value={localSettings.trigger}
                    onChange={(e) => handleUpdate('trigger', e.target.value)}
                >
                    <option value="Manually">Manually</option>
                    <option value="EVENT">On events</option>
                </Form.Select>
            </Form.Group>

            {/* Event Selection */}
            {localSettings.trigger === 'EVENT' && (
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Select Events</Form.Label>
                    <Table bordered>
                        <tbody>
                            {eventOptions.map((event) => (
                                <tr key={event}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            label={event}
                                            checked={localSettings.events.includes(event)}
                                            onChange={(e) => {
                                                const updatedEvents = e.target.checked
                                                    ? [...localSettings.events, event]
                                                    : localSettings.events.filter((ev) => ev !== event);
                                                handleUpdate('events', updatedEvents);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form.Group>
            )}

            {/* Code Scope */}
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Code Scope</Form.Label>
                <Form.Select
                    value={localSettings.scope}
                    onChange={(e) => handleUpdate('scope', e.target.value)}
                >
                    <option value="Branch">Branch</option>
                </Form.Select>
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
