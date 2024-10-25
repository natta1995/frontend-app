import React from "react";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Feed from "./views/Feed";
import Profile from "./views/Profile";
import UserProfile from "./views/UserProfile";
import Layout from "./components/Layout";
import HandleUser from "./views/HandleUser";
import FindNewFriends from "./views/FindNewFriends";
import { login, register } from "./api/auth";
import ProtectedRoute from "./ProtectedRoute";

const App: React.FC = () => {
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await login(username, password);

    if (result.success) {
      return {
        success: true,
        message: result.message,
      };
    } else {
      return {
        success: false,
        message: result.message,
      };
    }
  };

  const handleRegister = async (
    username: string,
    password: string,
    name: string,
    email: string,
    age: number
  ) => {
    const result = await register(username, password, name, email, age);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />

          <Route element={<Layout />}>
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <HandleUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-friends"
              element={
                <ProtectedRoute>
                  <FindNewFriends />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
