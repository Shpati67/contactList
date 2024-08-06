import apiSlice from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    signup: builder.mutation<
      { message: string },
      { username: string; password: string; role: string }
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Contact"],
    }),
    login: builder.mutation<
      { jwt: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});
