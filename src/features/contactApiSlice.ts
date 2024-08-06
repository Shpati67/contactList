// src/features/contactApiSlice.ts
import { ContactType } from "../components/Contact";
import apiSlice from "../apiSlice";

export interface PageModel<T> {
  total: number;
  size: number;
  page: number;
  data: T[];
  sortedKey: string;
}

type ImageResponse = {
  photoUrl: string;
};

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContacts: builder.query<
      PageModel<ContactType>,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({ url: "/contacts", params: { page, size } }),

      providesTags: ["Contact"],
    }),
    getContactById: builder.query<ContactType, { id: string }>({
      query: ({ id }) => ({ url: `/contacts/${id}` }),
      providesTags: ["Contact"],
    }),
    searchContacts: builder.query<ContactType[], string>({
      query: (searchQuery) => ({
        url: `/contacts`,
        method: "GET",
        params: { name: searchQuery },
      }),
      providesTags: ["Contact"],
    }),
    uploadImageWithId: builder.mutation<ImageResponse, FormData>({
      query: (formData) => ({
        url: "contacts/photo",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Contact"],
    }),
    saveContact: builder.mutation<ContactType, ContactType>({
      query: (contact) => ({
        url: "/contacts",
        method: contact.id ? "PUT" : "POST",
        body: contact,
      }),
      invalidatesTags: ["Contact"],
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ["Contact"],
    }),
    updateContact: builder.mutation<ContactType, Partial<ContactType>>({
      query: (contact) => ({
        url: `/contacts/${contact.id}`,
        method: "PUT",
        body: contact,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});
