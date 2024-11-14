export interface PipelineProps {
    pipeline?: string
    on?: string
    ref?: string[]
    actions?: Stage[]
}

export interface Stage {
    id?: number
    name?: string
    status?: string
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
    docker_image_tag?: string
    host?: string
    port?: string
    user?: string
    password?: string
}