interface Command {
    id: number;
    command: string;
}

interface Variable {
    id: number;
    key: string;
    value: string;
}

interface Stage {
    id: number;
    name: string;
    type: string;
    docker_image: string;
    docker_image_tag: string;
    commands: Command[] | null;
    variables: Variable[] | null;
    services: any[] | null; // Adjust type if services have a defined structure
}

interface PipelineTemplate {
    id: number;
    name: string;
    build_tool: string;
    description: string;
    stages: Stage[] | null;
}

interface PipelineTemplateProps {
    template: PipelineTemplate | null;
}
