import { FormIntegration } from "@/app/dashboard/integration/list.props";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface AddNewIntegrationModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (data:FormIntegration) => void;
}
const AddNewIntegrationModal = ({show, onClose, onSave} : AddNewIntegrationModalProps) => {
    const [formData, setFormData] = useState<FormIntegration>({
        type: '',
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
    
      const handleSave = () => {
        onSave(formData);
        setFormData({ type: '', name: '', personalToken: '' }); // Reset form after save
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
                <Form.Control
                  as="select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="gitlab">GitLab</option>
                  <option value="github">GitHub</option>
                </Form.Control>
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
        </Modal>
      );
}
export default AddNewIntegrationModal;