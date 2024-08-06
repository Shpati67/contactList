import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" sx={{ mt: 4, mb: 12}}>
        Contact List
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/register")}
          sx={{ width: 200 }}
        >
          Sign Up
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ width: 200 }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
