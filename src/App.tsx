import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import { login, register } from './api/auth'


const App: React.FC = () => {
  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
