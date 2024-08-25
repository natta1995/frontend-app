import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';
import { login, register } from './api/auth';


const App: React.FC = () => {
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await login(username, password);
  
      if (result.success) {
        return true;  
      } else {
        alert(result.message);
        return false; 
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return false; 
    }
  };

  const handleRegister = async (username: string, password: string, name: string, email: string, age: number) => {
    const result = await register(username, password, name, email, age);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin}/>} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/feed" element={<Feed/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
