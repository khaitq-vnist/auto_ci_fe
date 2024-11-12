import DashboardLayout from "@/layouts/dashboard.layout"
import { Project } from "./props";

interface ProjectPageProps {
    projects : Project[];
}
const ProjectPage = () => {
    // Fetch projects from API or local storage
    const projects = [
        {
            name: "Project 1",
            lastActivity: "2 days ago",
            source: "GitHub",
        },
        {
            name: "Project 2",
            lastActivity: "1 week ago",
            source: "GitLab",
        },
        // Add more projects here
    ];
    
    return (
        <DashboardLayout>
            <div>
            <h1>Projects</h1>
        </div>
        </DashboardLayout>
        
    )
}
export default ProjectPage