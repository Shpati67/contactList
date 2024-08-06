import { Routes, Route } from "react-router-dom";
import "./App.css";
import UserContacts from "./components/UserContacts";
import ContactDetails from "./components/ContactDetails";
import { ToastContainer } from "react-toastify";
import SingUpForm from "./components/SingUpForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setToken } from "./features/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SingUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <UserContacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts/:id"
          element={
            <ProtectedRoute>
              <ContactDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
