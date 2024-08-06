import { useDispatch } from "react-redux";
import { authApiSlice } from "../features/authApiSlice";
import { Field, Form } from "react-final-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { selectToken, setToken } from "../features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const LoginForm: React.FC = () => {
  const [login] = authApiSlice.useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  useEffect(() =>{
    if(!token) return;
    navigate("/contacts")
  }, [token])

  const onSubmit = async (values: { username: string; password: string }) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setToken(response));
      navigate("/contacts");
      toast.success("Login was successful!");
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error(
        "Failed to login. Your username or password may be incorrect!"
      );
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
        Log In
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
            <Button type="submit" variant="contained" color="primary">
              Log In
            </Button>
          </Box>
        )}
      />
    </Box>
  );
};

export default LoginForm;
