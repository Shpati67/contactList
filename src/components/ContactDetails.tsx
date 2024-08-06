import Button from "@mui/material/Button";
import { contactApiSlice } from "../features/contactApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import EditContactDialog from "./EditContactDialog";

const ContactDetails = () => {
  const { id = "" } = useParams<{ id?: string }>();
  const [deleteContact] = contactApiSlice.useDeleteContactMutation();
  const { data: contact } = contactApiSlice.useGetContactByIdQuery({ id });
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  if (!contact) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (confirmed) {
      try {
        const response = await deleteContact(contact.id);
        if ("error" in response) {
          console.log("Failed to delete contact: ", response.error);
        } else {
          console.log("Contact deleted successfully");
          navigate(-1);
        }
      } catch (error) {
        console.log("Failed to delete contact: ", error);
      }
    }
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="text-2xl">
        Contact Details for <strong> {contact.name}</strong>
      </div>
      <div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-start p-4">
            <div className="flex items-center space-x-4">
              <img
                className="w-36 h-36 rounded-full"
                src={contact.photoUrl}
                alt={contact.name}
              />
              <div>
                <h2 className="text-4xl font-bold">{contact.name}</h2>
                <p className="bg-blue-500 text-white text-center text-xs mt-2 py-1 px-2 rounded-2xl">
                  {contact.title}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleEditOpen}
                variant="contained"
                color="primary"
                size="medium"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete()}
                variant="contained"
                color="error"
                size="medium"
              >
                Delete
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                size="medium"
                color="error"
              >
                Close
              </Button>
            </div>
          </div>
          <div className="mt-4 text-lg text-left ml-4">
            <p>
              <strong>Email:</strong> {contact.email}
            </p>
            <p>
              <strong>Phone:</strong> {contact.phone}
            </p>
            <p>
              <strong>Address:</strong> {contact.address}
            </p>
            <p>
              <strong>Status:</strong> {contact.status}
            </p>
          </div>
        </div>
      </div>
      <EditContactDialog
        open={editOpen}
        onClose={handleEditClose}
        contact={contact}
      />
    </div>
  );
};

export default ContactDetails;
