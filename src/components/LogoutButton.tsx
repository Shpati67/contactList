import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../features/authSlice";
import { contactApiSlice } from "../features/contactApiSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(contactApiSlice.util.resetApiState());
    navigate("/login");
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
