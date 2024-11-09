import DashboardLayout from "@/layouts/dashboard.layout"
import { Project } from "./props";

interface ProjectPageProps {
    projects : Project[];
}
const ProjectPage = () => {
    return (
        <DashboardLayout>
            <div>
            <h1>Projects</h1>
        </div>
        </DashboardLayout>
        
    )
}
export default ProjectPage