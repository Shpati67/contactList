import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contactApiSlice } from "../features/contactApiSlice";
import Contact from "./Contact";
import { ContactType } from "./Contact";
import { TextField } from "@mui/material";

interface ContactListProps {
  setTotalContacts: (count: number) => void;
}

const ContactList: React.FC<ContactListProps> = ({ setTotalContacts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);

  const { data, error, isLoading } = searchQuery
    ? contactApiSlice.useSearchContactsQuery(searchQuery)
    : contactApiSlice.useGetAllContactsQuery({
        page: currentPage,
        size: 6,
      });

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        // If data is an array, use its length as total contacts
        setTotalContacts(data.length);
        setFilteredContacts(
          data.filter((contact: ContactType) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        // If data is paginated, use the total and data properties
        setTotalContacts(data.total);
        setFilteredContacts(
          data.data.filter((contact: ContactType) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }
  }, [data, searchQuery, setTotalContacts]);

  // const filteredContacts = data?.data?.filter((contact: ContactType) =>
  //   contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.toString()}</div>;

  return (
    <main className="p-4">
      <div>
        <TextField
          label="Search Contacts"
          variant="outlined"
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredContacts?.length === 0 && (
        <div>You have no contacts. Please create a new contact.</div>
      )}
      <ul className="flex flex-wrap justify-center m-5">
        {filteredContacts?.map((contact: ContactType) => (
          <Contact contact={contact} key={contact.id} />
        ))}
      </ul>

      {data &&
        filteredContacts &&
        filteredContacts?.length > 0 &&
        !Array.isArray(data) && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {[...Array(Math.ceil(data.total / data.size)).keys()].map(
              (page) => (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page + 1);
                  }}
                  className={`px-4 py-2 rounded ${
                    currentPage === page + 1
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-700"
                  }`}
                  key={page}
                >
                  {page + 1}
                </Link>
              )
            )}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(data.total / data.size)}
              className={`px-4 py-2 rounded ${
                currentPage === Math.ceil(data.total / data.size)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
    </main>
  );
};

export default ContactList;
