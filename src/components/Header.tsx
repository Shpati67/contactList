import Button from "@mui/material/Button";
import { useState } from "react";
import AddContactDialog from "./AddContactDialog";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
  nrOfContacts: number;
}

const Header: React.FC<HeaderProps> = ({ nrOfContacts }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="bg-gray-100 shadow-md rounded-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h3 className="text-lg text-spooky-black-1">
            {nrOfContacts} Contacts
          </h3>
          <div className="space-x-4">
            <Button variant="contained" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-square text-lg"></i>
              <span className="ml-2">Add New Contact</span>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <AddContactDialog open={showModal} handleClose={handleClose} />
    </>
  );
};

export default Header;
