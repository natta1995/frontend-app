import React from "react";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Feed from "./views/Feed";
import Profile from "./views/Profile";
import UserProfile from "./views/UserProfile";
import Layout from "./components/Layout";
import EditProfile from "./views/EditProfile";
import FindFriends from "./views/findFriends";
import MyFriends from "./views/MyFriends";
import { login, register } from "./api/auth";
import ProtectedRoute from "./ProtectedRoute";

const App: React.FC = () => {
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await login(username, password);

      if (result.success) {
        return true;
      } else {
        alert(result.message);
        return false;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return false;
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
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-friends"
              element={
                <ProtectedRoute>
                  <MyFriends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-friends"
              element={
                <ProtectedRoute>
                  <FindFriends />
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
