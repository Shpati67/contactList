import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  mode: "cors",
  prepareHeaders: (headers, { getState }) => {
    const state: any = getState();
    const token = state.auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const apiSlice = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),

  tagTypes: ["Contact"],
});

export default apiSlice;
