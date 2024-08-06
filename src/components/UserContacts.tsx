import { useState } from "react";
import Header from "./Header";
import ContactList from "./ContactList";


const UserContacts: React.FC = () => {
    const [totalContacts, setTotalContacts] = useState(0);

  return (
    <>
      <Header nrOfContacts={totalContacts} />
      <ContactList setTotalContacts={setTotalContacts} />
    </>
  )
}

export default UserContacts