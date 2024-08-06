import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { contactApiSlice } from "../features/contactApiSlice";
import { useNavigate } from "react-router-dom";

export type ContactType = {
  id: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  address: string;
  status: string;
  photoUrl: string;
};

interface ContactProps {
  contact: ContactType;
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [deleteContact] = contactApiSlice.useDeleteContactMutation();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (confirmed) {
      try {
        await deleteContact(contact.id).unwrap();
        navigate("/contacts");
      } catch (error) {
        console.log("Failed to delete contact: ", error);
      }
    }
  };

  return (
    <>
      <Link
        to={`/contacts/${contact.id}`}
        className="flex w-80 items-start bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl m-6"
      >
        {" "}
        <div className="h-full flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden items-start">
            <img
              className="w-full h-full object-cover border-1 border-blue-400 rounded-full"
              src={contact.photoUrl}
              alt={contact.name}
            />
          </div>
          <Button
            onClick={(e) => handleDelete(e)}
            variant="contained"
            color="error"
            size="small"
            sx={{ mt: 3 }}
          >
            Delete
          </Button>
        </div>
        <div className="ml-4 w-full text-left">
          <p className="text-lg font-semibold text-gray-800 m-2 mt-0">
            {contact.name.substring(0, 15)}
          </p>
          <p className="bg-blue-500 text-white text-center text-xs py-1 px-2 rounded-2xl">
            {contact.title}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-700">
              <i className="bi bi-envelope mr-1"></i>{" "}
              {contact.email.substring(0, 20)}
            </p>
            <p className="text-sm text-gray-700">
              <i className="bi bi-geo mr-1"></i> {contact.address}
            </p>
            <p className="text-sm text-gray-700">
              <i className="bi bi-telephone mr-1"></i> {contact.phone}
            </p>
            <p className="text-sm text-gray-700">
              {contact.status.toLowerCase() === "active" ? (
                <i className="bi bi-check-circle text-green-700 mr-1"></i>
              ) : (
                <i className="bi bi-x-circle text-red-700 mr-1"></i>
              )}{" "}
              {contact.status}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Contact;
