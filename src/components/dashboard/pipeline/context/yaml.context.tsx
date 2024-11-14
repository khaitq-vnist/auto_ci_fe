'use client'
// YamlContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';


// Define the shape of the YAML data
interface YamlData {
    pipeline: string;
    on: string;
    refs: string[];
    fetch_all_refs: boolean;
    trigger_conditions: { trigger_condition: string }[];
    actions: Array<{
        name: string;
        id: number;
        action: string;
        action_id: number;
        type: string;
        status: string;
        working_directory: string;
        docker_image_name: string;
        docker_image_tag: string;
        execute_commands: string[];
        setup_commands: string[];
        cached_dirs: string[];
        variables: Array<{ key: string; value: string }>;
        shell: string;
        main_service_name: string;
        cache_base_image: boolean;
        services: Array<{ type: string; id: number; version: string }>;
    }>;
}

// Define the context type
interface YamlContextType {
    yamlData: YamlData;
    setYamlData: (data: YamlData) => void;
    updateYamlField: (fieldPath: string, value: any) => void;
}

// Create the context with an empty initial value
const YamlContext = createContext<YamlContextType | undefined>(undefined);

// Provider component
export const YamlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initial YAML data as JSON
    const initialData: YamlData = {
        pipeline: "Build application",
        on: "ON_EVERY_EXECUTION",
        refs: ["refs/heads/main"],
        fetch_all_refs: true,
        trigger_conditions: [{ trigger_condition: "ALWAYS" }],
        actions: [
           
        ]
    };

    const [yamlData, setYamlData] = useState<YamlData>(initialData);

    // Function to update a specific field in the YAML data
    const updateYamlField = (fieldPath: string, value: any) => {
        setYamlData((prevData : YamlData) => {
            const dataCopy: YamlData = JSON.parse(JSON.stringify(prevData));
            
            const fieldParts = fieldPath.split('.');
            let current : any = dataCopy;
    
            for (let i = 0; i < fieldParts.length - 1; i++) {
                const part = fieldParts[i];
                if (!current[part] || typeof current[part] !== 'object') {
                    current[part] = {};
                }
                current = current[part];
            }
    
            current[fieldParts[fieldParts.length - 1]] = value;
            console.log("Updated data: ", dataCopy);
            
            return dataCopy;
        });
    };
    

    return (
        <YamlContext.Provider value={{ yamlData, setYamlData, updateYamlField }}>
            {children}
        </YamlContext.Provider>
    );
};

// Custom hook to use YAML context
export const useYamlContext = (): YamlContextType => {
    const context = useContext(YamlContext);
    if (!context) {
        throw new Error("useYamlContext must be used within a YamlProvider");
    }
    return context;
};
