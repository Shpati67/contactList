import { Box, Button, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import { authApiSlice } from "../features/authApiSlice";
import { selectToken } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SingUpForm: React.FC = () => {
  const [signup] = authApiSlice.useSignupMutation();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!token) return;
    navigate("/contacts");
  }, [token]);

  const onSubmit = async (values: {
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await signup(values).unwrap();
      toast.success(response.message || "User created");
      navigate("/login");
    } catch (error) {
      console.error("Failed to signup:", error);
      toast.error("Something went wrong. Failed to sign up!");
    }
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 300,
            }}
          >
            <Field name="username">
              {({ input }) => (
                <TextField
                  {...input}
                  label="Username"
                  variant="outlined"
                  required
                />
              )}
            </Field>
            <Field name="password">
              {({ input }) => (
                <TextField
                  {...input}
                  label="Password"
                  type="password"
                  variant="outlined"
                  required
                />
              )}
            </Field>
            <Field name="role">
              {({ input }) => (
                <TextField
                  {...input}
                  label="Role"
                  variant="outlined"
                  required
                />
              )}
            </Field>
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Box>
        )}
      />
    </Box>
  );
};

export default SingUpForm;
