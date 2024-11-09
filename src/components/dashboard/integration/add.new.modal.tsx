import { FormIntegration } from "@/app/dashboard/integration/list.props";
import { ERROR_NULL_FIELD_REQUIRED } from "@/constants/error";
import { GITHUB_TYPE, GITLAB_TYPE } from "@/constants/integration.type";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

interface AddNewIntegrationModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (data:FormIntegration) => void;
}
const AddNewIntegrationModal = ({show, onClose, onSave} : AddNewIntegrationModalProps) => {
    const [formData, setFormData] = useState<FormIntegration>({
        type: GITHUB_TYPE,
        name: '',
        personalToken: '',
      });

    
      const handleChange = (e : any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleTypeChange = (type: string) => {
        setFormData((prevData) => ({
          ...prevData,
          type,
        }));
      };

      const handleSave = () => {
        if (!formData.name || !formData.personalToken) {
            toast.error(ERROR_NULL_FIELD_REQUIRED);
            return
        } 
        onSave(formData);
        setFormData({ type: GITHUB_TYPE, name: '', personalToken: '' }); // Reset form after save
        onClose();
      };
    
      return (
        <Modal show={show} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Integration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <div className="d-flex">
          
          <Button
            variant={formData.type === GITLAB_TYPE ? 'primary' : 'outline-primary'}
            onClick={() => handleTypeChange(GITLAB_TYPE)}
            className="me-2"
          >
            GitLab
          </Button>
          <Button
              variant={formData.type === GITHUB_TYPE ? 'primary' : 'outline-primary'}
              onClick={() => handleTypeChange(GITHUB_TYPE)}
            >
              GitHub
            </Button>
         
        </div>

        {/* Hidden input for form compatibility */}
        <input
          type="hidden"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </Form.Group>

    
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter integration name"
                  required
                />
              </Form.Group>
    
              <Form.Group className="mb-3">
                <Form.Label>Personal Token</Form.Label>
                <Form.Control
                  type="text"
                  name="personalToken"
                  value={formData.personalToken}
                  onChange={handleChange}
                  placeholder="Enter personal token"
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
          <ToastContainer position="top-right" autoClose={3000} />
        </Modal>
      );
}
export default AddNewIntegrationModal;