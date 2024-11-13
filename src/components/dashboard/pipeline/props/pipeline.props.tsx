export interface PipelineProps {
    actions?: Stage[]
}

export interface Stage {
    id?: number
    name?: string
    docker_image_name?: string
    docker_image_tag?: string
    setup_commands?: string[]
    execute_commands?: string[]
    variables?: KeyValue[]
    services?: Service[]
    shell?: string
}
export interface KeyValue {
    id?: number
    key?: string
    value?: string
}
export interface Service {
    id?: number
    type?: string
}